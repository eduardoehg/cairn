# Coach de Desenvolvimento Profissional

App pessoal (single user na v1) que **orquestra** as trilhas de desenvolvimento profissional do Edu e **agrega** conhecimento sobre o que ele produz. É também o principal projeto de portfólio, com alvo em **vagas backend** — então a camada de backend é a peça a ser exibida.

Referência completa: @docs/coach-spec.md
Sequência de build: @docs/build-plan.md

## Stack (travada)
- **Monorepo:** Turborepo + pnpm workspaces
- **Backend:** NestJS (`apps/api`) — controllers, services, DTOs, módulos; auth própria (JWT + guards)
- **Frontend:** Next.js (`apps/web`)
- **Tipos compartilhados:** `packages/types` (DTOs e contratos entre as camadas)
- **Banco:** PostgreSQL no Neon
- **IA:** o loop de geração de tarefas + tutor vive no NestJS (lógica de servidor)
- **Deploy:** `web` → Vercel (subdomínio); `api` → Railway ou Render; banco → Neon (ou Railway junto da api)

## Estrutura do repositório
```
coach/
  apps/
    api/    → NestJS (backend — a parte que o portfólio exibe)
    web/    → Next.js (frontend)
  packages/
    types/  → DTOs e tipos compartilhados
  docs/
    coach-spec.md
    build-plan.md
  CLAUDE.md
```

## Convenções
- TypeScript em tudo. Tipos de contrato entre back/front vivem em `packages/types`, nunca duplicados.
- NestJS idiomático: um módulo por domínio, lógica em services (não em controllers), validação via DTOs.
- Commits em **Conventional Commits** (`feat:`, `fix:`, `chore:`, `refactor:`...).
- Cada fatia do build-plan precisa subir/rodar antes de começar a próxima (terminar antes de começar).

## Regras de produto que o código DEVE honrar (invariantes de domínio)
- **Dois tipos de trilha:** `projeto` (tem fim) e `cadencia` (recorrente). O modelo de dados e a lógica de geração tratam os dois de forma diferente. Ver spec §3.
- **Conceito, não contexto:** ao derivar conteúdo do trabalho do Edu, o sistema usa o conceito técnico genérico, **nunca** dados de cliente, código ou sistemas internos da empresa. Esta regra entra no prompt do tutor/orquestrador. Ver spec §3.
- **Diagnóstico pela régua:** na falha de tarefas, o relato do usuário é input, mas o juiz é estimado-vs-concluído (carga cabia e não foi feita → mantém e cobra; estourou → reduz). Ver spec §4.
- **Orçamento de tempo:** soma das estimativas da semana ≤ ~6h (teto 7h30). A geração nunca passa disso.
- **Estado vivo:** toda geração lê o estado dos ativos; toda revisão reescreve. Sem persistir o histórico de carga, não há autoajuste.

## Como trabalhar neste repo
- Construa a **menor fatia vertical que sobe** antes de generalizar (ver build-plan).
- Fora de escopo da v1: multiusuário, billing, notificações, dashboard, multi-provider de IA, integração automática com APIs de LinkedIn/GitHub. Não construa sem pedido explícito.
- A parte de maior valor (e de maior risco) é o loop de IA com saída estruturada validada — concentre esforço aí; auth e CRUD são commodity.
