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

---

## Ciclo 2 — correções pós-review

Aplicadas as 4 correções do `code-review-report.md` (2 majors + 2 minors). Nada além disso
tocado (tokens.css, duplicação Login/Register etc. mantidos por instrução).

### 1. [major] Raio de busca unificado
Os três valores divergentes (5 km no texto do Login, 20 km no MapHome, 8 km default em
endpoints) viraram uma única fonte de verdade:
- `src/catalog.ts` — nova const exportada `SEARCH_RADIUS_KM = 20` (com comentário do porquê: cobre Curitiba, mantém os 14 pontos visíveis).
- `src/api/endpoints.ts:39` — default `radiusMeters = SEARCH_RADIUS_KM * 1000` (era `8000`).
- `src/screens/MapHome.tsx:51` — `useNearbyPoints(CURITIBA_CENTER, SEARCH_RADIUS_KM * 1000, filters)` (era `20000` literal).
- `src/screens/Login.tsx:37` — stat derivado: `{SEARCH_RADIUS_KM} km` (era `5 km` hardcoded).

### 2. [major] Admin "Descartes recentes" agora é global
O painel global não usa mais `useMyDisposals()` (só os descartes da Marina logada):
- `src/api/endpoints.ts` — nova interface `AdminDisposal extends Disposal` (+ `userName`, `userEmail`) e endpoint mock `getRecentDisposalsAdmin()` (ordena por data desc).
- `src/api/fixtures.ts` — nova fixture `adminRecentDisposals` com 8 descartes sintéticos de usuários variados (Bianca, Rafael, Priscila, Diego, Heloísa, Caio, Otávio, Vitor; emails `@exemplo.example`), seguindo o padrão das fixtures existentes. Materiais/status/pontos coerentes.
- `src/lib/queries.ts` — novo hook `useAdminRecentDisposals()`.
- `src/admin/AdminDashboard.tsx` — troca o hook e adiciona coluna "Usuário" (nome + email) na tabela, para o painel parecer global.

### 3. [minor] `Recenter` — `useMemo` → `useEffect`
`src/screens/MapHome.tsx:36` — side-effect (`fitBounds`) movido para `useEffect([points, map])`
com guard `useRef` (`didFit`): enquadra os pontos só no primeiro load com dados; refetch/troca
de filtro não reseta mais o zoom/pan manual do usuário. Import `useMemo` removido, `useRef` adicionado.

### 4. [minor] AdminShell — `<a onClick>` → `<button>`
`src/admin/AdminShell.tsx:31-41` — as 3 ações do rodapé (Alternar tema, Voltar ao app, Sair)
viraram `<button type="button">`, focáveis por teclado e com semântica correta. CSS em
`src/styles/app.css:506` estendido (`.admin-nav button` com reset de estilo de botão +
mesmo hover/padding do `a`), aparência inalterada.

### Validação (Ciclo 2)
- `npx tsc --noEmit` — limpo (exit 0).
- `npm run build` — OK, `dist/index.html` (~603 kB) regenerado, 162 módulos.
- Browser (Playwright headed). Obs.: o CDP do chrome bloqueia o protocolo `file:`, então o
  `dist/` foi servido via `http-server` local (`http://127.0.0.1:8848/index.html`) — mesmo
  bundle single-file, mesmo hash-router. Golden path conferido:
  - Login: stat exibe **"20 km · raio de busca"**. ✔
  - Mapa (`#/app/map`): renderiza com **todos os 14 marcadores** e lista com os 14 pontos,
    incluindo o de 12,1 km (EletroVerde Sítio Cercado) que com o raio antigo de 8 km sumia. ✔
  - Admin (`#/admin`, `admin` / `ecocoleta2025`): dashboard mostra "Descartes recentes" com
    **8 descartes de usuários variados** (nome + email), nenhum da Marina. ✔
  - **Console: 0 erros, 0 warnings.** Único verbose é sugestão do Chrome de `autocomplete`
    no campo de senha do login (pré-existente, fora de escopo). ✔
- Screenshot do dashboard admin: `coordination/.playwright-mcp/admin-dashboard-ciclo2.png`
  (ou diretório de output do Playwright). `http-server` encerrado ao fim.

### Notas
- Não commitado (conforme instrução).
- `AdminDisposal` foi colocada em `endpoints.ts` (junto de `AdminMetrics`) e importada por
  `fixtures.ts` como `import type` — sem ciclo de runtime, tsc limpo.
