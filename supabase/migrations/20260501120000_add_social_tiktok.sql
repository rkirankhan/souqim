-- Add social_tiktok column to businesses for the new social links UI.
-- The legacy social_twitter column is kept (no destructive drop) so old
-- listings retain whatever was previously saved there.

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS social_tiktok text;
