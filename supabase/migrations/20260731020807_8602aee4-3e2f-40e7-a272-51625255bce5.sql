DROP POLICY IF EXISTS "Public can read site media" ON storage.objects;

CREATE OR REPLACE FUNCTION private.is_public_site_media(_path text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.gallery_items g WHERE g.is_visible AND g.image_path = _path
    UNION ALL
    SELECT 1 FROM public.testimonials t WHERE t.is_visible AND t.image_path = _path
  )
$$;

REVOKE ALL ON FUNCTION private.is_public_site_media(text) FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO anon;
GRANT EXECUTE ON FUNCTION private.is_public_site_media(text) TO anon, authenticated, service_role;

CREATE POLICY "Public can read visible site media"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'site-media' AND private.is_public_site_media(name));