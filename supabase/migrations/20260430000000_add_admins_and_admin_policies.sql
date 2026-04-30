-- ListMio — Admin tooling
-- Adds an `admins` table, RLS policies for admin override, seeds info@listmio.com
-- IMPORTANT: run this AFTER you've signed in once at listmio.com with info@listmio.com via Google.
-- Otherwise the seed at the bottom won't find your auth.users row and you'll need to add yourself manually.

-- ============================================================================
-- 1. ADMINS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can check admin status" ON admins;
CREATE POLICY "Authenticated users can check admin status"
  ON admins FOR SELECT TO authenticated
  USING (true);

-- ============================================================================
-- 2. is_admin() HELPER
-- ============================================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  );
$$;

-- ============================================================================
-- 3. ADMIN OVERRIDE POLICIES ON businesses
-- ============================================================================

DROP POLICY IF EXISTS "Admins can view all businesses" ON businesses;
CREATE POLICY "Admins can view all businesses"
  ON businesses FOR SELECT TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can update any business" ON businesses;
CREATE POLICY "Admins can update any business"
  ON businesses FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can delete any business" ON businesses;
CREATE POLICY "Admins can delete any business"
  ON businesses FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================================
-- 4. SEED FIRST ADMIN
-- ============================================================================

DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = 'info@listmio.com'
    LIMIT 1;

  IF admin_user_id IS NOT NULL THEN
    INSERT INTO admins (user_id) VALUES (admin_user_id)
      ON CONFLICT (user_id) DO NOTHING;
    RAISE NOTICE 'Seeded info@listmio.com as admin (user_id: %)', admin_user_id;
  ELSE
    RAISE NOTICE 'No auth.users row for info@listmio.com — sign in once with Google, then re-run this script.';
  END IF;
END $$;

-- ============================================================================
-- VERIFY
-- ============================================================================
-- After running, check admins were seeded:
SELECT a.user_id, u.email, a.created_at
FROM admins a JOIN auth.users u ON a.user_id = u.id;
