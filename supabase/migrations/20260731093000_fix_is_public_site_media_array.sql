CREATE OR REPLACE FUNCTION private.is_public_site_media(_path text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.gallery_items g WHERE g.is_visible AND g.image_path = _path
    UNION ALL
    SELECT 1 FROM public.testimonials t WHERE t.is_visible AND _path = ANY(t.image_path)
  )
$$;
