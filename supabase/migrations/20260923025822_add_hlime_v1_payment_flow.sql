-- Hlime V1 payment: dynamic bank transfer QR, cash, and manual Admin payment confirmation.
-- Existing orders predate payment selection and are treated as CASH / UNPAID.

alter table public.order_settings
  add column bank_transfer_enabled boolean not null default false,
  add column cash_enabled boolean not null default true,
  add column bank_id text,
  add column bank_name text,
  add column bank_account_no text,
  add column bank_account_name text,
  add column payment_instruction_vi text,
  add column payment_instruction_ko text,
  add constraint order_settings_payment_method_enabled_check check (
    bank_transfer_enabled or cash_enabled
  ),
  add constraint order_settings_bank_transfer_config_check check (
    not bank_transfer_enabled
    or (
      nullif(btrim(bank_id), '') is not null
      and bank_id ~ '^[A-Za-z0-9_-]{2,20}$'
      and nullif(btrim(bank_name), '') is not null
      and char_length(bank_name) <= 160
      and nullif(btrim(bank_account_no), '') is not null
      and bank_account_no ~ '^[A-Za-z0-9.-]{3,34}$'
      and nullif(btrim(bank_account_name), '') is not null
      and char_length(bank_account_name) <= 160
    )
  );

insert into public.order_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.orders
  add column order_code text,
  add column payment_method text not null default 'CASH',
  add column payment_status text not null default 'UNPAID',
  add column paid_at timestamptz,
  add column payment_bank_id_snapshot text,
  add column payment_bank_name_snapshot text,
  add column payment_account_no_snapshot text,
  add column payment_account_name_snapshot text;

update public.orders
set order_code = 'HL' || lpad(id::text, 8, '0')
where order_code is null;

alter table public.orders
  alter column order_code set not null,
  add constraint orders_order_code_unique unique (order_code),
  add constraint orders_order_code_format_check check (order_code ~ '^HL[0-9]{8,}$'),
  add constraint orders_payment_method_check check (
    payment_method in ('BANK_TRANSFER', 'CASH')
  ),
  add constraint orders_payment_status_check check (
    payment_status in ('UNPAID', 'PAID')
  ),
  add constraint orders_paid_at_check check (
    (payment_status = 'UNPAID' and paid_at is null)
    or (payment_status = 'PAID' and paid_at is not null)
  ),
  add constraint orders_payment_receiver_snapshot_check check (
    (
      payment_method = 'CASH'
      and payment_bank_id_snapshot is null
      and payment_bank_name_snapshot is null
      and payment_account_no_snapshot is null
      and payment_account_name_snapshot is null
    )
    or
    (
      payment_method = 'BANK_TRANSFER'
      and nullif(btrim(payment_bank_id_snapshot), '') is not null
      and nullif(btrim(payment_bank_name_snapshot), '') is not null
      and nullif(btrim(payment_account_no_snapshot), '') is not null
      and nullif(btrim(payment_account_name_snapshot), '') is not null
    )
  );

create or replace function private.hlime_set_order_code()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.order_code is null then
    new.order_code := 'HL' || lpad(new.id::text, 8, '0');
  end if;
  return new;
end;
$$;

revoke all on function private.hlime_set_order_code() from public, anon, authenticated;

create trigger orders_set_order_code
before insert on public.orders
for each row execute function private.hlime_set_order_code();

drop function public.submit_order(uuid, jsonb);

create or replace function public.submit_order(
  p_client_request_id uuid,
  p_order jsonb
)
returns table (
  order_id bigint,
  order_code text,
  client_request_id uuid,
  order_status text,
  subtotal_amount bigint,
  payment_method text,
  payment_status text,
  paid_at timestamptz,
  payment_bank_id text,
  payment_bank_name text,
  payment_account_no text,
  payment_account_name text,
  payment_instruction_vi text,
  payment_instruction_ko text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_existing public.orders%rowtype;
  v_settings public.order_settings%rowtype;
  v_locale text;
  v_customer_name text;
  v_customer_phone text;
  v_customer_email text;
  v_fulfillment_type text;
  v_delivery_address text;
  v_delivery_note text;
  v_requested_date date;
  v_requested_time text;
  v_order_note text;
  v_payment_method text;
  v_order_id bigint;
  v_order_code text;
  v_total bigint := 0;
  v_item jsonb;
  v_product_slug text;
  v_quantity integer;
  v_product record;
  v_size record;
  v_flavor record;
  v_celebration_date date;
  v_celebration_note text;
begin
  if p_client_request_id is null then
    raise exception using errcode = '22023', message = 'client_request_id is required';
  end if;

  if p_order is null or jsonb_typeof(p_order) <> 'object' then
    raise exception using errcode = '22023', message = 'Order payload must be an object';
  end if;

  if p_order ? 'payment_status' or p_order ? 'paid_at' then
    raise exception using errcode = '22023', message = 'Payment state is server-managed';
  end if;

  v_payment_method := btrim(coalesce(p_order ->> 'payment_method', ''));
  if v_payment_method not in ('BANK_TRANSFER', 'CASH') then
    raise exception using errcode = '22023', message = 'Payment method is invalid';
  end if;

  select settings.*
  into v_settings
  from public.order_settings as settings
  where settings.id = 1;

  if not found then
    raise exception using errcode = '55000', message = 'Payment settings are unavailable';
  end if;

  if (v_payment_method = 'BANK_TRANSFER' and not v_settings.bank_transfer_enabled)
    or (v_payment_method = 'CASH' and not v_settings.cash_enabled) then
    raise exception using errcode = '22023', message = 'Payment method is disabled';
  end if;

  -- Serialize retries for the same idempotency key before checking/inserting.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_client_request_id::text, 0)
  );

  select o.*
  into v_existing
  from public.orders as o
  where o.client_request_id = p_client_request_id;

  if found then
    return query
      select
        v_existing.id,
        v_existing.order_code,
        v_existing.client_request_id,
        v_existing.status,
        v_existing.subtotal_amount,
        v_existing.payment_method,
        v_existing.payment_status,
        v_existing.paid_at,
        v_existing.payment_bank_id_snapshot,
        v_existing.payment_bank_name_snapshot,
        v_existing.payment_account_no_snapshot,
        v_existing.payment_account_name_snapshot,
        case when v_existing.payment_method = 'BANK_TRANSFER' then v_settings.payment_instruction_vi end,
        case when v_existing.payment_method = 'BANK_TRANSFER' then v_settings.payment_instruction_ko end;
    return;
  end if;

  v_locale := btrim(coalesce(p_order ->> 'locale', 'vi'));
  v_customer_name := btrim(coalesce(p_order ->> 'customer_name', ''));
  v_customer_phone := btrim(coalesce(p_order ->> 'customer_phone', ''));
  v_customer_email := nullif(btrim(coalesce(p_order ->> 'customer_email', '')), '');
  v_fulfillment_type := btrim(coalesce(p_order ->> 'fulfillment_type', ''));
  v_delivery_address := nullif(btrim(coalesce(p_order ->> 'delivery_address', '')), '');
  v_delivery_note := nullif(btrim(coalesce(p_order ->> 'delivery_note', '')), '');
  v_requested_time := btrim(coalesce(p_order ->> 'requested_fulfillment_time', ''));
  v_order_note := nullif(btrim(coalesce(p_order ->> 'order_note', '')), '');

  if v_locale not in ('vi', 'ko') then
    raise exception using errcode = '22023', message = 'Unsupported locale';
  end if;

  if char_length(v_customer_name) not between 1 and 160 then
    raise exception using errcode = '22023', message = 'Customer name is invalid';
  end if;

  if char_length(v_customer_phone) not between 5 and 32 then
    raise exception using errcode = '22023', message = 'Customer phone is invalid';
  end if;

  if v_customer_email is not null and (
    char_length(v_customer_email) > 254
    or v_customer_email !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
  ) then
    raise exception using errcode = '22023', message = 'Customer email is invalid';
  end if;

  if v_fulfillment_type not in ('pickup', 'delivery') then
    raise exception using errcode = '22023', message = 'Fulfillment type is invalid';
  end if;

  if v_fulfillment_type = 'delivery' then
    if v_delivery_address is null or char_length(v_delivery_address) > 500 then
      raise exception using errcode = '22023', message = 'Delivery address is required';
    end if;
    if v_delivery_note is not null and char_length(v_delivery_note) > 1000 then
      raise exception using errcode = '22023', message = 'Delivery note is too long';
    end if;
  else
    v_delivery_address := null;
    v_delivery_note := null;
  end if;

  if coalesce(p_order ->> 'requested_fulfillment_date', '') !~ '^\d{4}-\d{2}-\d{2}$' then
    raise exception using errcode = '22023', message = 'Requested date is invalid';
  end if;

  begin
    v_requested_date := (p_order ->> 'requested_fulfillment_date')::date;
  exception
    when invalid_text_representation or datetime_field_overflow then
      raise exception using errcode = '22023', message = 'Requested date is invalid';
  end;

  if v_requested_date < current_date or v_requested_date > current_date + 365 then
    raise exception using errcode = '22023', message = 'Requested date is outside the accepted range';
  end if;

  if v_requested_time not in (
    '09:00 – 12:00',
    '12:00 – 16:00',
    '16:00 – 20:00'
  ) then
    raise exception using errcode = '22023', message = 'Requested time is invalid';
  end if;

  if v_order_note is not null and char_length(v_order_note) > 2000 then
    raise exception using errcode = '22023', message = 'Order note is too long';
  end if;

  if jsonb_typeof(p_order -> 'items') <> 'array'
    or jsonb_array_length(p_order -> 'items') not between 1 and 50 then
    raise exception using errcode = '22023', message = 'Order must contain between 1 and 50 items';
  end if;

  insert into public.orders as inserted (
    client_request_id,
    locale,
    customer_name,
    customer_phone,
    customer_email,
    fulfillment_type,
    delivery_address,
    delivery_note,
    requested_fulfillment_date,
    requested_fulfillment_time,
    order_note,
    subtotal_amount,
    currency_code,
    status,
    confirmed_at,
    payment_method,
    payment_status,
    paid_at,
    payment_bank_id_snapshot,
    payment_bank_name_snapshot,
    payment_account_no_snapshot,
    payment_account_name_snapshot
  ) values (
    p_client_request_id,
    v_locale,
    v_customer_name,
    v_customer_phone,
    v_customer_email,
    v_fulfillment_type,
    v_delivery_address,
    v_delivery_note,
    v_requested_date,
    v_requested_time,
    v_order_note,
    0,
    'VND',
    'PENDING',
    null,
    v_payment_method,
    'UNPAID',
    null,
    case when v_payment_method = 'BANK_TRANSFER' then btrim(v_settings.bank_id) end,
    case when v_payment_method = 'BANK_TRANSFER' then btrim(v_settings.bank_name) end,
    case when v_payment_method = 'BANK_TRANSFER' then btrim(v_settings.bank_account_no) end,
    case when v_payment_method = 'BANK_TRANSFER' then btrim(v_settings.bank_account_name) end
  ) returning inserted.id, inserted.order_code into v_order_id, v_order_code;

  for v_item in
    select item.value
    from jsonb_array_elements(p_order -> 'items') as item(value)
  loop
    if jsonb_typeof(v_item) <> 'object' then
      raise exception using errcode = '22023', message = 'Each order item must be an object';
    end if;

    v_product_slug := btrim(coalesce(v_item ->> 'product_slug', ''));
    if v_product_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
      raise exception using errcode = '22023', message = 'Order item product is invalid';
    end if;

    if coalesce(v_item ->> 'quantity', '') !~ '^[1-9][0-9]?$' then
      raise exception using errcode = '22023', message = 'Order item quantity is invalid';
    end if;
    v_quantity := (v_item ->> 'quantity')::integer;

    select
      p.id,
      p.name_vi,
      p.name_ko,
      p.price_amount,
      c.slug as category_slug
    into v_product
    from public.products as p
    join public.categories as c on c.id = p.category_id
    where p.slug = v_product_slug
      and p.active
      and p.available
      and c.active;

    if not found then
      raise exception using errcode = '22023', message = 'An order item is unavailable';
    end if;

    if v_product.category_slug = 'celebration' then
      select s.id, s.option_key, s.label_vi, s.label_ko
      into v_size
      from public.product_size_options as s
      where s.product_id = v_product.id
        and s.option_key = btrim(coalesce(v_item ->> 'size_option_key', ''))
        and s.active;

      if not found then
        raise exception using errcode = '22023', message = 'Celebration size is invalid';
      end if;

      select f.id, f.option_key, f.label_vi, f.label_ko
      into v_flavor
      from public.product_flavor_options as f
      where f.product_id = v_product.id
        and f.option_key = btrim(coalesce(v_item ->> 'flavor_option_key', ''))
        and f.active;

      if not found then
        raise exception using errcode = '22023', message = 'Celebration flavor is invalid';
      end if;

      if coalesce(v_item ->> 'celebration_required_date', '') !~ '^\d{4}-\d{2}-\d{2}$' then
        raise exception using errcode = '22023', message = 'Celebration date is invalid';
      end if;

      begin
        v_celebration_date := (v_item ->> 'celebration_required_date')::date;
      exception
        when invalid_text_representation or datetime_field_overflow then
          raise exception using errcode = '22023', message = 'Celebration date is invalid';
      end;

      if v_celebration_date < current_date or v_celebration_date > current_date + 365 then
        raise exception using errcode = '22023', message = 'Celebration date is outside the accepted range';
      end if;

      v_celebration_note := nullif(btrim(coalesce(v_item ->> 'celebration_note', '')), '');
      if v_celebration_note is not null and char_length(v_celebration_note) > 500 then
        raise exception using errcode = '22023', message = 'Celebration note is too long';
      end if;

      insert into public.order_items (
        order_id,
        product_id,
        product_name_vi,
        product_name_ko,
        quantity,
        unit_price_amount,
        is_celebration,
        selected_size_option_id,
        selected_size_key,
        selected_size_label_vi,
        selected_size_label_ko,
        selected_flavor_option_id,
        selected_flavor_key,
        selected_flavor_label_vi,
        selected_flavor_label_ko,
        celebration_required_date,
        celebration_note
      ) values (
        v_order_id,
        v_product.id,
        v_product.name_vi,
        v_product.name_ko,
        v_quantity,
        v_product.price_amount,
        true,
        v_size.id,
        v_size.option_key,
        v_size.label_vi,
        v_size.label_ko,
        v_flavor.id,
        v_flavor.option_key,
        v_flavor.label_vi,
        v_flavor.label_ko,
        v_celebration_date,
        v_celebration_note
      );
    else
      if nullif(btrim(coalesce(v_item ->> 'size_option_key', '')), '') is not null
        or nullif(btrim(coalesce(v_item ->> 'flavor_option_key', '')), '') is not null
        or nullif(btrim(coalesce(v_item ->> 'celebration_required_date', '')), '') is not null
        or nullif(btrim(coalesce(v_item ->> 'celebration_note', '')), '') is not null then
        raise exception using errcode = '22023', message = 'Celebration options are not valid for this product';
      end if;

      insert into public.order_items (
        order_id,
        product_id,
        product_name_vi,
        product_name_ko,
        quantity,
        unit_price_amount,
        is_celebration
      ) values (
        v_order_id,
        v_product.id,
        v_product.name_vi,
        v_product.name_ko,
        v_quantity,
        v_product.price_amount,
        false
      );
    end if;

    v_total := v_total + (v_product.price_amount * v_quantity);
  end loop;

  update public.orders as o
  set subtotal_amount = v_total
  where o.id = v_order_id;

  return query
    select
      v_order_id,
      v_order_code,
      p_client_request_id,
      'PENDING'::text,
      v_total,
      v_payment_method,
      'UNPAID'::text,
      null::timestamptz,
      case when v_payment_method = 'BANK_TRANSFER' then btrim(v_settings.bank_id) end,
      case when v_payment_method = 'BANK_TRANSFER' then btrim(v_settings.bank_name) end,
      case when v_payment_method = 'BANK_TRANSFER' then btrim(v_settings.bank_account_no) end,
      case when v_payment_method = 'BANK_TRANSFER' then btrim(v_settings.bank_account_name) end,
      case when v_payment_method = 'BANK_TRANSFER' then v_settings.payment_instruction_vi end,
      case when v_payment_method = 'BANK_TRANSFER' then v_settings.payment_instruction_ko end;
end;
$$;

comment on function public.submit_order(uuid, jsonb) is
  'Creates an idempotent PENDING / UNPAID order using authoritative prices and a server-side payment receiver snapshot.';

revoke all on function public.submit_order(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.submit_order(uuid, jsonb) to anon, authenticated;

create or replace function public.mark_order_paid(p_order_id bigint)
returns table (
  order_id bigint,
  order_status text,
  payment_status text,
  paid_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (select private.is_admin()) then
    raise exception using errcode = '42501', message = 'Admin access required';
  end if;

  return query
    update public.orders as o
    set payment_status = 'PAID', paid_at = now()
    where o.id = p_order_id
      and o.payment_status = 'UNPAID'
    returning o.id, o.status, o.payment_status, o.paid_at;

  if not found then
    raise exception using errcode = '22023', message = 'Order is already paid or does not exist';
  end if;
end;
$$;

comment on function public.mark_order_paid(bigint) is
  'Allows an allowlisted Admin to perform the V1 payment transition UNPAID to PAID without changing order status.';

revoke all on function public.mark_order_paid(bigint) from public, anon, authenticated;
grant execute on function public.mark_order_paid(bigint) to authenticated;

comment on column public.orders.order_code is
  'Short public-safe order identifier used as VietQR transfer addInfo.';

comment on column public.orders.payment_status is
  'Server-managed payment state. Public submission always creates UNPAID orders.';
