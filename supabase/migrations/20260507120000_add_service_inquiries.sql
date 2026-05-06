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

CREATE POLICY "anon can insert inquiries" ON service_inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "admins can read inquiries" ON service_inquiries
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "admins can update inquiries" ON service_inquiries
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));
