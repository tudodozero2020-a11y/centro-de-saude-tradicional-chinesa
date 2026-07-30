# Galeria em carrossel + Depoimentos, geridos por painel admin

Duas novas secções na página, ambas alimentadas pela base de dados Supabase já ligada ao projeto, e editáveis num painel de administração protegido por login.

## Ordem da página

1. Hero
2. Sobre
3. Serviços
4. **Galeria (carrossel de imagens com título e descrição)** — nova
5. **Depoimentos (imagem + descrição)** — nova
6. Localização
7. Contacto
8. Rodapé

## Secção Galeria

- Carrossel horizontal com setas e pontos de navegação, arrastável no telemóvel.
- Cada slide: imagem, título e descrição curta.
- Só aparecem os itens marcados como visíveis, pela ordem definida no painel.
- Se ainda não houver itens, a secção não é apresentada.

## Secção Depoimentos

- Grelha de cartões com a foto do paciente e o texto do depoimento (mais um campo opcional de nome).
- Mesma lógica de visibilidade e ordenação.

## Painel de administração

- Nova página de login em `/auth` (email + palavra-passe). Sem registo público — a conta é criada por si no painel do Supabase, para que ninguém de fora consiga entrar.
- Página `/admin` protegida, com dois separadores: Galeria e Depoimentos.
- Em cada separador: listar, criar, editar, apagar, reordenar (mover para cima/baixo) e ligar/desligar visibilidade.
- Upload de imagens diretamente no formulário (guardadas no armazenamento do Supabase), com pré-visualização.

## Detalhes técnicos

Correção prévia obrigatória: a build está a falhar porque o pacote `@supabase/supabase-js` não está instalado, apesar de `src/integrations/supabase/*` já existir. Instalar antes de tudo o resto.

Base de dados (migração):
- `gallery_items`: `image_path`, `title`, `description`, `sort_order`, `is_visible`, timestamps.
- `testimonials`: `image_path`, `author_name`, `content`, `sort_order`, `is_visible`, timestamps.
- GRANTs explícitos: `SELECT` para `anon` e `authenticated`; `SELECT/INSERT/UPDATE/DELETE` para `authenticated`; `ALL` para `service_role`.
- RLS: leitura pública apenas de linhas com `is_visible = true`; escrita apenas para utilizadores autenticados.
- Trigger de `updated_at`.

Armazenamento:
- Bucket público `site-media` criado via ferramenta de storage; políticas em `storage.objects`: leitura pública, escrita/remoção só para autenticados.

Código:
- `src/lib/content.functions.ts` — server functions públicas de leitura (cliente publishable, sem service role) usadas no loader de `/`.
- `src/lib/admin-content.functions.ts` — server functions de escrita com `requireSupabaseAuth`.
- Componentes `GalleryCarousel.tsx` e `Testimonials.tsx` (usa `embla-carousel-react`, já instalado, através de `@/components/ui/carousel`).
- Rotas: `src/routes/auth.tsx` (pública) e `src/routes/_authenticated/admin.tsx` + layout `_authenticated/route.tsx`.
- `attachSupabaseAuth` registado em `src/start.ts` para as chamadas autenticadas.
- `head()` próprio na rota `/admin` e `/auth`.

## Depois de aprovado

Terá de criar o seu utilizador administrador no painel do Supabase (Authentication → Users → Add user), indico-lhe o link no fim.
