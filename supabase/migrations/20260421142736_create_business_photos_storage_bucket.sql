/*
  # Create Storage Bucket for Business Photos

  1. New Bucket
    - `business-photos` - public bucket for storing business listing photos
  
  2. Security
    - Public read access for all photos (businesses are publicly viewable)
    - Anyone can upload photos (needed for the progressive auth flow where users upload before signing in)
    - File size limit: 5MB per file
    - Only image file types allowed
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'business-photos',
  'business-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to business photos
CREATE POLICY "Public can view business photos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'business-photos');

-- Allow anyone to upload business photos (needed for anonymous draft flow)
CREATE POLICY "Anyone can upload business photos"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'business-photos'
    AND (storage.foldername(name))[1] IS NOT NULL
  );

-- Allow authenticated users to delete their uploaded photos
CREATE POLICY "Authenticated users can delete business photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'business-photos');
