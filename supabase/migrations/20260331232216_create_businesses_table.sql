/*
  # Create businesses table

  1. New Tables
    - `businesses`
      - `id` (uuid, primary key) - Unique identifier for each business
      - `name` (text, required) - Business name
      - `owner_name` (text, optional) - Owner/contact name
      - `category` (text, required) - Business category
      - `description` (text, required) - Full business description
      - `location` (text, required) - City/town location
      - `postcode` (text, required) - Postcode for location search
      - `phone` (text, optional) - Contact phone number
      - `email` (text, optional) - Contact email
      - `website` (text, optional) - Business website URL
      - `social_facebook` (text, optional) - Facebook profile URL
      - `social_twitter` (text, optional) - Twitter/X profile URL
      - `social_instagram` (text, optional) - Instagram profile URL
      - `social_linkedin` (text, optional) - LinkedIn profile URL
      - `image_url` (text, optional) - Business logo/image URL
      - `is_women_owned` (boolean, default false) - Women-owned business badge
      - `is_home_based` (boolean, default false) - Home-based business badge
      - `is_startup` (boolean, default false) - Startup badge
      - `is_featured` (boolean, default false) - Featured listing badge
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `businesses` table
    - Add policy for public read access (anyone can view businesses)
    - Add policy for public insert (anyone can submit a business listing)
    - Add policy for public update (anyone can update - no auth yet)

  3. Indexes
    - Index on category for filtering
    - Index on postcode for location searches
    - Index on location for city searches
    - Index on special badges for featured sections
*/

CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_name text,
  category text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  postcode text NOT NULL,
  phone text,
  email text,
  website text,
  social_facebook text,
  social_twitter text,
  social_instagram text,
  social_linkedin text,
  image_url text,
  is_women_owned boolean DEFAULT false,
  is_home_based boolean DEFAULT false,
  is_startup boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view businesses"
  ON businesses
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can submit a business"
  ON businesses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update businesses"
  ON businesses
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_postcode ON businesses(postcode);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(location);
CREATE INDEX IF NOT EXISTS idx_businesses_women_owned ON businesses(is_women_owned) WHERE is_women_owned = true;
CREATE INDEX IF NOT EXISTS idx_businesses_featured ON businesses(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_businesses_created_at ON businesses(created_at DESC);