import { useCallback, useEffect, useRef, useState } from "react";
import type { TestimonialDTO } from "@/lib/content.functions";

function TestimonialImages({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (next: number) => {
      setFading(true);
      setTimeout(() => {
        setIndex(next);
        setFading(false);
      }, 400);
    },
    [],
  );

  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(() => {
      goTo((index + 1) % images.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images.length, index, goTo]);

  if (images.length === 0) return null;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden">
      <img
        src={images[index]}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover transition-opacity duration-400 ${
          fading ? "opacity-0" : "opacity-100"
        }`}
      />
      {images.length > 1 && (
        <>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Imagem ${i + 1} de ${images.length}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-gold" : "w-1.5 bg-cream/70 hover:bg-cream"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function Testimonials({ items }: { items: TestimonialDTO[] }) {
  if (items.length === 0) return null;

  return (
    <section id="depoimentos" className="bg-secondary/50">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 text-xs uppercase tracking-[0.4em] text-gold">Depoimentos</div>
          <h2 className="font-display text-4xl leading-tight text-jade-deep sm:text-5xl">
            Histórias de quem
            <em className="not-italic text-gold"> recuperou o equilíbrio.</em>
          </h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <figure
              key={item.id}
              className="flex h-full flex-col overflow-hidden rounded-sm border border-jade-deep/10 bg-card shadow-soft transition-colors hover:border-gold"
            >
              {item.imageUrls.length > 0 && (
                <TestimonialImages
                  images={item.imageUrls}
                  alt={item.authorName ? `Depoimento de ${item.authorName}` : "Depoimento"}
                />
              )}
              <blockquote className="flex flex-1 flex-col p-8">
                <span className="font-display text-4xl leading-none text-gold">“</span>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.content}
                </p>
                {item.authorName && (
                  <figcaption className="mt-6 text-xs uppercase tracking-[0.3em] text-jade-deep">
                    {item.authorName}
                  </figcaption>
                )}
              </blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
