/**
 * Файл: `src/pages/showcase/shape-listbox/index.tsx`
 * Предоставляет компонент ShapeListbox для выбора формы в витрине дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - подпись через проп `label`
 *  - обработчик изменения выбранной формы через проп `onChange`
 *  - перечень форм через проп `shapes`
 *  - выбранную форму через проп `value`
 *  - недоступность списка через проп `disabled`. Без пропа список доступен
 *
 * Основные задачи:
 * 1. Экспортировать компонент ShapeListbox
 * 2. Типизировать пропсы через `ShapeListboxProps`
 *
 * Потребители:
 *  - `src/pages/showcase/icon-group/index.tsx` — выбирает форму окна иконки
 *    и не передаёт `disabled`
 *  - панели настроек витрины — выбирают форму и не передают `disabled`:
 *     - `src/pages/showcase/control-group/index.tsx`
 *     - `src/pages/showcase/date-range-input-settings/index.tsx`
 *     - `src/pages/showcase/icon-settings/index.tsx`
 *     - `src/pages/showcase/range-input-settings/index.tsx`
 *     - `src/pages/showcase/search-field-group/index.tsx`
 *     - `src/pages/showcase/tag-settings/index.tsx`
 *  - `src/pages/showcase/toolbar-settings/index.tsx` — выбирает форму панели
 *    и передаёт `disabled`, когда поиск включён
 */

import { Listbox } from '@ui/listbox';
import { DEFAULT_SHAPE_PRESET, type ShapePreset } from '@ui/presets';

import { getListboxOptions } from '../showcase-listbox-options';

/**
 * DEFAULT_SHAPE_LISTBOX_VALUE — задаёт форму по умолчанию.
 * Используется, когда вызывающий код не передал проп `value`.
 */
const DEFAULT_SHAPE_LISTBOX_VALUE = DEFAULT_SHAPE_PRESET;

/**
 * ShapeListboxProps — представляет пропсы компонента ShapeListbox.
 *
 * @property disabled — включает недоступность списка. Без пропа список доступен
 * @property label — текст подписи над листбоксом
 * @property onChange — обработчик изменения выбранной формы
 * @property shapes — перечень допустимых форм из настраиваемого компонента,
 *   например `SHAPE_PRESET_KEYS`
 * @property value — текущая выбранная форма
 */
type ShapeListboxProps<Shape extends string> = {
  disabled?: boolean;
  label: string;
  onChange: (shape: Shape) => void;
  shapes: readonly Shape[];
  value?: Shape;
};

/**
 * ShapeListbox — отображает листбокс выбора формы в витрине дизайн-системы.
 *
 * @example
 * <ShapeListbox
 *   label="Shape:"
 *   shapes={SHAPE_PRESET_KEYS}
 *   value={shape}
 *   onChange={setShape}
 * />
 */
export function ShapeListbox<Shape extends string = ShapePreset>({
  disabled,
  label,
  onChange,
  shapes,
  value = DEFAULT_SHAPE_LISTBOX_VALUE as Shape,
}: ShapeListboxProps<Shape>) {
  return (
    <Listbox
      disabled={disabled}
      label={label}
      options={getListboxOptions(shapes)}
      value={value}
      onChange={(nextShape) => onChange(nextShape as Shape)}
    />
  );
}
