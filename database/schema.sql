-- Spendiq AI (Supabase) — Production MVP schema
-- Apply in Supabase SQL Editor (or via migrations).

begin;

-- Extensions (Supabase typically has these available)
create extension if not exists "pgcrypto";

-- USERS
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text unique,
  plan text not null default 'free',
  created_at timestamptz not null default now()
);

create index if not exists users_phone_idx on public.users(phone);

-- EXPENSES
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  amount numeric(12,2) not null check (amount >= 0),
  category text not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists expenses_user_created_idx on public.expenses(user_id, created_at desc);
create index if not exists expenses_user_category_idx on public.expenses(user_id, category);

-- BUDGETS
create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  category text not null,
  limit_amount numeric(12,2) not null check (limit_amount >= 0),
  unique (user_id, category)
);

create index if not exists budgets_user_idx on public.budgets(user_id);

-- INSIGHTS
create table if not exists public.insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists insights_user_created_idx on public.insights(user_id, created_at desc);

-- REPORTS
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  month text not null,
  summary_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, month)
);

create index if not exists reports_user_month_idx on public.reports(user_id, month);

-- RLS
alter table public.users enable row level security;
alter table public.expenses enable row level security;
alter table public.budgets enable row level security;
alter table public.insights enable row level security;
alter table public.reports enable row level security;

-- USERS policies
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own"
  on public.users for select
  using (auth.uid() = id);

drop policy if exists "users_upsert_own" on public.users;
create policy "users_upsert_own"
  on public.users for insert
  with check (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- EXPENSES policies
drop policy if exists "expenses_crud_own" on public.expenses;
create policy "expenses_crud_own"
  on public.expenses
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- BUDGETS policies
drop policy if exists "budgets_crud_own" on public.budgets;
create policy "budgets_crud_own"
  on public.budgets
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- INSIGHTS policies
drop policy if exists "insights_select_own" on public.insights;
create policy "insights_select_own"
  on public.insights for select
  using (auth.uid() = user_id);

drop policy if exists "insights_insert_own" on public.insights;
create policy "insights_insert_own"
  on public.insights for insert
  with check (auth.uid() = user_id);

-- REPORTS policies
drop policy if exists "reports_select_own" on public.reports;
create policy "reports_select_own"
  on public.reports for select
  using (auth.uid() = user_id);

drop policy if exists "reports_insert_own" on public.reports;
create policy "reports_insert_own"
  on public.reports for insert
  with check (auth.uid() = user_id);

-- Create user profile automatically on signup
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, phone, plan)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', null), null, 'free')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

commit;

