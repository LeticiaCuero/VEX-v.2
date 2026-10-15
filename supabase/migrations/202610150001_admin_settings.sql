-- Aplicar em um banco que já possui as tabelas de t.sql.
begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table private.admins enable row level security;
revoke all on table private.admins from public, anon, authenticated;

-- A lista de administradores só pode ser alterada pelo SQL administrativo.
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from private.admins where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated, service_role;

-- Empresas e credenciais passam a ser gerenciadas pela Edge Function administrativa.
drop policy if exists companies_insert_own on public.companies;
drop policy if exists companies_update_own on public.companies;
revoke insert (id, name, cnpj), update (name, cnpj) on public.companies from authenticated;
grant select, insert, update on table public.companies to service_role;

-- Esta conta precisa existir em Authentication > Users antes da execução.
insert into private.admins(user_id)
values ('4f2b711e-abff-4288-ba4f-2c289457f342')
on conflict (user_id) do nothing;

commit;
