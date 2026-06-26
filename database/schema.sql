-- Manvielle Elegance
-- Execute este script no console SQL do Neon antes de rodar npm run seed.

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('Produto', 'Serviço')),
  category text not null,
  description text not null,
  price numeric(10, 2) not null default 0,
  image_url text,
  status text not null default 'Ativo' check (status in ('Ativo', 'Inativo')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_items_type on public.items(type);
create index if not exists idx_items_category on public.items(category);
create index if not exists idx_items_status on public.items(status);
create index if not exists idx_items_created_at on public.items(created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_items_updated_at on public.items;

create trigger trg_items_updated_at
before update on public.items
for each row
execute function public.set_updated_at();

alter table public.users disable row level security;
alter table public.items disable row level security;