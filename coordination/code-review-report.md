---
status: done
agent: code-reviewer
feature: ecocoleta-prototipo-completo
date: 2026-06-11
reviewed-commit: d50bbc8
verdict: approved
---

# Code Review — EcoColeta (protótipo acadêmico, SPA mockada)

## Summary

**APPROVED** — 0 blockers, 2 majors, 9 minors, 7 nits.

Código de protótipo bem acima da média: arquitetura limpa (fixtures-first com camada
`endpoints` trocável por `live`, hooks de query isolados, DS por tokens consistente),
nomes claros, funções curtas (nenhuma > 80 linhas), sem dead code de imports, sem
`catch {}` engolindo erro, sem anti-padrão de API Claude (o projeto nem chama LLM).
TypeScript strict + `tsc --noEmit` limpo segundo o dev report.

Nenhum finding é bloqueante para a entrega ao professor. Os 2 majors são incoerências
de dado/texto que aparecem na tela e podem gerar pergunta do professor. Recomendo
corrigir os 2 majors antes de apresentar; o resto é polimento opcional.

Escopo ignorado por instrução (não reportado): ausência de testes, ausência de backend,
credencial admin fixa no bundle.

---

## Result

### Incoerências de dado / texto visíveis (os 2 majors)

#### `src/screens/Login.tsx` + `src/screens/MapHome.tsx`
- **[MAJOR]** `Login.tsx:36` exibe a stat "5 km · raio de busca", mas `MapHome.tsx:51`
  chama `useNearbyPoints(CURITIBA_CENTER, 20000, filters)` — raio real de 20 km. E
  `endpoints.ts:39` tem default `radiusMeters = 8000` (8 km): três valores para a mesma
  noção. Com 5 km vários pontos sumiriam do mapa (fixture cobre Curitiba inteira). Alinhe.

#### `src/admin/AdminDashboard.tsx`
- **[MAJOR]** linha 11 e 47-54: "Descartes recentes" (painel admin global) é alimentado
  por `useMyDisposals()` — só os 5 descartes da usuária logada Marina. O dashboard fala em
  "1240+ descartes totais" logo acima; a tabela mostra apenas os do usuário corrente.
  Incoerência admin vs. usuário, óbvia se abrir Histórico e Admin lado a lado.

### Bugs reais (efeitos / estado)

#### `src/screens/MapHome.tsx`
- **[MINOR]** linha 38-43: `Recenter` usa `useMemo` para rodar side-effect (`fitBounds`).
  `useMemo` é para memoizar valor, não efeito — o correto é `useEffect([points, map])`.
  Funciona hoje por sorte.
- **[MINOR]** linha 36-45: re-executa `fitBounds` a cada mudança de identidade de `points`
  (refetch / troca de filtro), podendo resetar o zoom/pan manual do usuário. Guard com
  `useRef` para fitBounds só no primeiro load.

#### `src/screens/History.tsx` / `src/api/endpoints.ts`
- **[MINOR]** `endpoints.ts:102` cria disposal com `pointsAwarded: 0` (PENDING) — coerente.
  Mas `History.tsx:49` mostra `meta.pointsPerUnit * d.quantity` como estimativa sem
  qualificador ("+X pts"), legível como "pontos já ganhos". Prefixar com "~" ou "a ganhar".

### Duplicação

- **[MINOR]** `Login.tsx` e `Register.tsx` repetem quase inteiro o layout `.auth` (~40
  linhas de markup + mesmo `setTimeout(navigate('/app/map'))`). Candidato a `<AuthLayout>`.
- **[MINOR]** `initials(name)` idêntico em `Profile.tsx:6` e `Ranking.tsx:6`; `fmtDate` em
  `History.tsx:6`, `AdminDashboard.tsx:5`, `AdminRedemptions.tsx:11`. Mover p/ `lib/format.ts`.
- **[NIT]** `STATUS_LABEL` (`ui.tsx:140`) e `STATUS` (`AdminRedemptions.tsx:5`) têm a mesma
  forma `{label,cls}`. Domínios diferentes — só anoto o padrão.

### Design system / tokens

#### `src/styles/tokens.css`
- **[MINOR]** linha 3/24: comentário diz "verde floresta + terroso", mas a rampa
  `--brand-900..100` é inteiramente azul e `--leaf-glow` é azul claro. O accent da UI é
  azul. Comentário mente sobre a paleta — corrija comentário ou paleta.
- **[MINOR]** linhas 35-43: `--earth-700/500/300/100`, `--clay`, `--sky` definidos e nunca
  usados em `app.css` (grep = 0 referências). Dead tokens. Remover ou usar.

### Over-engineering / arquitetura

- **[NIT]** `endpoints.ts`: `if (IS_MOCK){...} return notLive()` em 17 funções é verboso,
  mas é a feature fixtures-first deliberada. Mantém-se.
- **[NIT]** `vite.config.ts:13-17`: alias `@ -> ./src` configurado, mas nenhum import usa
  `@/` (todos relativos). Config sem uso. Inofensivo.

### Acessibilidade / semântica

#### `src/admin/AdminShell.tsx`
- **[MINOR]** linhas 31-41: ações (Alternar tema, Voltar, Sair) são `<a onClick>` sem
  `href` — não focáveis por teclado, sem semântica de link. Deveriam ser `<button>`.

#### `src/screens/Onboarding.tsx`
- **[NIT]** linha 47: `role="tablist"` nos dots `<span>`, mas sem `role="tab"`/
  `aria-selected` e não interativos. ARIA incompleto — remover o role.

### Texto / conteúdo

#### `src/screens/Login.tsx`
- **[MINOR]** linha 42: título "Bem-vinda de volta" (feminino fixo, persona Marina) com
  cadastro aberto e "Entrar como visitante" pode soar estranho.
- **[NIT]** linha 45-46: campos pré-preenchidos (`marina@exemplo.example`/`demo1234`) via
  `defaultValue`. Bom para demo; limpar se for versão "de entrega".

#### `src/screens/History.tsx`
- **[NIT]** linha 49: disposal `EXPIRED` (d-004) exibe "20 pts" ao lado de "Expirado" —
  levemente contraditório. Ocultar valor quando EXPIRED/CANCELLED.

### Fronteiras de pasta
- Sem violação. Projeto single-dev frontend, tudo em `src/`. N/A.

### Itens verificados sem achado (trust-but-verify)
- `levelFor`/`levelProgress`/`pointsToNextLevel` (`catalog.ts:25-40`) — corretos, tratam
  nível máx. OK.
- `haversine` (`catalog.ts:49`) — fórmula correta. OK.
- `useCountdown` (`QrCode.tsx:8`) — cleanup de interval + guard. OK.
- `redeemReward` (`endpoints.ts:144`) — valida existência/estoque/saldo antes de debitar. OK.
- Fixtures de pontos (d-002 PILHA qty6=30, d-001 CELULAR qty1=30, etc.) batem com
  `pointsPerUnit`. Ranking Marina 180 == user.monthlyPoints 180. Coerente. OK.
- `dist/` não versionado; `crypto.randomUUID` (`endpoints.ts:96`) OK em file://.

---

## Next steps
- **frontend-dev** (antes de apresentar): resolver os 2 MAJORS — alinhar raio de busca
  (`Login.tsx:36` vs `MapHome.tsx:51` vs `endpoints.ts:39`) e decidir fonte/rótulo de
  "Descartes recentes" (`AdminDashboard.tsx:11`).
- **frontend-dev** (opcional): `Recenter` → `useEffect`+guard; corrigir comentário/paleta
  `tokens.css`; extrair `initials`/`fmtDate`; `<a onClick>` → `<button>` em `AdminShell`.

## Blockers / questions
- Nenhum bloqueador. Dúvida p/ Manager/Kauan: o raio "certo" é 5, 8 ou 20 km? É decisão de
  produto, não bug de lógica — por isso é MAJOR de coerência. Os três "funcionam"; só
  precisam concordar entre si.
