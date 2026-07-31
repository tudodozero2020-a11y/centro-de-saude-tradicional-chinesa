CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP POLICY IF EXISTS "Admins can delete gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Admins can insert gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Admins can update gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Admins can view all gallery items" ON public.gallery_items;

CREATE POLICY "Admins can view all gallery items" ON public.gallery_items FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can insert gallery items" ON public.gallery_items FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update gallery items" ON public.gallery_items FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete gallery items" ON public.gallery_items FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can view all testimonials" ON public.testimonials;

CREATE POLICY "Admins can view all testimonials" ON public.testimonials FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can insert testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname, cmd, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND (qual LIKE '%has_role%' OR with_check LIKE '%has_role%')
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "Admins can read site-media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'site-media' AND private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can upload site-media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-media' AND private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update site-media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-media' AND private.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (bucket_id = 'site-media' AND private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete site-media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-media' AND private.has_role(auth.uid(), 'admin'::public.app_role));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);