import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { GalleryItemDTO } from "@/lib/content.functions";

export function GalleryCarousel({ items }: { items: GalleryItemDTO[] }) {
  if (items.length === 0) return null;

  return (
    <section id="galeria" className="border-y border-jade-deep/10 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 text-xs uppercase tracking-[0.4em] text-gold">Galeria</div>
          <h2 className="font-display text-4xl leading-tight text-jade-deep sm:text-5xl">
            O nosso espaço
            <em className="not-italic text-gold"> em imagens.</em>
          </h2>
        </div>

        <Carousel opts={{ align: "start", loop: items.length > 2 }} className="mt-14">
          <CarouselContent className="-ml-6">
            {items.map((item) => (
              <CarouselItem key={item.id} className="pl-6 sm:basis-1/2 lg:basis-1/3">
                <figure className="group h-full overflow-hidden rounded-sm border border-jade-deep/10 bg-card shadow-soft">
                  <div className="overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title || "Imagem da galeria do centro de saúde"}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  {(item.title || item.description) && (
                    <figcaption className="p-6">
                      {item.title && (
                        <h3 className="font-display text-2xl text-jade-deep">{item.title}</h3>
                      )}
                      {item.description && (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                      <div className="gold-divider mt-6 max-w-[40px] transition-all group-hover:max-w-full" />
                    </figcaption>
                  )}
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 border-jade-deep/20 text-jade-deep hover:bg-jade-deep hover:text-cream" />
          <CarouselNext className="-right-4 border-jade-deep/20 text-jade-deep hover:bg-jade-deep hover:text-cream" />
        </Carousel>
      </div>
    </section>
  );
}
