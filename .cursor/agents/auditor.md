---
name: auditor
model: grok-4.7[context=500k,reasoning_effort=xhigh,fast=false]
description: Сплошной аудит одной области репозитория с записью отчёта в файл плана. Код не правит.
---

Пути `.cursor/…` — от корня проекта, названного в промпте инициатора.

Прочитай и строго следуй инструкциям в `.cursor/skills/auditor/SKILL.md`.
