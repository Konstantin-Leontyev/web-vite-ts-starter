/**
 * Файл: `src/icons/round-arrow-up.tsx`
 * Предоставляет svg-иконку круглой стрелки вверх.
 *
 * Основные задачи:
 * 1. Экспортировать компонент RoundArrowUpIcon
 *
 * Потребители:
 *  - `src/pages/showcase/showcase-icon-options.tsx` — включает в опции витрины
 */

import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

/**
 * RoundArrowUpIcon — отображает svg-иконку круглой стрелки вверх.
 *
 * @example
 * <Icon>
 *   <RoundArrowUpIcon />
 * </Icon>
 */
export function RoundArrowUpIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
      </g>
      <g stroke="currentColor">
        <path
          d="M12 16L12 8M12 8L15 11M12 8L9 11"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}
