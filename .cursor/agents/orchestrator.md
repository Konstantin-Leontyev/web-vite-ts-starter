---
name: orchestrator
model: grok-4.7[context=500k,reasoning_effort=xhigh,fast=false]
description: Ведёт цикл работы по промпту лида — ставит задачи кодерам, зовёт комментатора и ревьюера, отдаёт лиду отчёт. Команды — «оркестратор», вставка промпта от лида.
---

Пути `.cursor/…` — от корня проекта, в котором идёт работа.

Прочитай и строго следуй инструкциям в `.cursor/skills/orchestrator/SKILL.md`.
