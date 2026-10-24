/**
 * Файл: `src/ui/native-field.ts`
 * Содержит общую коробку нативного поля.
 *
 * Основные задачи:
 * 1. Предоставить функцию `getNativeFieldStyles`
 *
 * Потребители:
 *  - `src/ui/input/input.styles.ts` — подставляет коробку в нативное поле Input
 *  - `src/ui/search-field/search-field.styles.ts` — подставляет коробку в нативное
 *    поле SearchField
 */

import {
  DEFAULT_SIZE_PRESET,
  getPaddingInline,
  getTextSize,
  type SizePreset,
} from '@ui/presets';
import { getTextProperties } from '@ui/text';

/**
 * getNativeFieldStyles — возвращает CSS-правила общей коробки нативного поля:
 * заполнение ряда, отступ по размеру, типографику, сброс рамки и фона, гашение
 * контура фокуса.
 * Правила `::-webkit-search-cancel-button` и `::-webkit-search-decoration`
 * на обычный Input не действуют, ошибок не порождают и вынесены, чтобы не
 * держать две копии.
 * Используется в `@ui/input` и `@ui/search-field`.
 *
 * @param size размер поля
 * @returns CSS-правила, каждое с новой строки
 */
export function getNativeFieldStyles(size: SizePreset = DEFAULT_SIZE_PRESET): string {
  return `
    inline-size: 100%;
    min-inline-size: 0;
    block-size: 100%;
    min-block-size: 0;
    padding-inline: ${getPaddingInline(size)};
    ${getTextProperties(getTextSize(size))}
    border: none;
    background-color: transparent;
    &:focus-visible { outline: none; }
    &::-webkit-search-cancel-button { appearance: none; }
    &::-webkit-search-decoration { appearance: none; }
  `;
}
