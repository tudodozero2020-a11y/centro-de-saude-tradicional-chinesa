CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
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

DROP POLICY "Authenticated can view all gallery items" ON public.gallery_items;
DROP POLICY "Authenticated can insert gallery items" ON public.gallery_items;
DROP POLICY "Authenticated can update gallery items" ON public.gallery_items;
DROP POLICY "Authenticated can delete gallery items" ON public.gallery_items;

CREATE POLICY "Admins can view all gallery items"
  ON public.gallery_items FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert gallery items"
  ON public.gallery_items FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update gallery items"
  ON public.gallery_items FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete gallery items"
  ON public.gallery_items FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Authenticated can view all testimonials" ON public.testimonials;
DROP POLICY "Authenticated can insert testimonials" ON public.testimonials;
DROP POLICY "Authenticated can update testimonials" ON public.testimonials;
DROP POLICY "Authenticated can delete testimonials" ON public.testimonials;

CREATE POLICY "Admins can view all testimonials"
  ON public.testimonials FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update testimonials"
  ON public.testimonials FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));