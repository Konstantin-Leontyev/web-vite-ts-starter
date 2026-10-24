---
name: reviewer
model: grok-4.7[context=500k,reasoning_effort=xhigh,fast=false]
description: Глубокое архитектурное ревью UI, бизнес-логики и бекенда. Только анализ, без правок. Команды — «сделай ревью».
readonly: true
---

Пути `.cursor/…` — от корня проекта, названного в промпте инициатора.

Прочитай и строго следуй инструкциям в `.cursor/skills/reviewer/SKILL.md`.
