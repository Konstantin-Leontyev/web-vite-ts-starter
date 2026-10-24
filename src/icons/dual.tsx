/**
 * Файл: `src/icons/dual.tsx`
 * Предоставляет svg-иконку четырёх коротких строк.
 *
 * Основные задачи:
 * 1. Экспортировать компонент DualIcon
 *
 * Потребители:
 *  - `src/pages/showcase/showcase-icon-options.tsx` — включает в опции витрины
 */

import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

/**
 * DualIcon — отображает svg-иконку четырёх коротких строк.
 *
 * @example
 * <Icon>
 *   <DualIcon />
 * </Icon>
 */
export function DualIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <path d="M21 3H3" strokeLinecap="round" strokeWidth="1.5" />
        <path d="M21 15H3" strokeLinecap="round" strokeWidth="1.5" />
      </g>
      <g stroke="currentColor">
        <path d="M21 9H3" strokeLinecap="round" strokeWidth="1.5" />
        <path d="M21 21H3" strokeLinecap="round" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
