-- Fix for: insert or update on table "homestays" violates foreign key constraint "homestays_owner_id_fkey"

-- Issue: The homestays table likely references a custom public.users table or similar, 
-- but the application is inserting auth.uid() which comes from auth.users.
-- If the custom user record doesn't exist, the insert fails.

-- Solution: Change the foreign key to reference auth.users directy, 
-- OR ensure you are creating the public user profile first.
-- This script assumes we want to link directly to auth.users for simplicity 
-- if a public profiles table is not strictly required for this relationship yet.

-- 1. Drop the existing constraint
ALTER TABLE public.homestays
DROP CONSTRAINT IF EXISTS homestays_owner_id_fkey;

-- 2. Add the correct constraint referencing auth.users
ALTER TABLE public.homestays
ADD CONSTRAINT homestays_owner_id_fkey
FOREIGN KEY (owner_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 3. Verify RLS policies (optional, but good practice to ensure they are still valid)
-- Users can only view/insert/update/delete their own homestays
-- (These should already be in place from setup_homestays_rls.sql)
