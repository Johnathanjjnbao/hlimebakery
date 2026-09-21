-- Production security boundary for Hlime V1.
-- Public catalog/settings are read-only, orders are private, and mutations require
-- an authenticated user present in public.admin_users.

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users as au
    where au.user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_admin() from public, anon, authenticated;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_size_options enable row level security;
alter table public.product_flavor_options enable row level security;
alter table public.homepage_settings enable row level security;
alter table public.site_settings enable row level security;
alter table public.order_settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public content: only records intended for the website are visible anonymously.
create policy categories_public_read
on public.categories
for select
to anon, authenticated
using (active);

create policy categories_admin_all
on public.categories
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy products_public_read
on public.products
for select
to anon, authenticated
using (active);

create policy products_admin_all
on public.products
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy product_size_options_public_read
on public.product_size_options
for select
to anon, authenticated
using (
  active
  and exists (
    select 1
    from public.products as p
    where p.id = product_size_options.product_id
      and p.active
  )
);

create policy product_size_options_admin_all
on public.product_size_options
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy product_flavor_options_public_read
on public.product_flavor_options
for select
to anon, authenticated
using (
  active
  and exists (
    select 1
    from public.products as p
    where p.id = product_flavor_options.product_id
      and p.active
  )
);

create policy product_flavor_options_admin_all
on public.product_flavor_options
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy homepage_settings_public_read
on public.homepage_settings
for select
to anon, authenticated
using (active);

create policy homepage_settings_admin_all
on public.homepage_settings
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy site_settings_public_read
on public.site_settings
for select
to anon, authenticated
using (true);

create policy site_settings_admin_all
on public.site_settings
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy order_settings_public_read
on public.order_settings
for select
to anon, authenticated
using (true);

create policy order_settings_admin_all
on public.order_settings
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

-- Orders contain customer data. No public or non-admin policy is created.
create policy orders_admin_read
on public.orders
for select
to authenticated
using ((select private.is_admin()));

create policy order_items_admin_read
on public.order_items
for select
to authenticated
using ((select private.is_admin()));

-- Remove broad Data API defaults, then grant only operations backed by the RLS
-- policies above. Order writes remain function-only.
revoke all on table
  public.categories,
  public.products,
  public.product_size_options,
  public.product_flavor_options,
  public.homepage_settings,
  public.site_settings,
  public.order_settings,
  public.orders,
  public.order_items,
  public.admin_users
from anon, authenticated;

grant select on table
  public.categories,
  public.products,
  public.product_size_options,
  public.product_flavor_options,
  public.homepage_settings,
  public.site_settings,
  public.order_settings
to anon, authenticated;

grant insert, update, delete on table
  public.categories,
  public.products,
  public.product_size_options,
  public.product_flavor_options,
  public.homepage_settings,
  public.site_settings,
  public.order_settings
to authenticated;

grant select on table public.orders, public.order_items, public.admin_users
to authenticated;

revoke all on sequence
  public.categories_id_seq,
  public.products_id_seq,
  public.product_size_options_id_seq,
  public.product_flavor_options_id_seq,
  public.homepage_settings_id_seq,
  public.orders_id_seq,
  public.order_items_id_seq
from anon, authenticated;

grant usage, select on sequence
  public.categories_id_seq,
  public.products_id_seq,
  public.product_size_options_id_seq,
  public.product_flavor_options_id_seq,
  public.homepage_settings_id_seq
to authenticated;

-- Replace only the known pre-Security demo placeholder; owner-managed copy is
-- otherwise left untouched.
update public.order_settings
set
  submit_help_vi = 'Đơn được gửi ở trạng thái PENDING để Hlime kiểm tra và xác nhận.',
  submit_help_ko = '주문은 PENDING 상태로 전송되며 Hlime이 확인합니다.'
where id = 1
  and submit_help_vi = 'Gửi order công khai sẽ được mở sau bước Security/RLS.'
  and submit_help_ko = '공개 주문은 Security/RLS 단계 이후 활성화됩니다.';

create or replace function public.submit_order(
  p_client_request_id uuid,
  p_order jsonb
)
returns table (
  order_id bigint,
  client_request_id uuid,
  order_status text,
  subtotal_amount bigint
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_existing_id bigint;
  v_existing_status text;
  v_existing_subtotal bigint;
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
  v_order_id bigint;
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

  -- Serialize retries for the same idempotency key before checking/inserting.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_client_request_id::text, 0)
  );

  select o.id, o.status, o.subtotal_amount
  into v_existing_id, v_existing_status, v_existing_subtotal
  from public.orders as o
  where o.client_request_id = p_client_request_id;

  if found then
    return query
      select v_existing_id, p_client_request_id, v_existing_status, v_existing_subtotal;
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

  insert into public.orders (
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
    confirmed_at
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
    null
  ) returning id into v_order_id;

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
    select v_order_id, p_client_request_id, 'PENDING'::text, v_total;
end;
$$;

comment on function public.submit_order(uuid, jsonb) is
  'Creates an idempotent PENDING order using authoritative catalog prices and validated item snapshots.';

revoke all on function public.submit_order(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.submit_order(uuid, jsonb) to anon, authenticated;

create or replace function public.confirm_order(p_order_id bigint)
returns table (
  order_id bigint,
  order_status text,
  confirmed_at timestamptz
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
    set status = 'CONFIRMED', confirmed_at = now()
    where o.id = p_order_id
      and o.status = 'PENDING'
    returning o.id, o.status, o.confirmed_at;

  if not found then
    raise exception using errcode = '22023', message = 'Order is not pending or does not exist';
  end if;
end;
$$;

comment on function public.confirm_order(bigint) is
  'Allows an allowlisted Admin to perform the only V1 order transition: PENDING to CONFIRMED.';

revoke all on function public.confirm_order(bigint) from public, anon, authenticated;
grant execute on function public.confirm_order(bigint) to authenticated;

-- Public bucket objects remain readable through public URLs. Only allowlisted
-- Admin users may mutate objects in this specific bucket.
create policy hlime_public_admin_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'hlime-public'
  and (select private.is_admin())
);

create policy hlime_public_admin_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'hlime-public'
  and (select private.is_admin())
)
with check (
  bucket_id = 'hlime-public'
  and (select private.is_admin())
);

create policy hlime_public_admin_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'hlime-public'
  and (select private.is_admin())
);
