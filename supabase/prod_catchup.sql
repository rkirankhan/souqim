-- ============================================================================
-- souqim — production catch-up script
-- ============================================================================
-- Run this in the Supabase Dashboard → SQL Editor on the PRODUCTION project.
--
-- Diagnosis (30 May 2026): every migration is applied in prod EXCEPT
-- 20260507120000_add_service_inquiries.sql. That missing table is why the
-- Services "Request a quote" form returns 404 (PGRST205) and no email is sent.
--
-- This script is idempotent — safe to run more than once.
-- ============================================================================

-- Quote requests submitted from the Services page.
-- Public can write (anon and authenticated); only admins can read / update.
CREATE TABLE IF NOT EXISTS service_inquiries (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  status              text NOT NULL DEFAULT 'new'
                          CHECK (status IN ('new','contacted','closed')),
  name                text NOT NULL,
  email               text NOT NULL,
  phone               text,
  business_name       text,
  business_stage      text[] NOT NULL DEFAULT '{}',
  services_interested text[] NOT NULL DEFAULT '{}',
  brief               text
);

ALTER TABLE service_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon can insert inquiries" ON service_inquiries;
CREATE POLICY "anon can insert inquiries" ON service_inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admins can read inquiries" ON service_inquiries;
CREATE POLICY "admins can read inquiries" ON service_inquiries
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

DROP POLICY IF EXISTS "admins can update inquiries" ON service_inquiries;
CREATE POLICY "admins can update inquiries" ON service_inquiries
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

-- Tell PostgREST to refresh its schema cache so the new table is visible
-- immediately (otherwise the API can keep returning PGRST205 for a minute).
NOTIFY pgrst, 'reload schema';

-- Verify
SELECT 'service_inquiries created' AS result,
       count(*) AS existing_rows
FROM service_inquiries;
