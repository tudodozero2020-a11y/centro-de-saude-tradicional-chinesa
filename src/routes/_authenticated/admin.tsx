import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Gestão de conteúdos — Centro de Saúde MTC Estoril" },
      {
        name: "description",
        content: "Painel de gestão da galeria e dos depoimentos do centro de saúde.",
      },
      { property: "og:title", content: "Gestão de conteúdos — Centro de Saúde MTC Estoril" },
      {
        property: "og:description",
        content: "Painel de gestão da galeria e dos depoimentos do centro de saúde.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const BUCKET = "site-media";

type Tab = "gallery" | "testimonials";

type Row = {
  id: string;
  image_path: string;
  title: string;
  description: string;
  sort_order: number;
  is_visible: boolean;
};

function toRow(tab: Tab, r: Record<string, unknown>): Row {
  return {
    id: String(r.id),
    image_path: String(r.image_path ?? ""),
    title: String((tab === "gallery" ? r.title : r.author_name) ?? ""),
    description: String((tab === "gallery" ? r.description : r.content) ?? ""),
    sort_order: Number(r.sort_order ?? 0),
    is_visible: Boolean(r.is_visible),
  };
}

function toColumns(tab: Tab, row: { title: string; description: string }) {
  return tab === "gallery"
    ? { title: row.title, description: row.description }
    : { author_name: row.title, content: row.description };
}

const LABELS: Record<Tab, { table: string; heading: string; title: string; body: string }> = {
  gallery: {
    table: "gallery_items",
    heading: "Galeria (carrossel)",
    title: "Título",
    body: "Descrição",
  },
  testimonials: {
    table: "testimonials",
    heading: "Depoimentos",
    title: "Nome (opcional)",
    body: "Depoimento",
  },
};

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("gallery");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return setIsAdmin(false);
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(Boolean(data));
    })();
  }, []);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-jade-deep/10 bg-card">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-jade-deep font-display text-lg text-cream">
              氣
            </span>
            <h1 className="font-display text-2xl text-jade-deep">Gestão de conteúdos</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <a href="/" className="text-jade-deep hover:text-gold">
              Ver site
            </a>
            <button
              onClick={handleSignOut}
              className="rounded-full border border-jade-deep/20 px-4 py-2 text-jade-deep transition-colors hover:bg-jade-deep hover:text-cream"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {isAdmin === false && (
          <div className="mb-8 rounded-sm border border-destructive/30 bg-destructive/5 p-5 text-sm text-foreground">
            A sua conta não tem permissões de administrador. Peça para lhe ser atribuída a
            função <strong>admin</strong> na base de dados.
          </div>
        )}

        <div className="mb-8 flex gap-2">
          {(Object.keys(LABELS) as Tab[]).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full px-5 py-2 text-sm transition-colors ${
                tab === key
                  ? "bg-jade-deep text-cream"
                  : "border border-jade-deep/20 text-jade-deep hover:bg-secondary"
              }`}
            >
              {LABELS[key].heading}
            </button>
          ))}
        </div>

        <ContentManager key={tab} tab={tab} />
      </main>
    </div>
  );
}

function ContentManager({ tab }: { tab: Tab }) {
  const labels = LABELS[tab];
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["admin-content", tab], [tab]);

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(labels.table as "gallery_items")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      const rows = (data ?? []).map((r) => toRow(tab, r as Record<string, unknown>));
      const paths = rows.map((r) => r.image_path).filter(Boolean);
      const urls = new Map<string, string>();
      if (paths.length) {
        const { data: signed } = await supabase.storage
          .from(BUCKET)
          .createSignedUrls(Array.from(new Set(paths)), 3600);
        for (const s of signed ?? []) {
          if (s.path && s.signedUrl) urls.set(s.path, s.signedUrl);
        }
      }
      return rows.map((r) => ({ ...r, imageUrl: urls.get(r.image_path) ?? "" }));
    },
  });

  const rows = data ?? [];
  const refresh = () => queryClient.invalidateQueries({ queryKey });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function uploadImage(f: File) {
    const ext = f.name.split(".").pop() ?? "jpg";
    const path = `${tab}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, f, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw error;
    return path;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (tab === "gallery" && !file) {
      toast.error("Escolha uma imagem.");
      return;
    }
    setSaving(true);
    try {
      const imagePath = file ? await uploadImage(file) : "";
      const maxOrder = rows.reduce((m, r) => Math.max(m, r.sort_order), 0);
      const { error } = await supabase
        .from(labels.table as "gallery_items")
        .insert({
          image_path: imagePath,
          sort_order: maxOrder + 1,
          is_visible: true,
          ...toColumns(tab, { title, description }),
        } as never);
      if (error) throw error;
      setTitle("");
      setDescription("");
      setFile(null);
      (document.getElementById(`file-${tab}`) as HTMLInputElement | null)?.value &&
        ((document.getElementById(`file-${tab}`) as HTMLInputElement).value = "");
      toast.success("Item adicionado.");
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível guardar. Confirme que tem permissões de administrador.");
    } finally {
      setSaving(false);
    }
  }

  async function updateRow(id: string, patch: Record<string, unknown>) {
    const { error } = await supabase
      .from(labels.table as "gallery_items")
      .update(patch as never)
      .eq("id", id);
    if (error) {
      console.error(error);
      toast.error("Não foi possível atualizar.");
      return;
    }
    refresh();
  }

  async function deleteRow(id: string, imagePath: string) {
    if (!confirm("Remover este item?")) return;
    const { error } = await supabase.from(labels.table as "gallery_items").delete().eq("id", id);
    if (error) {
      console.error(error);
      toast.error("Não foi possível remover.");
      return;
    }
    if (imagePath) await supabase.storage.from(BUCKET).remove([imagePath]);
    toast.success("Item removido.");
    refresh();
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const a = rows[index];
    const b = rows[target];
    await Promise.all([
      supabase
        .from(labels.table as "gallery_items")
        .update({ sort_order: b.sort_order } as never)
        .eq("id", a.id),
      supabase
        .from(labels.table as "gallery_items")
        .update({ sort_order: a.sort_order } as never)
        .eq("id", b.id),
    ]);
    refresh();
  }

  return (
    <div className="grid gap-10">
      <form
        onSubmit={handleCreate}
        className="grid gap-5 rounded-sm border border-jade-deep/10 bg-card p-8 shadow-soft"
      >
        <h2 className="font-display text-2xl text-jade-deep">Adicionar novo item</h2>
        <label className="grid gap-2 text-sm text-jade-deep">
          {labels.title}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-sm border border-input bg-background px-4 py-3 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-jade-deep">
          {labels.body}
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none rounded-sm border border-input bg-background px-4 py-3 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-jade-deep">
          Imagem {tab === "testimonials" && "(opcional)"}
          <input
            id={`file-${tab}`}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="rounded-sm border border-input bg-background px-4 py-2 text-sm outline-none focus:border-gold"
          />
        </label>
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Pré-visualização da imagem selecionada"
            className="max-h-48 w-fit rounded-sm object-cover"
          />
        )}
        <button
          type="submit"
          disabled={saving}
          className="justify-self-start rounded-full bg-jade-deep px-8 py-3 text-sm uppercase tracking-wider text-cream transition-all hover:bg-jade disabled:opacity-60"
        >
          {saving ? "A guardar…" : "Adicionar"}
        </button>
      </form>

      <div className="grid gap-4">
        {isLoading && <p className="text-sm text-muted-foreground">A carregar…</p>}
        {!isLoading && rows.length === 0 && (
          <p className="text-sm text-muted-foreground">Ainda não existem itens.</p>
        )}
        {rows.map((row, index) => (
          <article
            key={row.id}
            className="grid gap-4 rounded-sm border border-jade-deep/10 bg-card p-6 shadow-soft sm:grid-cols-[160px_1fr]"
          >
            {row.imageUrl ? (
              <img
                src={row.imageUrl}
                alt={row.title || "Imagem do item"}
                className="aspect-[4/3] w-full rounded-sm object-cover"
              />
            ) : (
              <div className="grid aspect-[4/3] w-full place-items-center rounded-sm bg-secondary text-xs text-muted-foreground">
                Sem imagem
              </div>
            )}
            <div className="grid gap-3">
              <input
                type="text"
                defaultValue={row.title}
                placeholder={labels.title}
                onBlur={(e) =>
                  e.target.value !== row.title &&
                  updateRow(row.id, toColumns(tab, { title: e.target.value, description: row.description }))
                }
                className="rounded-sm border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <textarea
                rows={3}
                defaultValue={row.description}
                placeholder={labels.body}
                onBlur={(e) =>
                  e.target.value !== row.description &&
                  updateRow(row.id, toColumns(tab, { title: row.title, description: e.target.value }))
                }
                className="resize-none rounded-sm border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  onClick={() => updateRow(row.id, { is_visible: !row.is_visible })}
                  className={`rounded-full px-4 py-2 transition-colors ${
                    row.is_visible
                      ? "bg-jade-deep text-cream"
                      : "border border-jade-deep/20 text-jade-deep"
                  }`}
                >
                  {row.is_visible ? "Visível" : "Oculto"}
                </button>
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="rounded-full border border-jade-deep/20 px-4 py-2 text-jade-deep disabled:opacity-40"
                >
                  ↑ Subir
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === rows.length - 1}
                  className="rounded-full border border-jade-deep/20 px-4 py-2 text-jade-deep disabled:opacity-40"
                >
                  ↓ Descer
                </button>
                <button
                  onClick={() => deleteRow(row.id, row.image_path)}
                  className="rounded-full border border-destructive/40 px-4 py-2 text-destructive"
                >
                  Remover
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
