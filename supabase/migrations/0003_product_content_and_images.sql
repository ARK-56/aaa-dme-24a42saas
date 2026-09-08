-- ─────────────────────────────────────────────────────────────────────────────
-- Product editorial copy + an image bucket
--
-- Two changes that together let an administrator create a complete product
-- from the admin panel:
--
--   1. The long-form copy that drives the product detail page lived only in
--      src/data/productContent.ts, keyed by id. A product created through the
--      panel could never have an entry there, so its detail page would render
--      the generic fallback forever. Those three fields move onto the row.
--
--   2. Image paths pointed at files in /public, which an administrator cannot
--      write to on a deployed host. Images now live in a storage bucket.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.products
  add column if not exists overview text[] not null default '{}',
  add column if not exists features text[] not null default '{}',
  add column if not exists best_for text not null default '';

comment on column public.products.overview is
  'Paragraphs under "Product Overview & Benefits" on the detail page.';
comment on column public.products.features is
  'Concrete capabilities, rendered as a bullet list.';
comment on column public.products.best_for is
  'One line on who the item suits, to help patients self-select.';

-- ─────────────────────────────────────────────────────────────────────────────
-- Storage — product images
--
-- Public, unlike the prescriptions bucket: these are catalogue photographs that
-- anonymous shoppers must be able to load, and a public bucket serves them
-- straight from the CDN without signing every URL. Nothing patient-identifying
-- belongs here.
-- ─────────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- A public bucket already serves objects over public URLs; this select policy
-- is what additionally lets the client list the bucket.
drop policy if exists "product images: public read" on storage.objects;
create policy "product images: public read"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Writes are admin-only. Without these an admin's upload fails RLS even though
-- the bucket is publicly readable.
drop policy if exists "product images: admin insert" on storage.objects;
create policy "product images: admin insert"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product images: admin update" on storage.objects;
create policy "product images: admin update"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product images: admin delete" on storage.objects;
create policy "product images: admin delete"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());
