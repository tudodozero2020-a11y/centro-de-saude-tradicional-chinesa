CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_path text NOT NULL,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.gallery_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT ALL ON public.gallery_items TO service_role;

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible gallery items"
  ON public.gallery_items FOR SELECT TO anon USING (is_visible = true);
CREATE POLICY "Authenticated can view all gallery items"
  ON public.gallery_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert gallery items"
  ON public.gallery_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update gallery items"
  ON public.gallery_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete gallery items"
  ON public.gallery_items FOR DELETE TO authenticated USING (true);

CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_path text NOT NULL DEFAULT '',
  author_name text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible testimonials"
  ON public.testimonials FOR SELECT TO anon USING (is_visible = true);
CREATE POLICY "Authenticated can view all testimonials"
  ON public.testimonials FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert testimonials"
  ON public.testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update testimonials"
  ON public.testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete testimonials"
  ON public.testimonials FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_gallery_items_updated_at
  BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();