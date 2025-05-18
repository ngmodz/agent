-- Create image_history table
CREATE TABLE IF NOT EXISTS image_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR NOT NULL,
  service_name VARCHAR NOT NULL,
  services JSONB NOT NULL,
  format VARCHAR NOT NULL,
  image_data_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_image_history_created_at ON image_history(created_at);

-- Enable Row Level Security
ALTER TABLE image_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow full access to authenticated users" 
  ON image_history 
  FOR ALL 
  TO authenticated 
  USING (true);

-- Create policy to allow read-only access for anonymous users
CREATE POLICY "Allow read-only access to anonymous users" 
  ON image_history 
  FOR SELECT 
  TO anon 
  USING (true); 