# Coach de Desenvolvimento Profissional — Especificação

> Referência completa do produto e da arquitetura. O `CLAUDE.md` da raiz importa este arquivo.

---

## 1. Visão

Sistema web pessoal (single user na v1) que **orquestra** as várias trilhas de desenvolvimento profissional do Edu e **agrega** conhecimento sobre o que ele produz. Roda no domínio próprio. É também o principal projeto de portfólio, com alvo em **vagas backend** — por isso a camada de backend (NestJS) é deliberadamente explícita e exibível.

## 2. As duas funções

- **Orquestrar:** ler as trilhas, dar 3–5 tarefas concretas por semana, acompanhar conclusão, diagnosticar falhas, reajustar a carga e replanejar. (O "puxar a orelha" e o autoajuste fazem parte desta função — ver §4.)
- **Agregar (tutor):** sobre o que o Edu reporta, aprofundar além do que ele já viu, trazer conhecimento novo, e ajudá-lo a transformar o que fez em conteúdo de visibilidade.

---

## 3. Modelo de domínio

### Norte
Elevar o nível técnico e a visibilidade do Edu até o mercado o enxergar, para concorrer a vagas backend melhores.

### Dois tipos de trilha (distinção central)
- **Trilha de projeto (tem fim):** sequência de tarefas que conclui. Ex.: terminar o projeto de portfólio, reformular o GitHub, construir este próprio app. Avança por dependência e foco — uma peça por vez até concluir.
- **Trilha de cadência (recorrente, sem fim):** o sistema garante ritmo mínimo toda semana. Ex.: alimentar o LinkedIn, avançar no curso do Deschamps.

Tratar os dois igual é erro. O modelo de dados marca o tipo de cada trilha e a lógica de geração os trata de forma diferente.

### Estado vivo (o cérebro)
Snapshot do estado de cada ativo: última aula vista, o que o projeto já faz e o que falta, status do GitHub, status do LinkedIn, orçamento de tempo, histórico de carga. **Toda geração lê o estado; toda revisão reescreve.** A "inteligência" mora na combinação prompt + estado persistido, não num modelo que lembra sozinho — sem persistir o histórico de carga, não há autoajuste.

### Regra de costura
A cadência se alimenta das trilhas de projeto **e do trabalho do Edu** (dev fullstack). O post da semana sai do que ele construiu, estudou ou aplicou — fonte inesgotável. Nenhuma semana passa sem material de visibilidade, mesmo com projeto longo numa fase silenciosa.

### Regra conceito-não-contexto (proteção)
Conteúdo derivado do trabalho usa o **conceito genérico**, nunca o **contexto interno** (código, arquitetura, dados de cliente, sistemas internos da empresa). "Como lidar com paginação em endpoint eventualmente consistente" sai; "como a empresa X sincroniza os pedidos dela" não. Embutida no prompt do orquestrador/tutor. Protege o Edu e gera post melhor.

---

## 4. Lógica de orquestração

**4 regras de ordenação:** (1) dependência primeiro — construir antes de mostrar; (2) terminar antes de começar; (3) a semana orbita uma peça de trabalho — pode tocar projeto + estudo + LinkedIn juntos, desde que girem no mesmo artefato; (4) caber no tempo — soma das estimativas ≤ ~6h (teto 7h30).

**3 prevenções:** orçamento de tempo fixo; estudo sempre colado a um output ("assista X **e** implemente Y"); tarefas atômicas e marcáveis.

**Diagnóstico-então-ação na falha (o autoajuste):** o sistema pergunta o motivo, mas julga pela régua estimado-vs-concluído. Carga cabia no orçamento e não foi feita → execução → mantém a carga, quebra em pedaços menores, cobra. Carga estourou, ou maioria concluída e faltou tempo → sobrecarga → reduz. O relato é input; a régua é o juiz (procrastinação tende a se disfarçar de "foi muita coisa").

**Comemoração:** completou tudo → comemora e sobe a carga ou avança no funil.

## 5. Tutor (agregar) — acoplado aos itens

Ação contextual em cada item:
- Aula concluída → **"Aprofundar"**: explica além do curso, traz conceitos relacionados, sabendo o que o Edu já estudou.
- Tarefa de visibilidade → **"Me ajuda a postar"**: sugere ângulo, formato e imagem, aplicando conceito-não-contexto, derivando do que foi feito na semana.

---

## 6. Arquitetura (travada — alvo backend)

- **Monorepo único** (Turborepo + pnpm): `apps/api` (NestJS) + `apps/web` (Next) + `packages/types`. Um repo conta a história inteira de back+front com separação de responsabilidades — sinal de maturidade para vaga backend.
- **Backend NestJS** com a auth feita à mão (JWT, guards, hashing, refresh token): para vaga backend, escrever a auth É o ativo, não algo a terceirizar.
- **Loop de IA no NestJS:** geração de tarefas e tutor vivem na camada de servidor, exibindo a orquestração no backend.

## 7. Modelo de dados (Postgres)

- `trilhas` — id, nome, tipo (`projeto` | `cadencia`), status, prioridade, descricao
- `semanas` — id, numero, data_inicio, horas_estimadas, percent_concluido, diagnostico, acao_carga
- `tarefas` — id, semana_id, trilha_id, descricao, estimativa_horas, etapa (`construir`|`mostrar`|`visibilidade`), status, motivo_nao_conclusao
- `estado_ativos` — snapshot JSON do estado atual (última aula Deschamps, estado do projeto, status GitHub/LinkedIn); reescrito a cada revisão; histórico preservado via `semanas`
- `usuarios` — id, email, senha_hash (auth própria)

## 8. O loop de IA (maior valor de engenharia)

**Geração da semana:** input = prompt do orquestrador + `estado_ativos` + `trilhas` + report da última semana → output = JSON estruturado `{ tarefas[3–5], estado_ativos_atualizado, diagnostico }` → valida o JSON na volta → persiste tarefas + nova semana, sobrescreve estado. Saída estruturada confiável é o ponto difícil; validar sempre.

**Tutor:** chamada separada, recebe o contexto do item + estado, responde "aprofundar" ou gera sugestão de post (com conceito-não-contexto).

## 9. Topologia de deploy

- `apps/web` (Next) → **Vercel**, em subdomínio do domínio próprio (ex. `coach.dominio.com`). Subdomínio novo num projeto novo não interfere no domínio principal já atrelado a outro projeto.
- `apps/api` (NestJS, servidor persistente) → **Railway ou Render** (a Vercel é serverless e não hospeda bem um Nest sempre-ligado), em subdomínio (ex. `api.coach.dominio.com`).
- **Banco** → **Neon** (Postgres serverless), ou Postgres do próprio Railway junto da api para simplificar networking. A Vercel não hospeda banco persistente.

## 10. Escopo do MVP (v1, single user)

Auth própria (só o Edu) · estado persistido · tela da semana com checkboxes ✅/❌ e campo "motivo" · ação "gerar próxima semana" (IA → JSON validado → persiste + reescreve estado) · tutor acoplado · deploy.

**Fora da v1:** multiusuário, billing/créditos, notificações, dashboard com gráficos, multi-provider de IA, integração automática com APIs de LinkedIn/GitHub.
