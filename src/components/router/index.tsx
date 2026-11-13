/**
 * Файл: `src/components/router/index.tsx`
 * Объединяет конфигурацию маршрутов и контекст outlet в единую точку входа.
 *
 * Основные задачи:
 * 1. Реэкспортировать конфигурацию `router`
 * 2. Реэкспортировать хук `useShellOutletContext`, `SHOWCASE_SIDEBAR_ID`
 *    и тип `HeaderProfileMenuText`
 *
 * Потребители:
 *  - `src/main.tsx` — подключает `router` через `RouterProvider`
 *  - `src/pages/showcase/index.tsx` — читает контекст outlet и id панели витрины
 *  - `src/pages/showcase/header-settings/index.tsx` — читает тип `HeaderProfileMenuText`
 */

import { router } from './router';
import {
  SHOWCASE_SIDEBAR_ID,
  useShellOutletContext,
  type HeaderProfileMenuText,
} from './use-shell-outlet-context';

/* eslint-disable react-refresh/only-export-components -- константа id панели в верхнем регистре: правило принимает её за компонент и ругает router и хук */
export {
  SHOWCASE_SIDEBAR_ID,
  router,
  useShellOutletContext,
  type HeaderProfileMenuText,
};
