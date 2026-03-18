-- Spendiq AI — Seed data (safe + FK/RLS-compatible)
--
-- Because `public.users.id` references `auth.users(id)`, you must:
-- 1) Create a user in Supabase Auth (email magic link is fine).
-- 2) Copy that user's UUID and set it below.
--
-- Then run this file in Supabase SQL Editor.

begin;

do $$
declare
  demo_user uuid := '00000000-0000-0000-0000-000000000000';
begin
  if demo_user = '00000000-0000-0000-0000-000000000000'::uuid then
    raise exception 'Set demo_user UUID in seed.sql before running.';
  end if;

  -- Profile
  insert into public.users (id, name, phone, plan)
  values (demo_user, 'Demo User', null, 'free')
  on conflict (id) do update set name = excluded.name;

  -- Budgets
  insert into public.budgets (user_id, category, limit_amount)
  values
    (demo_user, 'food', 1200),
    (demo_user, 'shopping', 800),
    (demo_user, 'transport', 500)
  on conflict (user_id, category) do update set limit_amount = excluded.limit_amount;

  -- Expenses (recent)
  insert into public.expenses (user_id, amount, category, note, created_at)
  values
    (demo_user, 55, 'food', 'lunch', now() - interval '2 days'),
    (demo_user, 180, 'shopping', 'groceries', now() - interval '5 days'),
    (demo_user, 35, 'transport', 'metro', now() - interval '6 days'),
    (demo_user, 120, 'subscriptions', 'tools', now() - interval '9 days');
end $$;

commit;

