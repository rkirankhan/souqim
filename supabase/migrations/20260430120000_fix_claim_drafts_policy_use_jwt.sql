-- Fix: "Authenticated users can claim draft listings" policy queries auth.users,
-- which the `authenticated` role can't read. The subquery throws "permission
-- denied for table users", causing every UPDATE on businesses to fail —
-- even for unrelated rows, because Postgres evaluates all UPDATE policies'
-- USING clauses to OR them together.
--
-- Fix: read the email from the JWT claims instead. `auth.jwt() ->> 'email'`
-- needs no table privileges.

DROP POLICY IF EXISTS "Authenticated users can claim draft listings" ON businesses;

CREATE POLICY "Authenticated users can claim draft listings"
  ON businesses
  FOR UPDATE
  TO authenticated
  USING (
    pending_email IS NOT NULL
    AND pending_email = (auth.jwt() ->> 'email')
    AND owner_id IS NULL
    AND status = 'draft'
  )
  WITH CHECK (
    auth.uid() = owner_id
  );
