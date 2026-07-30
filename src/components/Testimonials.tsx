import type { TestimonialDTO } from "@/lib/content.functions";

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
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.authorName ? `Depoimento de ${item.authorName}` : "Depoimento"}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
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
