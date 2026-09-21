-- Hlime V1 database schema.
-- Database only: no seed data, Storage, Auth integration, RLS policies, or grants.

create schema if not exists private;

create or replace function private.hlime_set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.hlime_set_updated_at() from public;

create table public.categories (
  id bigint generated always as identity primary key,
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name_vi text not null
    check (btrim(name_vi) <> ''),
  name_ko text
    check (name_ko is null or btrim(name_ko) <> ''),
  short_description_vi text,
  short_description_ko text,
  image_path text,
  active boolean not null default true,
  display_order integer not null default 0
    check (display_order >= 0),
  vi_content_version bigint not null default 1
    check (vi_content_version > 0),
  ko_translation_status text not null default 'missing'
    check (ko_translation_status in ('missing', 'machine', 'reviewed', 'manual', 'stale')),
  ko_source_vi_version bigint
    check (ko_source_vi_version is null or ko_source_vi_version > 0),
  ko_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_translation_version_check check (
    (ko_translation_status = 'missing' and ko_source_vi_version is null)
    or
    (ko_translation_status <> 'missing'
      and ko_source_vi_version is not null
      and ko_source_vi_version <= vi_content_version)
  )
);

create table public.products (
  id bigint generated always as identity primary key,
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category_id bigint not null
    references public.categories (id) on delete restrict,
  name_vi text not null
    check (btrim(name_vi) <> ''),
  name_ko text
    check (name_ko is null or btrim(name_ko) <> ''),
  short_description_vi text,
  short_description_ko text,
  description_vi text,
  description_ko text,
  price_amount bigint not null
    check (price_amount >= 0),
  image_path text,
  active boolean not null default false,
  available boolean not null default true,
  featured boolean not null default false,
  best_seller boolean not null default false,
  display_order integer not null default 0
    check (display_order >= 0),
  vi_content_version bigint not null default 1
    check (vi_content_version > 0),
  ko_translation_status text not null default 'missing'
    check (ko_translation_status in ('missing', 'machine', 'reviewed', 'manual', 'stale')),
  ko_source_vi_version bigint
    check (ko_source_vi_version is null or ko_source_vi_version > 0),
  ko_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_active_image_check check (
    not active or nullif(btrim(image_path), '') is not null
  ),
  constraint products_translation_version_check check (
    (ko_translation_status = 'missing' and ko_source_vi_version is null)
    or
    (ko_translation_status <> 'missing'
      and ko_source_vi_version is not null
      and ko_source_vi_version <= vi_content_version)
  )
);

create table public.product_size_options (
  id bigint generated always as identity primary key,
  product_id bigint not null
    references public.products (id) on delete cascade,
  option_key text not null
    check (option_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  label_vi text not null
    check (btrim(label_vi) <> ''),
  label_ko text
    check (label_ko is null or btrim(label_ko) <> ''),
  active boolean not null default true,
  display_order integer not null default 0
    check (display_order >= 0),
  vi_content_version bigint not null default 1
    check (vi_content_version > 0),
  ko_translation_status text not null default 'missing'
    check (ko_translation_status in ('missing', 'machine', 'reviewed', 'manual', 'stale')),
  ko_source_vi_version bigint
    check (ko_source_vi_version is null or ko_source_vi_version > 0),
  ko_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_size_options_product_key_unique unique (product_id, option_key),
  constraint product_size_options_translation_version_check check (
    (ko_translation_status = 'missing' and ko_source_vi_version is null)
    or
    (ko_translation_status <> 'missing'
      and ko_source_vi_version is not null
      and ko_source_vi_version <= vi_content_version)
  )
);

create table public.product_flavor_options (
  id bigint generated always as identity primary key,
  product_id bigint not null
    references public.products (id) on delete cascade,
  option_key text not null
    check (option_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  label_vi text not null
    check (btrim(label_vi) <> ''),
  label_ko text
    check (label_ko is null or btrim(label_ko) <> ''),
  image_path text,
  active boolean not null default true,
  display_order integer not null default 0
    check (display_order >= 0),
  vi_content_version bigint not null default 1
    check (vi_content_version > 0),
  ko_translation_status text not null default 'missing'
    check (ko_translation_status in ('missing', 'machine', 'reviewed', 'manual', 'stale')),
  ko_source_vi_version bigint
    check (ko_source_vi_version is null or ko_source_vi_version > 0),
  ko_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_flavor_options_product_key_unique unique (product_id, option_key),
  constraint product_flavor_options_translation_version_check check (
    (ko_translation_status = 'missing' and ko_source_vi_version is null)
    or
    (ko_translation_status <> 'missing'
      and ko_source_vi_version is not null
      and ko_source_vi_version <= vi_content_version)
  )
);

create table public.homepage_settings (
  id bigint generated always as identity primary key,
  section_key text not null unique
    check (section_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  eyebrow_vi text,
  eyebrow_ko text,
  title_vi text,
  title_ko text,
  subtitle_vi text,
  subtitle_ko text,
  body_vi text,
  body_ko text,
  image_path text,
  active boolean not null default true,
  display_order integer not null default 0
    check (display_order >= 0),
  vi_content_version bigint not null default 1
    check (vi_content_version > 0),
  ko_translation_status text not null default 'missing'
    check (ko_translation_status in ('missing', 'machine', 'reviewed', 'manual', 'stale')),
  ko_source_vi_version bigint
    check (ko_source_vi_version is null or ko_source_vi_version > 0),
  ko_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint homepage_settings_translation_version_check check (
    (ko_translation_status = 'missing' and ko_source_vi_version is null)
    or
    (ko_translation_status <> 'missing'
      and ko_source_vi_version is not null
      and ko_source_vi_version <= vi_content_version)
  )
);

create table public.site_settings (
  id smallint primary key default 1
    check (id = 1),
  phone text,
  email text,
  address_vi text,
  address_ko text,
  opening_hours_vi text,
  opening_hours_ko text,
  social_links jsonb not null default '{}'::jsonb
    check (jsonb_typeof(social_links) = 'object'),
  map_url text,
  preferred_contact_channel text,
  vi_content_version bigint not null default 1
    check (vi_content_version > 0),
  ko_translation_status text not null default 'missing'
    check (ko_translation_status in ('missing', 'machine', 'reviewed', 'manual', 'stale')),
  ko_source_vi_version bigint
    check (ko_source_vi_version is null or ko_source_vi_version > 0),
  ko_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_settings_translation_version_check check (
    (ko_translation_status = 'missing' and ko_source_vi_version is null)
    or
    (ko_translation_status <> 'missing'
      and ko_source_vi_version is not null
      and ko_source_vi_version <= vi_content_version)
  )
);

create table public.order_settings (
  id smallint primary key default 1
    check (id = 1),
  pickup_help_vi text,
  pickup_help_ko text,
  delivery_help_vi text,
  delivery_help_ko text,
  submit_help_vi text,
  submit_help_ko text,
  pending_help_vi text,
  pending_help_ko text,
  confirmed_help_vi text,
  confirmed_help_ko text,
  vi_content_version bigint not null default 1
    check (vi_content_version > 0),
  ko_translation_status text not null default 'missing'
    check (ko_translation_status in ('missing', 'machine', 'reviewed', 'manual', 'stale')),
  ko_source_vi_version bigint
    check (ko_source_vi_version is null or ko_source_vi_version > 0),
  ko_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint order_settings_translation_version_check check (
    (ko_translation_status = 'missing' and ko_source_vi_version is null)
    or
    (ko_translation_status <> 'missing'
      and ko_source_vi_version is not null
      and ko_source_vi_version <= vi_content_version)
  )
);

create table public.orders (
  id bigint generated always as identity primary key,
  client_request_id uuid not null unique,
  locale text not null default 'vi'
    check (locale in ('vi', 'ko')),
  customer_name text not null
    check (btrim(customer_name) <> ''),
  customer_phone text not null
    check (btrim(customer_phone) <> ''),
  customer_email text,
  fulfillment_type text not null
    check (fulfillment_type in ('pickup', 'delivery')),
  delivery_address text,
  delivery_note text,
  requested_fulfillment_date date,
  requested_fulfillment_time text,
  order_note text
    check (order_note is null or char_length(order_note) <= 2000),
  subtotal_amount bigint not null
    check (subtotal_amount >= 0),
  currency_code text not null default 'VND'
    check (currency_code = 'VND'),
  status text not null default 'PENDING'
    check (status in ('PENDING', 'CONFIRMED')),
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_delivery_address_check check (
    (fulfillment_type = 'pickup' and delivery_address is null)
    or
    (fulfillment_type = 'delivery' and nullif(btrim(delivery_address), '') is not null)
  ),
  constraint orders_confirmed_at_check check (
    (status = 'PENDING' and confirmed_at is null)
    or
    (status = 'CONFIRMED' and confirmed_at is not null)
  )
);

create table public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null
    references public.orders (id) on delete cascade,
  product_id bigint not null
    references public.products (id) on delete restrict,
  product_name_vi text not null
    check (btrim(product_name_vi) <> ''),
  product_name_ko text,
  quantity integer not null
    check (quantity > 0),
  unit_price_amount bigint not null
    check (unit_price_amount >= 0),
  line_subtotal_amount bigint generated always as (unit_price_amount * quantity) stored,
  is_celebration boolean not null default false,
  selected_size_option_id bigint
    references public.product_size_options (id) on delete restrict,
  selected_size_key text,
  selected_size_label_vi text,
  selected_size_label_ko text,
  selected_flavor_option_id bigint
    references public.product_flavor_options (id) on delete restrict,
  selected_flavor_key text,
  selected_flavor_label_vi text,
  selected_flavor_label_ko text,
  celebration_required_date date,
  celebration_note text
    check (celebration_note is null or char_length(celebration_note) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint order_items_celebration_fields_check check (
    (
      is_celebration
      and selected_size_option_id is not null
      and nullif(btrim(selected_size_key), '') is not null
      and nullif(btrim(selected_size_label_vi), '') is not null
      and selected_flavor_option_id is not null
      and nullif(btrim(selected_flavor_key), '') is not null
      and nullif(btrim(selected_flavor_label_vi), '') is not null
      and celebration_required_date is not null
    )
    or
    (
      not is_celebration
      and selected_size_option_id is null
      and selected_size_key is null
      and selected_size_label_vi is null
      and selected_size_label_ko is null
      and selected_flavor_option_id is null
      and selected_flavor_key is null
      and selected_flavor_label_vi is null
      and selected_flavor_label_ko is null
      and celebration_required_date is null
      and celebration_note is null
    )
  )
);

create index categories_public_order_idx
  on public.categories (display_order, id)
  where active;

create index products_public_catalog_idx
  on public.products (category_id, display_order, id)
  where active;

create index homepage_settings_public_order_idx
  on public.homepage_settings (display_order, id)
  where active;

create index orders_pending_created_at_idx
  on public.orders (created_at desc)
  where status = 'PENDING';

create index order_items_order_id_idx
  on public.order_items (order_id);

create index order_items_product_id_idx
  on public.order_items (product_id);

create index order_items_size_option_id_idx
  on public.order_items (selected_size_option_id)
  where selected_size_option_id is not null;

create index order_items_flavor_option_id_idx
  on public.order_items (selected_flavor_option_id)
  where selected_flavor_option_id is not null;

create trigger categories_set_updated_at
before update on public.categories
for each row execute function private.hlime_set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function private.hlime_set_updated_at();

create trigger product_size_options_set_updated_at
before update on public.product_size_options
for each row execute function private.hlime_set_updated_at();

create trigger product_flavor_options_set_updated_at
before update on public.product_flavor_options
for each row execute function private.hlime_set_updated_at();

create trigger homepage_settings_set_updated_at
before update on public.homepage_settings
for each row execute function private.hlime_set_updated_at();

create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function private.hlime_set_updated_at();

create trigger order_settings_set_updated_at
before update on public.order_settings
for each row execute function private.hlime_set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function private.hlime_set_updated_at();

create trigger order_items_set_updated_at
before update on public.order_items
for each row execute function private.hlime_set_updated_at();

comment on column public.products.image_path is
  'Supabase Storage object path. Uploading or replacing an image must use a unique path.';

comment on column public.categories.image_path is
  'Supabase Storage object path. Uploading or replacing an image must use a unique path.';

comment on column public.product_flavor_options.image_path is
  'Optional Supabase Storage object path for the selected flavor image.';

comment on column public.homepage_settings.image_path is
  'Supabase Storage object path for the content section image.';

comment on column public.orders.client_request_id is
  'Client-generated idempotency key used to prevent duplicate order requests.';

comment on table public.order_items is
  'Order line snapshots. Product and Celebration labels are retained even if catalog content changes later.';
