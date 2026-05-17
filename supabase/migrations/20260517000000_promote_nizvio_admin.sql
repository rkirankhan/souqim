-- Nizvio — promote info@nizvio.com to admin
-- Run AFTER you've signed in once at the site with info@nizvio.com (via Google
-- or email). Otherwise the seed at the bottom won't find your auth.users row.
--
-- Safe to run multiple times — uses ON CONFLICT DO NOTHING.
--
-- Optional cleanup at the bottom removes the legacy info@listmio.com admin
-- row (commented out by default — uncomment if you want to drop the old
-- account's admin access).

DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = 'info@nizvio.com'
    LIMIT 1;

  IF admin_user_id IS NOT NULL THEN
    INSERT INTO admins (user_id) VALUES (admin_user_id)
      ON CONFLICT (user_id) DO NOTHING;
    RAISE NOTICE 'Seeded info@nizvio.com as admin (user_id: %)', admin_user_id;
  ELSE
    RAISE NOTICE 'No auth.users row for info@nizvio.com — sign in once via the site, then re-run this script.';
  END IF;
END $$;

-- Verify
SELECT a.user_id, u.email, a.created_at
FROM admins a JOIN auth.users u ON a.user_id = u.id
ORDER BY a.created_at;

-- Optional: revoke the old info@listmio.com admin once you're satisfied
-- the nizvio account works. Uncomment to run:
--
-- DELETE FROM admins
--   WHERE user_id IN (
--     SELECT id FROM auth.users WHERE email = 'info@listmio.com'
--   );
