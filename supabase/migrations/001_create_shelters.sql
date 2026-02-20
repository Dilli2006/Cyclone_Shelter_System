-- Create shelters table
CREATE TABLE IF NOT EXISTS shelters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude FLOAT8 NOT NULL,
  longitude FLOAT8 NOT NULL,
  capacity INT4 NOT NULL,
  current_occupancy INT4 NOT NULL DEFAULT 0,
  contact_phone TEXT NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'active'
);

-- Enable Row Level Security
ALTER TABLE shelters ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON shelters
  FOR SELECT USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON shelters
  FOR UPDATE USING (true);

-- Seed 8 Chennai shelters
INSERT INTO shelters (name, address, latitude, longitude, capacity, current_occupancy, contact_phone, last_updated, status) VALUES
  ('Chennai Convention Centre', 'Anna Salai, Teynampet, Chennai 600018', 13.0418, 80.2341, 500, 180, '+91-44-2345-6789', now(), 'active'),
  ('Nehru Indoor Stadium', 'Periyar EVR High Rd, Kilpauk, Chennai 600010', 13.0827, 80.2377, 400, 350, '+91-44-2536-7890', now(), 'active'),
  ('YMCA Nandanam', '68 Nandanam Main Rd, Nandanam, Chennai 600035', 13.0299, 80.2386, 200, 195, '+91-44-2434-5678', now(), 'active'),
  ('Govt Higher Secondary School T.Nagar', '12 Bazullah Rd, T. Nagar, Chennai 600017', 13.0382, 80.2340, 300, 120, '+91-44-2815-2345', now(), 'active'),
  ('Anna University Shelter Hall', 'Sardar Patel Rd, Guindy, Chennai 600025', 13.0067, 80.2206, 350, 90, '+91-44-2235-1234', now(), 'active'),
  ('Corporation Community Hall Mylapore', '42 Dr Radhakrishnan Rd, Mylapore, Chennai 600004', 13.0339, 80.2676, 150, 142, '+91-44-2498-6543', now(), 'active'),
  ('Perambur Community Centre', '15 Paper Mills Rd, Perambur, Chennai 600011', 13.1143, 80.2330, 250, 60, '+91-44-2551-9876', now(), 'active'),
  ('Besant Nagar Beach Shelter', '3rd Cross St, Besant Nagar, Chennai 600090', 12.9980, 80.2668, 200, 155, '+91-44-2491-4321', now(), 'active');
