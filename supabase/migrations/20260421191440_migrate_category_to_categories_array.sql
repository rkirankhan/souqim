/*
  # Migrate category (text) to categories (text[])

  1. Changes
    - Add `categories` column as text array
    - Copy existing `category` data into `categories` array
    - Drop the old `category` column
    - Add GIN index on `categories` for efficient array containment queries

  2. Notes
    - All existing rows will have their single `category` value moved into a one-element `categories` array
    - The new column supports up to 3 categories per business (enforced at the app layer)
*/

-- Add new categories array column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'categories'
  ) THEN
    ALTER TABLE businesses ADD COLUMN categories text[] NOT NULL DEFAULT '{}';
  END IF;
END $$;

-- Migrate existing category values into the array
UPDATE businesses
SET categories = ARRAY[category]
WHERE category IS NOT NULL AND category != '' AND (categories IS NULL OR categories = '{}');

-- Drop the old category column and its index
DROP INDEX IF EXISTS idx_businesses_category;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'category'
  ) THEN
    ALTER TABLE businesses DROP COLUMN category;
  END IF;
END $$;

-- Add GIN index for array containment queries (@> operator)
CREATE INDEX IF NOT EXISTS idx_businesses_categories ON businesses USING GIN(categories);
