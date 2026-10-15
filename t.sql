-- Estrutura inicial para um banco novo.
-- Uma conta do Supabase Auth representa uma empresa.
-- E-mail e senha ficam no Auth; a empresa usa o mesmo ID da conta.
-- Execute no SQL Editor. Depois, crie a conta em Authentication > Users
-- e cadastre a empresa usando o ID dessa conta (ou auth.uid() na sessão autenticada).
begin;

create table public.companies (
  id uuid primary key default auth.uid() references auth.users(id),
  name text not null check (length(trim(name)) > 0),
  -- Armazenar sem pontuação, com letras maiúsculas quando houver.
  cnpj text not null unique check (cnpj ~ '^[A-Z0-9]{14}$'),
  created_at timestamptz not null default now()
);

create table public.register (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null default auth.uid() references public.companies(id),
  vehicle_type text not null check (length(trim(vehicle_type)) > 0),
  stay_type text not null check (stay_type in ('minute', 'daily', 'monthly')),
  stay_minutes integer,
  initial_value numeric(10, 2) not null check (initial_value between 0 and 99999999.99),
  additional_hour numeric(10, 2) check (additional_hour between 0 and 99999999.99),
  created_at timestamptz not null default now(),
  unique (id, company_id),
  constraint register_minutes_check check (
    (stay_type = 'minute' and stay_minutes is not null and stay_minutes > 0)
    or
    (stay_type in ('daily', 'monthly') and stay_minutes is null)
  )
);

-- Cada registro de veículo representa uma entrada no estacionamento.
create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null default auth.uid() references public.companies(id),
  register_id uuid not null,
  plate text not null check (length(trim(plate)) > 0),
  model text,
  brand text,
  color text,
  cpf text,
  entered_at timestamptz not null default now(),
  unique (id, company_id),
  foreign key (register_id, company_id)
    references public.register(id, company_id)
);

-- Cada estadia encerrada possui um registro no histórico.
-- Veículos sem registro no histórico representam estadias ativas.
create table public.history (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null default auth.uid() references public.companies(id),
  vehicle_id uuid not null unique,
  exited_at timestamptz not null default now(),
  total_value numeric(10, 2) not null check (total_value between 0 and 99999999.99),
  foreign key (vehicle_id, company_id)
    references public.vehicles(id, company_id)
);

-- Índices para consultas e filtros por empresa.
create index register_company_id_idx on public.register(company_id);
create index vehicles_company_id_idx on public.vehicles(company_id);
create index history_company_id_idx on public.history(company_id);

alter table public.companies enable row level security;
alter table public.register enable row level security;
alter table public.vehicles enable row level security;
alter table public.history enable row level security;

revoke all on table public.companies, public.register,
  public.vehicles, public.history from public, anon, authenticated;

grant usage on schema public to authenticated;
grant select on table public.companies to authenticated;
grant insert (id, name, cnpj) on table public.companies to authenticated;
grant update (name, cnpj) on table public.companies to authenticated;

grant select, insert, delete on table public.register, public.vehicles to authenticated;
grant update (vehicle_type, stay_type, stay_minutes, initial_value, additional_hour)
  on table public.register to authenticated;
grant update (register_id, plate, model, brand, color, cpf, entered_at)
  on table public.vehicles to authenticated;
grant select, insert on table public.history to authenticated;

-- O acesso anônimo não possui permissões. A empresa autenticada acessa apenas seus dados.
create policy companies_select_own
  on public.companies for select to authenticated
  using (id = (select auth.uid()));

create policy companies_insert_own
  on public.companies for insert to authenticated
  with check (id = (select auth.uid()));

create policy companies_update_own
  on public.companies for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy register_select_own
  on public.register for select to authenticated
  using (company_id = (select auth.uid()));

create policy register_insert_own
  on public.register for insert to authenticated
  with check (company_id = (select auth.uid()));

create policy register_update_own
  on public.register for update to authenticated
  using (company_id = (select auth.uid()))
  with check (company_id = (select auth.uid()));

create policy register_delete_own
  on public.register for delete to authenticated
  using (company_id = (select auth.uid()));

create policy vehicles_select_own
  on public.vehicles for select to authenticated
  using (company_id = (select auth.uid()));

create policy vehicles_insert_own
  on public.vehicles for insert to authenticated
  with check (company_id = (select auth.uid()));

-- Cadastros encerrados ficam protegidos contra alterações pelo aplicativo.
create policy vehicles_update_active
  on public.vehicles for update to authenticated
  using (
    company_id = (select auth.uid())
    and not exists (select 1 from public.history where vehicle_id = vehicles.id)
  )
  with check (company_id = (select auth.uid()));

create policy vehicles_delete_active
  on public.vehicles for delete to authenticated
  using (
    company_id = (select auth.uid())
    and not exists (select 1 from public.history where vehicle_id = vehicles.id)
  );

create policy history_select_own
  on public.history for select to authenticated
  using (company_id = (select auth.uid()));

-- Histórico permite consulta e inclusão, sem alteração ou exclusão pelo aplicativo.
create policy history_insert_own
  on public.history for insert to authenticated
  with check (
    company_id = (select auth.uid())
    and exists (
      select 1 from public.vehicles
      where vehicles.id = history.vehicle_id
        and vehicles.company_id = history.company_id
        and vehicles.entered_at <= history.exited_at
    )
  );

commit;
