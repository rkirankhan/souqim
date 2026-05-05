-- Add a unique URL slug to businesses (e.g. listmio.com/khaas-hub).
--
-- 1. Adds the column (nullable initially so we can backfill).
-- 2. Backfills from name; on duplicates, appends the first 6 chars of the id.
-- 3. Adds a unique index.

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS slug text;

WITH base AS (
  SELECT
    id,
    created_at,
    NULLIF(
      trim(both '-' from regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g')),
      ''
    ) AS clean,
    substr(id::text, 1, 6) AS short_id
  FROM businesses
  WHERE slug IS NULL
),
ranked AS (
  SELECT
    id,
    COALESCE(clean, short_id) AS base_slug,
    short_id,
    ROW_NUMBER() OVER (PARTITION BY COALESCE(clean, short_id) ORDER BY created_at) AS rn
  FROM base
)
UPDATE businesses b
SET slug = CASE WHEN r.rn = 1 THEN r.base_slug ELSE r.base_slug || '-' || r.short_id END
FROM ranked r
WHERE b.id = r.id;

CREATE UNIQUE INDEX IF NOT EXISTS businesses_slug_unique ON businesses (slug);
