/*
  # Add logo_url column to businesses table

  1. Modified Tables
    - `businesses`
      - `logo_url` (text, nullable) - URL to the uploaded business logo image

  2. Notes
    - Separate from image_url which is used for the main business photo/hero image
    - logo_url stores the uploaded circular logo displayed on profile and cards
    - Uses the existing business-photos storage bucket
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE businesses ADD COLUMN logo_url text;
  END IF;
END $$;
