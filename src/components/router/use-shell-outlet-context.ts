/**
 * Файл: `src/components/router/use-shell-outlet-context.ts`
 * Предоставляет тип и хук для чтения контекста outlet каркаса приложения.
 *
 * Основные задачи:
 * 1. Типизировать тексты меню профиля через `HeaderProfileMenuText` и контекст через `ShellOutletContext`
 * 2. Предоставить хук `useShellOutletContext`
 * 3. Задать id боковой панели витрины `SHOWCASE_SIDEBAR_ID`
 *
 * Потребители:
 *  - `src/components/router/index.tsx` — реэкспортирует `useShellOutletContext`, `SHOWCASE_SIDEBAR_ID` и `HeaderProfileMenuText`
 *  - `src/components/router/router-layout.tsx` — формирует контекст outlet и связывает шестерёнку с панелью
 *  - `src/pages/showcase/index.tsx` — переключает режим шапки, меняет тексты меню профиля и ставит id панели
 */

import { useOutletContext } from 'react-router-dom';

/**
 * SHOWCASE_SIDEBAR_ID — задаёт id боковой панели витрины.
 * Связывает кнопки настроек карточек и шестерёнку шапки с Sidebar через `aria-controls`.
 */
export const SHOWCASE_SIDEBAR_ID = 'showcase-sidebar';

/**
 * HeaderProfileMenuText — представляет видимые тексты меню профиля в шапке.
 * Ключи совпадают с пропами `ProfileMenu`. Пустая строка в шапку не передаётся:
 * меню берёт своё умолчание.
 */
export type HeaderProfileMenuText = {
  displayEmail: string;
  greeting: string;
  privacyLabel: string;
  profileLabel: string;
  signOutLabel: string;
  termsLabel: string;
};

/**
 * ShellOutletContext — представляет контекст outlet каркаса приложения.
 * Поля `autoHide`, `isHeaderSettingsOpen` и тексты меню профиля нужны витрине
 * дизайн-системы для настройки шапки в реальном времени.
 *
 * @property autoHide — включает автоскрытие шапки
 * @property isHeaderSettingsOpen — включает открытое состояние панели настроек шапки в витрине
 * @property profileMenuText — видимые тексты меню профиля
 * @property setAutoHide — меняет значение `autoHide`
 * @property setIsHeaderSettingsOpen — меняет значение `isHeaderSettingsOpen`
 * @property setProfileMenuText — меняет одно поле текстов меню профиля
 */
export type ShellOutletContext = {
  autoHide: boolean;
  isHeaderSettingsOpen: boolean;
  profileMenuText: HeaderProfileMenuText;
  setAutoHide: (value: boolean) => void;
  setIsHeaderSettingsOpen: (value: boolean) => void;
  setProfileMenuText: <Key extends keyof HeaderProfileMenuText>(
    key: Key,
    value: HeaderProfileMenuText[Key]
  ) => void;
};

/**
 * useShellOutletContext — возвращает контекст outlet каркаса приложения.
 *
 * @returns контекст с состоянием шапки и функциями его изменения
 */
export function useShellOutletContext(): ShellOutletContext {
  return useOutletContext<ShellOutletContext>();
}
