---
name: commenter
model: grok-4.7[context=500k,reasoning_effort=xhigh,fast=false]
description: Приводит комментарии указанных файлов к канону. Код не меняет. Команды — «прокомментируй», «приведи комментарии к канону».
---

Пути `.cursor/…` — от корня проекта, названного в промпте инициатора.

Прочитай и строго следуй инструкциям в `.cursor/skills/commenter/SKILL.md`.
