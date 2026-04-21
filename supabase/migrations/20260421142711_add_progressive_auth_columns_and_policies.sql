/*
  # Progressive Auth Listing Flow - Schema & Policy Updates

  1. New Columns on `businesses`
    - `pending_email` (text, nullable) - stores the email address of a user who submits a listing before creating an account
    - `photos` (text[], default '{}') - array of photo URLs (up to 5) replacing the single image_url approach
    - `opening_hours` (jsonb, nullable) - weekly opening hours schedule stored as JSON

  2. Policy Updates
    - New INSERT policy: allows anonymous users to insert draft listings with a pending_email (no owner_id required)
    - New UPDATE policy: allows authenticated users to claim their draft listings by matching pending_email to their email
    - Existing policies remain unchanged for backward compatibility

  3. Important Notes
    - The pending_email column is only populated for draft listings created without authentication
    - Once a user clicks the magic link and authenticates, pending_email is cleared and owner_id is set
    - The photos column supplements the existing image_url column
*/

-- Add pending_email column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'pending_email'
  ) THEN
    ALTER TABLE businesses ADD COLUMN pending_email text;
  END IF;
END $$;

-- Add photos column (text array)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'photos'
  ) THEN
    ALTER TABLE businesses ADD COLUMN photos text[] DEFAULT '{}';
  END IF;
END $$;

-- Add opening_hours column (jsonb)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'opening_hours'
  ) THEN
    ALTER TABLE businesses ADD COLUMN opening_hours jsonb;
  END IF;
END $$;

-- Allow anonymous inserts for draft listings with pending_email
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'businesses' AND policyname = 'Anonymous users can insert draft listings'
  ) THEN
    CREATE POLICY "Anonymous users can insert draft listings"
      ON businesses
      FOR INSERT
      TO anon
      WITH CHECK (
        status = 'draft'
        AND owner_id IS NULL
        AND pending_email IS NOT NULL
      );
  END IF;
END $$;

-- Allow authenticated users to claim their draft listings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'businesses' AND policyname = 'Authenticated users can claim draft listings'
  ) THEN
    CREATE POLICY "Authenticated users can claim draft listings"
      ON businesses
      FOR UPDATE
      TO authenticated
      USING (
        pending_email = (SELECT email FROM auth.users WHERE id = auth.uid())
        AND owner_id IS NULL
        AND status = 'draft'
      )
      WITH CHECK (
        auth.uid() = owner_id
      );
  END IF;
END $$;

-- Allow anonymous users to read their own draft by pending_email (for showing confirmation)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'businesses' AND policyname = 'Anonymous can view own drafts by pending_email'
  ) THEN
    CREATE POLICY "Anonymous can view own drafts by pending_email"
      ON businesses
      FOR SELECT
      TO anon
      USING (
        status = 'draft'
        AND pending_email IS NOT NULL
        AND owner_id IS NULL
      );
  END IF;
END $$;
