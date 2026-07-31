ALTER TABLE public.testimonials
  ALTER COLUMN image_path DROP DEFAULT,
  ALTER COLUMN image_path TYPE text[] USING CASE WHEN image_path = '' THEN '{}'::text[] ELSE ARRAY[image_path] END,
  ALTER COLUMN image_path SET DEFAULT '{}'::text[];
