-- Create an enum for room types (optional, but good for structure)
-- We can just use text for flexibility if preferred, but let's stick to text for now for simplicity and valid constraints
-- as user might want custom types.

CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    homestay_id UUID NOT NULL REFERENCES public.homestays(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g. "Room 101", "Deluxe Suite"
    type TEXT NOT NULL, -- e.g. "Single", "Double", "Dormitory"
    capacity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    amenities JSONB DEFAULT '[]'::jsonb, -- Array of strings e.g. ["Wifi", "AC", "Heater"]
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Policies

-- 1. View Policies
-- Users can view rooms if they own the homestay
CREATE POLICY "Users can view rooms of their own homestay"
ON public.rooms FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.homestays h
        WHERE h.id = rooms.homestay_id
        AND h.owner_id = auth.uid()
    )
);

-- 2. Insert Policies
-- Users can insert rooms into their own homestay
CREATE POLICY "Users can add rooms to their own homestay"
ON public.rooms FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.homestays h
        WHERE h.id = homestay_id -- Use the field from the INSERT payload
        AND h.owner_id = auth.uid()
    )
);

-- 3. Update Policies
CREATE POLICY "Users can update rooms of their own homestay"
ON public.rooms FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.homestays h
        WHERE h.id = rooms.homestay_id
        AND h.owner_id = auth.uid()
    )
);

-- 4. Delete Policies
CREATE POLICY "Users can delete rooms of their own homestay"
ON public.rooms FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.homestays h
        WHERE h.id = rooms.homestay_id
        AND h.owner_id = auth.uid()
    )
);

-- Create a function to update 'updated_at' column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rooms_updated_at
BEFORE UPDATE ON public.rooms
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
