import { createServerFn } from "@tanstack/react-start";

export type GalleryItemDTO = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

export type TestimonialDTO = {
  id: string;
  authorName: string;
  content: string;
  imageUrl: string;
};

export type SiteContentDTO = {
  gallery: GalleryItemDTO[];
  testimonials: TestimonialDTO[];
};

export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteContentDTO> => {
    const { createPublicSupabaseClient, SITE_MEDIA_BUCKET, SIGNED_URL_TTL } = await import(
      "@/lib/supabase-public"
    );
    const supabase = createPublicSupabaseClient();

    const [galleryRes, testimonialsRes] = await Promise.all([
      supabase
        .from("gallery_items")
        .select("id, title, description, image_path")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("testimonials")
        .select("id, author_name, content, image_path")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

    if (galleryRes.error) console.error("[content] gallery", galleryRes.error.message);
    if (testimonialsRes.error) console.error("[content] testimonials", testimonialsRes.error.message);

    const galleryRows = galleryRes.data ?? [];
    const testimonialRows = testimonialsRes.data ?? [];

    const paths = [
      ...galleryRows.map((r) => r.image_path),
      ...testimonialRows.map((r) => r.image_path),
    ].filter((p): p is string => Boolean(p));

    const urlByPath = new Map<string, string>();
    if (paths.length > 0) {
      const { data: signed } = await supabase.storage
        .from(SITE_MEDIA_BUCKET)
        .createSignedUrls(Array.from(new Set(paths)), SIGNED_URL_TTL);
      for (const entry of signed ?? []) {
        if (entry.path && entry.signedUrl) urlByPath.set(entry.path, entry.signedUrl);
      }
    }

    return {
      gallery: galleryRows.map((r) => ({
        id: r.id,
        title: r.title ?? "",
        description: r.description ?? "",
        imageUrl: urlByPath.get(r.image_path) ?? "",
      })),
      testimonials: testimonialRows.map((r) => ({
        id: r.id,
        authorName: r.author_name ?? "",
        content: r.content ?? "",
        imageUrl: urlByPath.get(r.image_path) ?? "",
      })),
    };
  },
);
