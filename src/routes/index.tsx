import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import aboutAsset from "@/assets/zhou-yufang.webp.asset.json";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Centro de Saúde de Medicina Tradicional Chinesa — Estoril" },
      {
        name: "description",
        content:
          "Medicina Tradicional Chinesa no Estoril. Terapias complementares, acupuntura, fitoterapia e cuidado personalizado com Zhou Yu Fang. Marque a sua consulta.",
      },
      { property: "og:title", content: "Centro de Saúde de Medicina Tradicional Chinesa — Estoril" },
      { property: "og:description", content: "Medicina Tradicional Chinesa no Estoril. Terapias complementares, acupuntura, fitoterapia e cuidado personalizado com Zhou Yu Fang. Marque a sua consulta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const WA_URL =
  "https://wa.me/351964666595?text=" + encodeURIComponent("Olá, gostaria de marcar uma consulta.");

const services = [
  {
    title: "Medicina Interna",
    desc: "Temos uma vasta experiência no tratamento das seguintes condições: doenças cardíacas, hemiplegia, doença de Parkinson, hipertensão, hiperglicemia, hiperlipidemia, hiperuricemia, uremia, cancro, hepatite B, SIDA e dependência de drogas.",
    icon: "◐",
  },
  {
    title: "Condições Crónicas",
    desc: "Cuidado complementar em complicações diabetes e suas complicações, hipertensão, flebite e uremia.",
    icon: "❋",
  },
  {
    title: "Alívio de Dores",
    desc: "Pescoço, ombros, costas, pernas, dores reumáticas e articulares, artrite, trombose venosa profunda (sem amputação)",
    icon: "◈",
  },
  {
    title: "Bem-estar Masculino",
    desc: "Andrologia: Disfunção erétil, ejaculação precoce, problemas de próstata e doenças sexualmente transmissiveis. cuidados para o bem-estar do homem.",
    icon: "☯",
  },
  {
    title: "Bem-estar Feminino",
    desc: "Ginecologia: Síndrome da menopausa, cancro do colo do útero, cancro do ovário, dismenorreia, infertilidade, doenças vulvares, prolapso uterino",
    icon: "✧",
  },
  {
    title: "Estética & Beleza",
    desc: "Acne, borbulhas, alergias de pele, remoção de sardas, controlo de peso e tratamentos estéticos.",
    icon: "❀",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <About />
      <Services />
      <LocationHours />
      <ContactForm />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-jade-deep font-display text-lg text-cream">
            氣
          </span>
          <span className="hidden font-display text-lg leading-tight text-jade-deep sm:block">
            Medicina Tradicional Chinesa
            <span className="block text-xs uppercase tracking-[0.3em] text-gold">Estoril</span>
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-jade-deep md:flex">
          <a href="#sobre" className="hover:text-gold">Sobre</a>
          <a href="#servicos" className="hover:text-gold">Serviços</a>
          <a href="#localizacao" className="hover:text-gold">Localização</a>
          <a href="#contacto" className="hover:text-gold">Contacto</a>
        </nav>
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-full border border-jade-deep/20 bg-white/80 px-5 py-2 text-sm text-jade-deep backdrop-blur transition-colors hover:bg-jade-deep hover:text-cream md:inline-block"
        >
          Marcar Consulta
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Ambiente sereno de medicina tradicional chinesa"
          width={1600}
          height={1000}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/85 to-transparent" />
      </div>
      <div className="relative mx-auto grid min-h-[92vh] max-w-7xl grid-cols-1 items-center px-6 pb-20 pt-40 lg:px-10 lg:pt-32">
        <div className="max-w-2xl">
          <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-gold">
            <span className="h-px w-10 bg-gold" />
            Estoril · desde há décadas
          </div>
          <h1 className="font-display text-5xl leading-[1.05] text-jade-deep sm:text-6xl lg:text-7xl">
            Cuidado natural,
            <br />
            <em className="not-italic text-gold">equilíbrio</em> para o corpo
            <br />
            e a mente.
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Centro de Saúde de Medicina Tradicional Chinesa; Terapias Complementares, Tratamento Personalizado; Uma Abordagem Médica Tradicional Focada no Bem-Estar Físico, Oferecida pela Consultora de Saúde <span className="text-jade-deep">Zhou Yufang</span>.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-jade-deep px-8 py-4 text-sm font-medium uppercase tracking-wider text-cream shadow-soft transition-all hover:bg-jade hover:shadow-gold"
            >
              Marcar Consulta via WhatsApp
            </a>
            <a
              href="#servicos"
              className="rounded-full border border-jade-deep/20 px-8 py-4 text-sm uppercase tracking-wider text-jade-deep transition-colors hover:bg-jade-deep hover:text-cream"
            >
              Ver Serviços
            </a>
          </div>
          <div className="mt-14 flex flex-wrap gap-8 border-t border-jade-deep/10 pt-8 text-sm text-muted-foreground">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gold">Horário</div>
              <div className="mt-1 text-jade-deep">10:00 – 18:00</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gold">Telefone</div>
              <div className="mt-1 text-jade-deep">964 666 595</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gold">Morada</div>
              <div className="mt-1 text-jade-deep">Rua dos Cedros, N.º 188</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="sobre" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="relative">
          <img
            src={aboutAsset.url}
            alt="Zhou Yu Fang, consultora de saúde de Medicina Tradicional Chinesa, no consultório"
            width={1200}
            height={1400}
            loading="lazy"
            className="aspect-[4/5] w-full rounded-sm object-cover shadow-soft"
          />
          <div className="absolute -bottom-6 -right-6 hidden max-w-[220px] rounded-sm border border-gold/40 bg-cream p-6 font-display text-2xl leading-tight text-jade-deep shadow-gold sm:block">
            "Reequilibrar antes de tratar."
            <div className="mt-2 text-xs font-body uppercase tracking-[0.3em] text-gold">
              — Zhou Yu Fang
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-4 text-xs uppercase tracking-[0.4em] text-gold">Sobre</div>
          <h2 className="font-display text-4xl leading-tight text-jade-deep sm:text-5xl">
            Uma medicina empírica com raízes em 5000 anos de prática
            <em className="not-italic text-gold"> em milénio.</em>
          </h2>
          <div className="gold-divider my-8 max-w-[80px]" />
          <p className="text-lg leading-relaxed text-muted-foreground">
            A consultora de saúde <span className="text-jade-deep">Zhou Yu Fang</span> acolhe
            no Estoril quem procura uma abordagem natural e integrada ao
            bem-estar. Guiada pelos princípios da Medicina Tradicional Chinesa,
            trabalha o equilíbrio energético do corpo com terapias suaves,
            fitoterapia e um olhar atento ao contexto de cada pessoa.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Cada consulta decorre num espaço tranquilo e livre de stress, com
            atendimento personalizado e objetivos de tratamento sempre
            alinhados, visando a restauração da saúde.
          </p>
          <ul className="mt-8 grid gap-3 text-sm text-jade-deep sm:grid-cols-2">
            {[
              "Consulta personalizada",
              "Terapias naturais",
              "Fitoterapia chinesa",
              "Acompanhamento continuado",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="text-gold">✦</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="servicos" className="border-y border-jade-deep/10 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 text-xs uppercase tracking-[0.4em] text-gold">
            Áreas de Atuação
          </div>
          <h2 className="font-display text-4xl leading-tight text-jade-deep sm:text-5xl">
            Terapias complementares
            <em className="not-italic text-gold"> de bem-estar.</em>
          </h2>
          <p className="mt-6 text-muted-foreground">
            Cada serviço serve como um apoio complementar na sua jornada de
            saúde, com foco no alívio da dor e na restauração da saúde.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.title}
              className="group relative overflow-hidden rounded-sm border border-jade-deep/10 bg-card p-8 transition-all hover:border-gold hover:shadow-soft"
            >
              <div className="mb-6 grid h-14 w-14 place-items-center rounded-full bg-jade-deep/5 text-2xl text-gold transition-colors group-hover:bg-jade-deep group-hover:text-cream">
                {s.icon}
              </div>
              <h3 className="font-display text-2xl text-jade-deep">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
              <div className="gold-divider mt-6 max-w-[40px] transition-all group-hover:max-w-full" />
            </article>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-3xl text-center text-xs italic leading-relaxed text-muted-foreground">
        </p>
      </div>
    </section>
  );
}

function LocationHours() {
  return (
    <section id="localizacao" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <div className="mb-4 text-xs uppercase tracking-[0.4em] text-gold">Visite-nos</div>
          <h2 className="font-display text-4xl leading-tight text-jade-deep sm:text-5xl">
            Encontre-nos
            <em className="not-italic text-gold"> no Estoril.</em>
          </h2>
          <div className="gold-divider my-8 max-w-[80px]" />

          <dl className="space-y-6 text-jade-deep">
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-gold">Morada</dt>
              <dd className="mt-1 text-lg">
                Rua dos Cedros, N.º 188
                <br />
                Gabinete 3, Estoril
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-gold">Horário</dt>
              <dd className="mt-1 text-lg">
                Segunda a Sábado
                <br />
                10:00 – 18:00
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-gold">
                Telefone / WhatsApp
              </dt>
              <dd className="mt-1 text-lg">
                <a href="tel:+351964666595" className="hover:text-gold">
                  964 666 595
                </a>
              </dd>
            </div>
          </dl>

          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block rounded-full bg-jade-deep px-8 py-4 text-sm uppercase tracking-wider text-cream transition-all hover:bg-jade"
          >
            Marcar Consulta
          </a>
        </div>

        <div className="overflow-hidden rounded-sm border border-jade-deep/10 shadow-soft">
          <iframe
            title="Localização — Rua dos Cedros 188, Estoril"
            src="https://www.google.com/maps?q=Rua%20dos%20Cedros%20188%20Estoril&output=embed"
            width="100%"
            height="100%"
            style={{ minHeight: 480, border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  return (
    <section id="contacto" className="border-t border-jade-deep/10 bg-secondary/40">
      <div className="mx-auto max-w-3xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="text-center">
          <div className="mb-4 text-xs uppercase tracking-[0.4em] text-gold">Contacto</div>
          <h2 className="font-display text-4xl leading-tight text-jade-deep sm:text-5xl">
            Deixe-nos uma
            <em className="not-italic text-gold"> mensagem.</em>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Preferimos o WhatsApp para uma resposta mais rápida, mas pode
            também escrever-nos por aqui.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const nome = data.get("nome");
            const telefone = data.get("telefone");
            const mensagem = data.get("mensagem");
            const text = `Olá, sou ${nome} (${telefone}). ${mensagem}`;
            window.open(
              `https://wa.me/351964666595?text=${encodeURIComponent(text)}`,
              "_blank",
            );
          }}
          className="mt-12 grid gap-5 rounded-sm border border-jade-deep/10 bg-card p-8 shadow-soft sm:p-10"
        >
          <label className="grid gap-2 text-sm text-jade-deep">
            Nome
            <input
              required
              name="nome"
              type="text"
              className="rounded-sm border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-gold"
            />
          </label>
          <label className="grid gap-2 text-sm text-jade-deep">
            Telefone
            <input
              required
              name="telefone"
              type="tel"
              className="rounded-sm border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-gold"
            />
          </label>
          <label className="grid gap-2 text-sm text-jade-deep">
            Mensagem
            <textarea
              required
              name="mensagem"
              rows={4}
              className="resize-none rounded-sm border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-gold"
            />
          </label>
          <button
            type="submit"
            className="mt-2 rounded-full bg-jade-deep px-8 py-4 text-sm uppercase tracking-wider text-cream transition-all hover:bg-jade"
          >
            Enviar via WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-jade-deep text-cream/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-3 lg:px-10">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gold font-display text-lg text-jade-deep">
              氣
            </span>
            <span className="font-display text-lg text-cream">
              Medicina Tradicional Chinesa
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Centro de Saúde de Medicina Tradicional Chinesa — cuidado natural,
            equilíbrio para o corpo e a mente.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-gold">Contactos</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Rua dos Cedros, N.º 188, Gabinete 3, Estoril</li>
            <li>
              <a href="tel:+351964666595" className="hover:text-gold">
                964 666 595
              </a>
            </li>
            <li>Horário: 10:00 – 18:00</li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-gold">Consultora</div>
          <p className="mt-4 text-sm">
            Zhou Yu Fang
            <br />
            Consultora de Saúde
          </p>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-xs text-cream/60 lg:px-10">
          © {new Date().getFullYear()} Centro de Saúde de Medicina Tradicional Chinesa. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
