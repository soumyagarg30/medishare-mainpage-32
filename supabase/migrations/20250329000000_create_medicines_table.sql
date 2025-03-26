
-- Create medicines table
CREATE TABLE IF NOT EXISTS public.medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  expiry_date DATE NOT NULL,
  description TEXT,
  location TEXT,
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'donated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on medicines
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;

-- Create policy for donors to manage their own medicines
CREATE POLICY "Donors can manage their own medicines" 
  ON public.medicines 
  USING (donor_id = auth.uid());

-- Create policy for everyone to view available medicines
CREATE POLICY "Everyone can view available medicines" 
  ON public.medicines 
  FOR SELECT 
  USING (status = 'available');

-- Create policy for NGOs to reserve medicines
CREATE POLICY "NGOs can reserve medicines" 
  ON public.medicines 
  FOR UPDATE 
  USING (status = 'available');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_medicine_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_medicine_updated_at
BEFORE UPDATE ON public.medicines
FOR EACH ROW
EXECUTE FUNCTION public.update_medicine_updated_at();
