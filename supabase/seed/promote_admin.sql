-- Promote an existing account to administrator.
--
-- Use this when the person already has a login: have them register through the
-- site as normal, then run this in the Supabase SQL editor. Nothing here needs
-- the service-role key, and no password passes through a script or a terminal,
-- which is why it is the preferred route.
--
-- Replace the address below before running.

do $$
declare
  target_email constant text := 'you@example.com';
  target_id    uuid;
begin
  select id into target_id from auth.users where lower(email) = lower(target_email);

  if target_id is null then
    raise exception
      'No account exists for %. Register through the site first, then re-run.',
      target_email;
  end if;

  -- The on_auth_user_created trigger normally creates this row at signup;
  -- the insert is a safety net for accounts created before it existed.
  insert into public.profiles (id, email, is_admin)
  values (target_id, target_email, true)
  on conflict (id) do update set is_admin = true;

  raise notice 'Promoted % (%) to administrator.', target_email, target_id;
end;
$$;

-- Confirm it took:
-- select email, is_admin from public.profiles where is_admin;
