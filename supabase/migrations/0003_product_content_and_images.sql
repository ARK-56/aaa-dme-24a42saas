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
--
-- The storage half is wrapped in exception handlers on purpose. Depending on
-- how the project was provisioned, `create policy ... on storage.objects` can
-- fail with "must be owner of table objects" in the SQL editor. The editor runs
-- the file in one transaction, so an unguarded failure there would roll back
-- the ALTER TABLE above it too and leave nothing applied. Guarded, the columns
-- always land and the storage half degrades to a notice you can act on.
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
--
-- If this section reports a notice rather than creating the bucket, run
--   node scripts/upload-product-images.mjs
-- which creates it through the Storage API, where no table ownership applies.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
begin
  insert into storage.buckets (id, name, public)
  values ('product-images', 'product-images', true)
  on conflict (id) do update set public = true;
exception
  when insufficient_privilege or undefined_table then
    raise notice
      'Could not create the product-images bucket from SQL (%). Create it in '
      'Storage > New bucket (public), or run scripts/upload-product-images.mjs.',
      sqlerrm;
end;
$$;

-- Writes are admin-only. Without these an admin's upload from the panel fails
-- RLS even though the bucket is publicly readable. The service-role script
-- bypasses RLS and so does not depend on them.
do $$
begin
  execute 'drop policy if exists "product images: public read" on storage.objects';
  execute $p$
    create policy "product images: public read"
      on storage.objects for select
      using (bucket_id = 'product-images')
  $p$;

  execute 'drop policy if exists "product images: admin insert" on storage.objects';
  execute $p$
    create policy "product images: admin insert"
      on storage.objects for insert
      with check (bucket_id = 'product-images' and public.is_admin())
  $p$;

  execute 'drop policy if exists "product images: admin update" on storage.objects';
  execute $p$
    create policy "product images: admin update"
      on storage.objects for update
      using (bucket_id = 'product-images' and public.is_admin())
      with check (bucket_id = 'product-images' and public.is_admin())
  $p$;

  execute 'drop policy if exists "product images: admin delete" on storage.objects';
  execute $p$
    create policy "product images: admin delete"
      on storage.objects for delete
      using (bucket_id = 'product-images' and public.is_admin())
  $p$;
exception
  when insufficient_privilege then
    raise notice
      'Could not create storage policies (%). Add them under Storage > '
      'Policies for the product-images bucket: public SELECT, and '
      'INSERT/UPDATE/DELETE where public.is_admin(). Uploading from the admin '
      'panel will fail RLS until that is done.',
      sqlerrm;
end;
$$;
