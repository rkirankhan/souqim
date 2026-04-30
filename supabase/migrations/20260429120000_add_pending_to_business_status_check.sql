-- ListMio — Pre-publish review queue
-- Adds 'pending' as a valid business status. Run once.

-- Drop the old status CHECK constraint and replace it with one that includes 'pending'
ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_status_check;

ALTER TABLE businesses
  ADD CONSTRAINT businesses_status_check
  CHECK (status IN ('live', 'paused', 'draft', 'pending'));

-- Verify
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'businesses'::regclass AND contype = 'c';
