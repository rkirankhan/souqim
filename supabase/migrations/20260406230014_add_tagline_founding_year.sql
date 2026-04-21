/*
  # Add Tagline and Founding Year Fields

  1. Changes
    - Add `tagline` column (text, optional) - short one-line business description
    - Add `founding_year` column (integer, optional) - year the business was founded
  
  2. Notes
    - These fields enhance business profiles with more descriptive information
    - Tagline provides a quick summary for card displays
    - Founding year adds credibility and timeline context
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'tagline'
  ) THEN
    ALTER TABLE businesses ADD COLUMN tagline text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'founding_year'
  ) THEN
    ALTER TABLE businesses ADD COLUMN founding_year integer;
  END IF;
END $$;
