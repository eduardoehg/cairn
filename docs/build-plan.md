# Build Plan — Coach

> Sequência de construção. Cada fatia sobe/roda antes de começar a próxima. Alvo backend → API primeiro.

## Fatia 0 — Esqueleto do monorepo
Turborepo + pnpm com `apps/api` (NestJS), `apps/web` (Next), `packages/types`. Lint, tsconfig base, scripts do turbo.
**Pronto quando:** `pnpm dev` sobe api e web localmente; `packages/types` é importável dos dois.

## Fatia 1 — API no ar com auth + semana seed (sem IA)
Foco backend, que é o alvo. Implementar:
- `usuarios` + auth própria no NestJS (registro/login, JWT, guard, hashing, refresh token).
- Endpoint `GET /semana-atual` protegido, retornando tarefas **seed** (hardcoded/fixture).
- Conexão com Postgres no Neon (migrations).
- Deploy da `api` no Railway/Render, respondendo no subdomínio.
**Pronto quando:** dá pra logar e bater em `/semana-atual` autenticado, em produção. Este é o primeiro marco real e já é peça de portfólio.

## Fatia 2 — Front consumindo a API
- `apps/web`: tela de login + tela da semana com checkboxes ✅/❌ e campo "motivo".
- Persistir status das tarefas via API.
- Deploy do `web` na Vercel, no subdomínio.
**Pronto quando:** o vertical inteiro funciona em produção (login → ver semana → marcar tarefa → persiste).

## Fatia 3 — O loop de IA (a peça de maior valor)
- Modelar `trilhas`, `semanas`, `tarefas`, `estado_ativos` de verdade (sai o seed).
- Ação `POST /gerar-semana`: monta prompt do orquestrador + estado + report → chama o modelo → **valida o JSON** → persiste tarefas + nova semana → reescreve `estado_ativos`.
- Implementar o diagnóstico-então-ação (régua estimado-vs-concluído) e o orçamento de tempo no prompt + lógica.
**Pronto quando:** ao fechar uma semana com um report, o sistema gera a próxima sozinho, dentro do orçamento, e ajusta a carga conforme o diagnóstico.

## Fatia 4 — Tutor acoplado
- Botões "Aprofundar" (na aula) e "Me ajuda a postar" (na tarefa de visibilidade).
- Endpoint de tutor que recebe contexto do item + estado e responde, com a regra conceito-não-contexto embutida.
**Pronto quando:** dá pra aprofundar um item e gerar uma sugestão de post a partir do que foi feito.

## Insumo do Edu (não é código — fazer antes da Fatia 3)
Listar as trilhas reais de hoje e o estado de cada uma (tipo `projeto`/`cadencia`, onde está, o que falta). Sem esse seed, a geração da Fatia 3 roda no vácuo.

## Lembrete
A documentação está pronta para começar; ela não precisa crescer mais. "Deixar a spec perfeita" é a forma mais convincente de adiar a Fatia 0.
