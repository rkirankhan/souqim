-- Optional services / menu list per business.
-- Each item: { "title": string, "description"?: string, "price"?: string }

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS services jsonb DEFAULT '[]'::jsonb;
