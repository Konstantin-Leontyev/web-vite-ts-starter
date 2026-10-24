/**
 * Файл: `src/components/router/index.tsx`
 * Объединяет конфигурацию маршрутов и контекст outlet в единую точку входа.
 *
 * Основные задачи:
 * 1. Реэкспортировать конфигурацию `router`
 * 2. Реэкспортировать хук `useShellOutletContext` и `SHOWCASE_SIDEBAR_ID`
 *
 * Потребители:
 *  - `src/main.tsx` — подключает `router` через `RouterProvider`
 *  - `src/pages/showcase/index.tsx` — читает контекст outlet и id панели витрины
 */

import { router } from './router';
import { SHOWCASE_SIDEBAR_ID, useShellOutletContext } from './use-shell-outlet-context';

/* eslint-disable react-refresh/only-export-components -- константа id панели в верхнем регистре: правило принимает её за компонент и ругает router и хук */
export { SHOWCASE_SIDEBAR_ID, router, useShellOutletContext };
