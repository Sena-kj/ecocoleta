---
status: done
agent: security-reviewer
feature: ecocoleta-proto
date: 2026-06-11
verdict: approved
reviewed-commit: d50bbc8
---

# Security Review — EcoColeta (protótipo acadêmico)

## Summary

**APPROVED — 0 crítica, 0 alta, 0 média, 2 baixa (hardening, não bloqueiam).**

Artefato é SPA Vite+React 100% mockada (fixtures locais, zero backend, zero API/secret real),
entregue como `dist/index.html` single-file estático ao professor. Calibrei a severidade ao
contexto: não há servidor, sessão, persistência remota nem superfície de rede — a maior parte do
OWASP Top 10 (injection server-side, broken auth real, IDOR, deserialization, misconfig de infra)
é inaplicável por construção.

Resultado dos checks pedidos:
1. **`npm audit`** → `found 0 vulnerabilities` (high/critical: nenhum).
2. **PII nas fixtures** → sintética e marcada como tal. Nenhum dado de pessoa real.
3. **Secrets/tokens/API keys reais** → nenhum. Único par de credenciais é o trava de protótipo já conhecido.
4. **XSS** → nenhum sink perigoso (`dangerouslySetInnerHTML`, `innerHTML`, `eval`, `document.write` = 0 ocorrências). React faz escape por padrão.
5. **PII/paths pessoais do Kauan no `dist/index.html`** → nenhum (`kauan`, `C:\Users`, `OneDrive`, `magestra`, `Sena-kj`, `spinlaw` = 0 ocorrências no bundle). Sem sourcemap embutido.

## Result

### Itens explicitamente verificados e LIMPOS

- **`npm audit`**: `found 0 vulnerabilities`. Stack toda atual (React 19, Vite 7, react-router 7, zod 3.24, leaflet 1.9). Nenhum advisory aplicável a um artefato estático.
- **Fixtures (`src/api/fixtures.ts`)**: nomes (Marina Castilho, Rafael Tominaga, etc.), emails (`marina@exemplo.example` — domínio reservado RFC 2606), telefones (`(41) 3350-00xx` / celulares fictícios) e endereços são sintéticos. QR codes são UUIDs literais de mock. Comentário na linha 12 declara o mandate de sanitização. **Sem PII real.**
- **Secrets**: grep por `sk-`, `ghp_`, `AKIA`, `xox[bp]`, `BEGIN PRIVATE KEY`, `Authorization`, `bearer` em `src/` → só falsos-positivos (campo `type="password"`, label "Senha"). Nenhuma chave/token real. Nenhum `.env` versionado no projeto.
- **XSS / DOM**: 0 ocorrências de `dangerouslySetInnerHTML`/`innerHTML`/`insertAdjacentHTML`/`document.write`/`eval`/`new Function`. Todo conteúdo dinâmico passa por JSX (escape automático). Sem renderização de HTML de fixture.
- **Open redirect / href**: única navegação externa é `src/screens/PointDetail.tsx:68` → `window.open(mapsUrl, '_blank')`, onde `mapsUrl` (linha 19) é montada **só com `point.location.lat`/`lng` numéricos de fixture** — sem input de usuário, sem possibilidade de injeção de URL. Não é open redirect.
- **Camada de API (`src/api/endpoints.ts`)**: puramente in-memory. Ramo `live` é stub que lança erro (`notLive()`). Nenhuma chamada de rede real no modo mock (o único caso de envio). Mutações de mock (`createDisposal`, `redeemReward`) operam sobre arrays locais — sem injeção possível.
- **`dist/index.html` (bundle de ~600KB que vai ao professor)**: sem `sourceMappingURL`, sem path de filesystem pessoal, sem PII, sem secret. Os 79 matches de `.map` são `Array.prototype.map`/`Map` de runtime, não sourcemaps.

### [BAIXA] Auth admin client-side com credencial embutida — ACEITO (trava intencional documentada)

- Arquivo: `src/admin/adminAuth.ts:6-7` (`admin` / `ecocoleta2025`), persistido em `sessionStorage`.
- A string `ecocoleta2025` está presente em `dist/index.html` (qualquer um que abrir o bundle lê a credencial e acessa o painel admin mock).
- **Por que não bloqueia**: o Kauan declarou explicitamente que este é o trava de protótipo intencional e já documentado; o comentário no próprio arquivo (linhas 1-2) marca a dívida ("trocar por verificação de papel ADMIN no servidor"). Não há dado sensível atrás do gate — só métricas mockadas. Registro como BAIXA apenas para rastreabilidade, não como pendência.
- **Quando virar produto real**: mover autorização para o servidor; nunca embarcar credencial no bundle.

### [BAIXA] Senha demo embutida no campo de login

- Arquivo: `src/screens/Login.tsx:46` → `defaultValue="demo1234"`.
- Pré-preenche o campo senha no fluxo de login do usuário (que é puramente decorativo no mock — não autentica nada real). Conveniência de demo, sem valor de segurança. Remover antes de qualquer backend real.

## Next steps

- Nenhum fix bloqueante. Pode seguir para QA / entrega.
- Para o eventual port a backend real (fora de escopo desta feature): mover auth admin para o servidor e remover `defaultValue="demo1234"`. Não há agente a despachar agora.

## Blockers / questions

Nenhum. Os 2 itens BAIXA dependem só da decisão já tomada (protótipo). Não há comportamento inerentemente arriscado pendente de decisão de produto.
