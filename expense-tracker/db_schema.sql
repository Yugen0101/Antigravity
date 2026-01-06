-- Added 'note' column to transactions table for storing transaction descriptions/notes
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS note TEXT;
