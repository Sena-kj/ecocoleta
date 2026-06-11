---
status: done
agent: frontend-dev
feature: build-estatico-file-protocol
date: 2026-06-11
---

# Frontend Report — build que abre direto do disco (file://)

## Summary

O build de produção (`dist/`) agora abre direto do disco via `file://` (duplo-clique no
`index.html`, sem servidor) para entrega estática ao professor. Três mudanças: router de
history → hash (`createHashRouter`), `base: './'` + assets de `public/` via
`import.meta.env.BASE_URL`, e — o ponto crítico — inline de JS/CSS num único HTML com
`vite-plugin-singlefile`, porque `<script type=module>` é bloqueado por CORS (origin `null`)
em `file://` e sem isso o app nem inicializava. Validado via Playwright headed abrindo o
`file://` real: golden path inteiro renderiza, mapa com 12 tiles + 28 marcadores, zero erros
no console.

## Arquivos tocados

- `src/router.tsx:1` — `createBrowserRouter` → `createHashRouter` (import)
- `src/router.tsx:22` — `createBrowserRouter([...])` → `createHashRouter([...])`. Rotas viram
  `#/onboarding`, `#/app/map`, `#/admin` etc. `<Navigate>`/`navigate()` com paths absolutos
  não precisaram mudar (hash router os interpreta como hash).
- `vite.config.ts:3` — adicionado `import { viteSingleFile } from 'vite-plugin-singlefile'`
- `vite.config.ts:8` — adicionado `base: './'`
- `vite.config.ts` (plugins) — `plugins: [react(), viteSingleFile({ removeViteModuleLoader: true })]`
- `index.html:5` — favicon `href="/leaf.svg"` → `href="./leaf.svg"`
- `src/components/AppShell.tsx:37` — `<img src="/leaf.svg">` → `src={`${import.meta.env.BASE_URL}leaf.svg`}`
- `src/screens/Login.tsx:20` — idem
- `src/screens/Register.tsx:19` — idem
- `src/admin/AdminLogin.tsx:34` — idem
- `src/admin/AdminShell.tsx:20` — idem
- `package.json` — devDependency `vite-plugin-singlefile` adicionada

## Itens verificados (não precisaram de mudança)

- `src/screens/MapHome.tsx:10-17` — marcadores usam `L.divIcon` com HTML/emoji inline, não
  marker icon URLs do Leaflet. Sem problema de `iconUrl` absoluta em file://.
- `src/screens/MapHome.tsx:86-89` — TileLayer usa CDN OSM (`https://{s}.tile.openstreetmap.org`).
  OK com internet.
- `src/styles/tokens.css:178` — único `url()` em CSS é um data URI inline (ruído SVG). OK.
- `src/api/mode.ts:3` — `IS_MOCK = import.meta.env.VITE_API_MODE !== 'live'`. Nenhum `.env`
  no projeto, então mock é o default no build. Confirmado.
- Fontes (Fraunces/Hanken Grotesk) via Google Fonts CDN — OK com internet.

## Validação

- `npx tsc --noEmit` — limpo, sem erros.
- `npm run build` — OK. Saída: `dist/index.html` (~600 kB, JS+CSS inline) + `dist/leaf.svg`.
  Sem nenhuma referência externa a `./assets`.
- **file:// real** (Playwright headed, chrome do ms-playwright, `file:///C:/Users/kauan/Projetos/EcoColeta/dist/index.html`):
  - Raiz `''` → redireciona para `#/onboarding` (rootLen 771)
  - `#/login` renderiza (rootLen 1653)
  - `#/app/map` — 12 tiles carregados, 12 completos, **28 marcadores** (rootLen 21976)
  - `#/app/rewards` (Trocas), `#/app/ranking`, `#/app/profile` renderizam
  - `#/admin/login` + preencher `admin` / `ecocoleta2025` + submit → redireciona para `#/admin`
    (dashboard, rootLen 2431) — auth admin OK
  - **Console: 0 mensagens. Erros: 0.**
- Screenshot do mapa via file:// salvo em `coordination/map-file-proto.png` (tiles OSM,
  marcadores azuis/laranja, header com logo, lista de pontos próximos).

> Nota de método: `vite preview`/HTTP não prova file:// (semântica CORS de módulo difere).
> A validação acima abre o `file://` genuíno. Antes do singlefile, o mesmo teste dava
> `rootLen=0` + erro CORS (`origin 'null' has been blocked by CORS policy`) no `<script type=module>`.

## Fluxo para o QA reproduzir

1. `cd C:\Users\kauan\Projetos\EcoColeta && npm run build`
2. Duplo-clique em `dist\index.html` (ou abrir no navegador como `file:///.../dist/index.html`),
   com internet ligada (tiles/fontes via CDN).
3. App abre em `#/onboarding`. Navegar: login → mapa (`#/app/map`) → Trocas (`#/app/rewards`)
   → Ranking (`#/app/ranking`) → Perfil (`#/app/profile`). Admin: `#/admin/login`,
   credenciais `admin` / `ecocoleta2025` → dashboard.

## Next steps

- Manager: commitar (não commitei, conforme instrução). `package.json`/`package-lock.json`
  têm a nova devDependency.
- `coordination/map-file-proto.png` é evidência de validação; remover se não for versionar.
- Nenhuma flag de mock a desligar nesta entrega — mock é o modo da demo por design.

## Blockers / questions

Nenhum. Sem inbox no projeto.

## Gap de memória preenchido

Não havia pattern de "build Vite para file://" no vault. Criado
`patterns/frontend/vite-spa-build-for-file-protocol.md` + linha em `patterns/_index.md`
(seção Frontend / UI). Cobre os 3 fixes (hashRouter, base relativo, singlefile/CORS) e o
método de validação file:// genuíno.
