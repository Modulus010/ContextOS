-- Add deadline column to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ;

-- Add index for deadline queries
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);

-- Add comment
COMMENT ON COLUMN tasks.deadline IS 'Optional deadline for task completion';
