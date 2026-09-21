-- Hlime V1 Auth authorization allowlist.
-- A row grants the corresponding Supabase Auth user access to Admin features.

create table public.admin_users (
  user_id uuid primary key
    references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Hlime V1 Admin allowlist. Presence grants the referenced auth.users identity Admin access.';

alter table public.admin_users enable row level security;

revoke all on table public.admin_users from anon, authenticated;
grant select on table public.admin_users to authenticated;

create policy admin_users_select_own
on public.admin_users
for select
to authenticated
using ((select auth.uid()) = user_id);
