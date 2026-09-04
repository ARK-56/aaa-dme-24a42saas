-- AAA DME — initial schema
--
-- Replaces the Redis JSON-blob store. Each former "collection" was a single key
-- holding an entire array, so any two concurrent writes clobbered one another;
-- these are real rows, so they do not.
--
-- Run with:  supabase db push
-- or paste into the SQL editor of a fresh project.

-- ─────────────────────────────────────────────────────────────────────────────
-- Helpers
-- ─────────────────────────────────────────────────────────────────────────────

-- NOTE: is_admin() is defined further down, immediately after the `profiles`
-- table. A `language sql` body is parsed at creation time, so defining it here
-- would fail with: relation "public.profiles" does not exist.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- profiles — one row per auth user
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  email       text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create the profile automatically on signup; full_name comes from the
-- metadata the client passes to signUp().
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Defined here, after `profiles` exists, because the SQL body is validated at
-- creation. SECURITY DEFINER so policies on `profiles` can call it without
-- recursing through their own RLS check.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and is_admin = (select p.is_admin from public.profiles p where p.id = auth.uid()));

-- ─────────────────────────────────────────────────────────────────────────────
-- products — public catalogue. `is_featured` replaces featured-products.json.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id                       uuid primary key default gen_random_uuid(),
  name                     text not null,
  description              text not null default '',
  price                    numeric(10,2) not null check (price >= 0),
  original_price           numeric(10,2) check (original_price >= 0),
  image                    text,
  images                   text[] not null default '{}',
  category                 text not null,
  hcpcs_code               text,
  fda_class                text,
  is_prescription_required boolean not null default false,
  shipping_class           text not null default 'standard',
  warranty_type            text,
  in_stock                 boolean not null default true,
  inventory                integer not null default 0 check (inventory >= 0),
  rating                   numeric(2,1) not null default 0,
  review_count             integer not null default 0,
  colors                   text[] not null default '{}',
  sizes                    text[] not null default '{}',
  is_sale                  boolean not null default false,
  is_featured              boolean not null default false,
  featured_rank            integer,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_featured_idx on public.products (is_featured, featured_rank);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

alter table public.products enable row level security;

-- The catalogue is public; anonymous visitors must be able to browse.
drop policy if exists "products: public read" on public.products;
create policy "products: public read"
  on public.products for select
  using (true);

drop policy if exists "products: admin write" on public.products;
create policy "products: admin write"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- coverage_requests — the medical intake form
-- ─────────────────────────────────────────────────────────────────────────────
do $$ begin
  create type public.request_status as enum ('pending', 'granted', 'declined');
exception when duplicate_object then null;
end $$;

create table if not exists public.coverage_requests (
  id                    uuid primary key default gen_random_uuid(),
  request_ref           text not null unique,
  user_id               uuid not null references auth.users (id) on delete cascade,
  product_id            uuid references public.products (id) on delete set null,
  product_name          text not null default '',
  full_name             text not null,
  email                 text not null,
  phone                 text,
  dob                   date,
  address               text,
  zip_code              text,
  medicare_id           text,
  physician_instruction text,
  -- Storage object path in the `prescriptions` bucket. The old build read the
  -- file in the browser and kept only a boolean; the document was discarded.
  prescription_path     text,
  status                public.request_status not null default 'pending',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists coverage_requests_user_idx on public.coverage_requests (user_id, created_at desc);
create index if not exists coverage_requests_status_idx on public.coverage_requests (status);

drop trigger if exists coverage_requests_set_updated_at on public.coverage_requests;
create trigger coverage_requests_set_updated_at
  before update on public.coverage_requests
  for each row execute function public.set_updated_at();

alter table public.coverage_requests enable row level security;

drop policy if exists "requests: read own" on public.coverage_requests;
create policy "requests: read own"
  on public.coverage_requests for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "requests: insert own" on public.coverage_requests;
create policy "requests: insert own"
  on public.coverage_requests for insert
  with check (user_id = auth.uid());

-- Only staff change status; a patient cannot approve their own request.
drop policy if exists "requests: admin update" on public.coverage_requests;
create policy "requests: admin update"
  on public.coverage_requests for update
  using (public.is_admin())
  with check (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- vouchers — coverage verification codes
-- ─────────────────────────────────────────────────────────────────────────────
do $$ begin
  create type public.voucher_status as enum ('granted', 'used', 'expired');
exception when duplicate_object then null;
end $$;

create table if not exists public.vouchers (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  product_id  uuid not null references public.products (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  request_id  uuid references public.coverage_requests (id) on delete set null,
  status      public.voucher_status not null default 'granted',
  expires_at  timestamptz not null,
  used_at     timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists vouchers_user_idx on public.vouchers (user_id);
create unique index if not exists vouchers_code_upper_idx on public.vouchers (upper(code));

alter table public.vouchers enable row level security;

drop policy if exists "vouchers: read own" on public.vouchers;
create policy "vouchers: read own"
  on public.vouchers for select
  using (user_id = auth.uid() or public.is_admin());

-- Issuing a code is a staff action only. Redemption happens in place_order().
drop policy if exists "vouchers: admin write" on public.vouchers;
create policy "vouchers: admin write"
  on public.vouchers for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- orders
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  order_ref         text not null unique,
  user_id           uuid not null references auth.users (id) on delete cascade,
  product_id        uuid references public.products (id) on delete set null,
  product_name      text not null default '',
  items             jsonb not null default '[]'::jsonb,
  total_products    integer not null default 1,
  total_price       numeric(10,2) not null default 0,
  confirmation_code text,
  personal_details  jsonb not null default '{}'::jsonb,
  shipping_details  jsonb not null default '{}'::jsonb,
  created_at        timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders (user_id, created_at desc);

alter table public.orders enable row level security;

drop policy if exists "orders: read own" on public.orders;
create policy "orders: read own"
  on public.orders for select
  using (user_id = auth.uid() or public.is_admin());

-- No direct insert policy: orders are created only through place_order(),
-- so the client cannot invent its own total_price.
drop policy if exists "orders: admin update" on public.orders;
create policy "orders: admin update"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- place_order — voucher redemption, inventory, and the order in one transaction
--
-- This is the fix for the old read-modify-write race: two simultaneous
-- checkouts previously overwrote each other's entire orders array.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.place_order(
  p_code             text,
  p_product_id       uuid,
  p_quantity         integer,
  p_personal_details jsonb,
  p_shipping_details jsonb
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user     uuid := auth.uid();
  v_voucher  public.vouchers;
  v_product  public.products;
  v_order    public.orders;
  v_ref      text;
begin
  if v_user is null then
    raise exception 'You must be signed in to place an order'
      using errcode = '42501';
  end if;

  if p_quantity is null or p_quantity < 1 then
    raise exception 'Quantity must be at least 1' using errcode = '22023';
  end if;

  -- Lock the voucher row so a code cannot be redeemed twice concurrently.
  select * into v_voucher
    from public.vouchers
   where upper(code) = upper(p_code)
   for update;

  if not found then
    raise exception 'Verification code not found' using errcode = 'P0002';
  end if;
  if v_voucher.user_id <> v_user then
    raise exception 'This code belongs to another account' using errcode = '42501';
  end if;
  if v_voucher.product_id <> p_product_id then
    raise exception 'This code is not valid for that product' using errcode = '22023';
  end if;
  if v_voucher.status = 'used' or v_voucher.used_at is not null then
    raise exception 'This code has already been used' using errcode = '22023';
  end if;
  if v_voucher.status = 'expired' or v_voucher.expires_at < now() then
    raise exception 'This code has expired' using errcode = '22023';
  end if;

  select * into v_product
    from public.products
   where id = p_product_id
   for update;

  if not found then
    raise exception 'Product not found' using errcode = 'P0002';
  end if;
  if not v_product.in_stock then
    raise exception 'That product is out of stock' using errcode = '22023';
  end if;

  v_ref := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' ||
           upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  -- Price comes from the product row, never from the client.
  insert into public.orders (
    order_ref, user_id, product_id, product_name, items,
    total_products, total_price, confirmation_code,
    personal_details, shipping_details
  )
  values (
    v_ref, v_user, v_product.id, v_product.name,
    jsonb_build_array(jsonb_build_object(
      'productId', v_product.id,
      'name',      v_product.name,
      'price',     v_product.price,
      'image',     v_product.image,
      'quantity',  p_quantity
    )),
    p_quantity,
    v_product.price * p_quantity,
    v_voucher.code,
    coalesce(p_personal_details, '{}'::jsonb),
    coalesce(p_shipping_details, '{}'::jsonb)
  )
  returning * into v_order;

  update public.vouchers
     set status = 'used', used_at = now()
   where id = v_voucher.id;

  update public.products
     set inventory = greatest(0, inventory - p_quantity),
         in_stock  = case when greatest(0, inventory - p_quantity) = 0
                          then false else in_stock end
   where id = v_product.id;

  if v_voucher.request_id is not null then
    update public.coverage_requests
       set status = 'granted'
     where id = v_voucher.request_id;
  end if;

  return v_order;
end;
$$;

revoke all on function public.place_order(text, uuid, integer, jsonb, jsonb) from public;
grant execute on function public.place_order(text, uuid, integer, jsonb, jsonb) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- Storage — prescription documents
-- ─────────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('prescriptions', 'prescriptions', false)
on conflict (id) do nothing;

-- Objects live under <user-id>/<file>, so the first path segment is the owner.
drop policy if exists "prescriptions: upload own" on storage.objects;
create policy "prescriptions: upload own"
  on storage.objects for insert
  with check (
    bucket_id = 'prescriptions'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "prescriptions: read own" on storage.objects;
create policy "prescriptions: read own"
  on storage.objects for select
  using (
    bucket_id = 'prescriptions'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );
