/*
  # Add owner_id, status, view_count columns and secure RLS policies

  1. New Columns on `businesses`
    - `owner_id` (uuid, nullable, references auth.users) - links a business to its owner
    - `status` (text, default 'live') - controls listing visibility: 'live', 'paused', or 'draft'
    - `view_count` (integer, default 0) - tracks how many times a listing has been viewed

  2. Security Changes
    - Drop old permissive policies that allowed unrestricted access
    - Add 5 new restrictive RLS policies:
      - Public can view live listings
      - Owners can view their own listings regardless of status
      - Authenticated users can insert listings (owner_id must match their auth.uid())
      - Owners can update only their own listings
      - Owners can delete only their own listings

  3. Important Notes
    - Existing 30 sample businesses will have null owner_id and status='live', so they remain publicly visible
    - The status CHECK constraint limits values to 'live', 'paused', or 'draft'
    - owner_id references auth.users(id) with ON DELETE CASCADE
*/

-- Add owner_id column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'owner_id'
  ) THEN
    ALTER TABLE businesses ADD COLUMN owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add status column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'status'
  ) THEN
    ALTER TABLE businesses ADD COLUMN status text NOT NULL DEFAULT 'live'
      CHECK (status IN ('live', 'paused', 'draft'));
  END IF;
END $$;

-- Add view_count column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE businesses ADD COLUMN view_count integer NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Create index on owner_id for fast dashboard queries
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON businesses(owner_id);

-- Create index on status for fast public listing queries
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);

-- Drop old permissive policies
DROP POLICY IF EXISTS "Anyone can view businesses" ON businesses;
DROP POLICY IF EXISTS "Anyone can submit a business" ON businesses;
DROP POLICY IF EXISTS "Anyone can update businesses" ON businesses;

-- New RLS policies

-- Public can view live listings (no auth required)
CREATE POLICY "Public can view live businesses"
  ON businesses
  FOR SELECT
  USING (status = 'live');

-- Owners can view their own listings regardless of status
CREATE POLICY "Owners can view own businesses"
  ON businesses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

-- Authenticated users can insert businesses (must set owner_id to their own uid)
CREATE POLICY "Authenticated users can insert businesses"
  ON businesses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Owners can update only their own listings
CREATE POLICY "Owners can update own businesses"
  ON businesses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Owners can delete only their own listings
CREATE POLICY "Owners can delete own businesses"
  ON businesses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);
