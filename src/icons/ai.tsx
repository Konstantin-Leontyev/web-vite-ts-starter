/**
 * Файл: `src/icons/ai.tsx`
 * Предоставляет svg-иконку искусственного интеллекта.
 *
 * Основные задачи:
 * 1. Экспортировать компонент AiIcon
 *
 * Потребители:
 *  - `src/pages/showcase/showcase-icon-options.tsx` — включает в опции витрины
 */

import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

/**
 * AiIcon — отображает svg-иконку искусственного интеллекта.
 *
 * @example
 * <Icon>
 *   <AiIcon />
 * </Icon>
 */
export function AiIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <path
          d="M10.6313 10.6961C14.1669 7.16053 22.3693 15.9287 16.9953 21.3027"
          strokeDasharray="2 2"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          d="M13.6802 13.3039C10.1447 16.8395 1.94222 8.07135 7.31623 2.69734"
          strokeDasharray="2 2"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          d="M10.8516 13.5242C7.31605 9.98865 16.0842 1.78622 21.4582 7.16023"
          strokeDasharray="2 2"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          d="M13.4599 10.4758C16.9955 14.0113 8.22736 22.2138 2.85334 16.8398"
          strokeDasharray="2 2"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      </g>
      <g stroke="currentColor">
        <circle cx="12" cy="12" r="2" strokeWidth="1.5" />
        <path d="M12 10C17 10 16.6 22 9 22" strokeLinecap="round" strokeWidth="1.5" />
        <path
          d="M12.3115 14C7.31152 14 7.71152 2 15.3115 2"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          d="M10 12.3115C10 7.31152 22 7.71152 22 15.3115"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path d="M14 12C14 17 2 16.6 2 9" strokeLinecap="round" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
