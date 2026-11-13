/**
 * Файл: `src/components/theme-toggle/index.tsx`
 * Предоставляет компонент ThemeToggle для отображения кнопки переключения светлой и тёмной темы.
 *
 * Поддерживает:
 *  - доступное имя кнопки при светлой теме через проп `darkAriaLabel`. Без пропа —
 *    `Switch to dark theme`. Пустая строка остаётся этой фразой
 *  - доступное имя кнопки при тёмной теме через проп `lightAriaLabel`. Без пропа —
 *    `Switch to light theme`. Пустая строка остаётся этой фразой
 *
 * Основные задачи:
 * 1. Экспортировать компонент ThemeToggle
 * 2. Типизировать пропсы через `ThemeToggleProps`
 * 3. Выставлять `aria-label` по текущей теме: `Switch to dark theme` или
 *    `Switch to light theme`
 * 4. Связать `Icon` с `useTheme`
 *
 * Потребители:
 *  - `src/components/header/index.tsx` — показывает кнопку переключения темы в блоке действий шапки
 */

import { useTheme } from '@hooks/use-theme';
import { ContrastIcon } from '@icons';
import { Icon } from '@ui/icon';

/**
 * DEFAULT_THEME_TOGGLE_DARK_ARIA_LABEL — задаёт доступное имя перехода на тёмную тему по умолчанию.
 * Используется, когда вызывающий код не передал проп `darkAriaLabel`.
 */
const DEFAULT_THEME_TOGGLE_DARK_ARIA_LABEL = 'Switch to dark theme';

/**
 * DEFAULT_THEME_TOGGLE_LIGHT_ARIA_LABEL — задаёт доступное имя перехода на светлую тему по умолчанию.
 * Используется, когда вызывающий код не передал проп `lightAriaLabel`.
 */
const DEFAULT_THEME_TOGGLE_LIGHT_ARIA_LABEL = 'Switch to light theme';

/**
 * ThemeToggleProps — представляет пропсы компонента ThemeToggle.
 *
 * @property darkAriaLabel — доступное имя кнопки при светлой теме. Без пропа —
 *   `Switch to dark theme`. Пустая строка остаётся этой фразой
 * @property lightAriaLabel — доступное имя кнопки при тёмной теме. Без пропа —
 *   `Switch to light theme`. Пустая строка остаётся этой фразой
 */
type ThemeToggleProps = {
  darkAriaLabel?: string;
  lightAriaLabel?: string;
};

/**
 * ThemeToggle — отображает кнопку переключения темы приложения.
 *
 * @example
 * <ThemeToggle />
 */
function ThemeToggle({ darkAriaLabel, lightAriaLabel }: ThemeToggleProps) {
  const { mode, onThemeChange } = useTheme();
  const darkName =
    darkAriaLabel !== undefined && darkAriaLabel.trim() !== ''
      ? darkAriaLabel
      : DEFAULT_THEME_TOGGLE_DARK_ARIA_LABEL;
  const lightName =
    lightAriaLabel !== undefined && lightAriaLabel.trim() !== ''
      ? lightAriaLabel
      : DEFAULT_THEME_TOGGLE_LIGHT_ARIA_LABEL;

  return (
    <Icon
      aria-label={mode === 'dark' ? lightName : darkName}
      as="button"
      shape="round"
      onClick={onThemeChange}
    >
      <ContrastIcon />
    </Icon>
  );
}

export { ThemeToggle, type ThemeToggleProps };
