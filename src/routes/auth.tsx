import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Área reservada — Centro de Saúde MTC Estoril" },
      {
        name: "description",
        content:
          "Acesso reservado à gestão de conteúdos do Centro de Saúde de Medicina Tradicional Chinesa no Estoril.",
      },
      { property: "og:title", content: "Área reservada — Centro de Saúde MTC Estoril" },
      {
        property: "og:description",
        content: "Acesso reservado à gestão de conteúdos do centro de saúde.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível entrar. Verifique os dados de acesso.");
      return;
    }
    navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-jade-deep font-display text-xl text-cream">
            氣
          </span>
          <h1 className="mt-4 font-display text-3xl text-jade-deep">Área reservada</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gestão de conteúdos do site.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 rounded-sm border border-jade-deep/10 bg-card p-8 shadow-soft"
        >
          <label className="grid gap-2 text-sm text-jade-deep">
            Email
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-sm border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-gold"
            />
          </label>
          <label className="grid gap-2 text-sm text-jade-deep">
            Palavra-passe
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-sm border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-gold"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-jade-deep px-8 py-3 text-sm uppercase tracking-wider text-cream transition-all hover:bg-jade disabled:opacity-60"
          >
            {loading ? "A entrar…" : "Entrar"}
          </button>
        </form>

        <a
          href="/"
          className="mt-6 block text-center text-xs uppercase tracking-[0.3em] text-gold hover:text-jade-deep"
        >
          Voltar ao site
        </a>
      </div>
    </div>
  );
}
