-- Enable RLS on the table
ALTER TABLE homestays ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own homestay
CREATE POLICY "Users can view own homestay" 
ON homestays FOR SELECT 
USING (auth.uid() = owner_id);

-- Policy to allow users to create their own homestay
CREATE POLICY "Users can create own homestay" 
ON homestays FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

-- Policy to allow users to update their own homestay
CREATE POLICY "Users can update own homestay" 
ON homestays FOR UPDATE 
USING (auth.uid() = owner_id);

-- Policy to allow users to delete their own homestay
CREATE POLICY "Users can delete own homestay" 
ON homestays FOR DELETE 
USING (auth.uid() = owner_id);
