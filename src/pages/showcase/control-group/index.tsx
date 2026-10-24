/**
 * Файл: `src/pages/showcase/control-group/index.tsx`
 * Предоставляет компонент ControlGroup для настройки подписи, размера
 * и формы контрола в витрине дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - подпись контрола через проп `label`. Без пары с `onLabelChange`
 *    строка подписи не рисуется
 *  - префикс подписей через проп `labelPrefix`. Без пропа подписи
 *    `Label:` / `Size:` / `Shape:`
 *  - обработчик изменения подписи через проп `onLabelChange`. Без пары
 *    с `label` строка подписи не рисуется
 *  - обработчик изменения формы через проп `onShapeChange`
 *  - обработчик изменения размера через проп `onSizeChange`
 *  - форму контрола через проп `shape`
 *  - размер контрола через проп `size`
 *
 * Основные задачи:
 * 1. Экспортировать компонент ControlGroup
 * 2. Типизировать пропсы через `ControlGroupProps`
 * 3. Рендерить единый блок настроек контрола в порядке: подпись через TextGroup,
 *    затем размер и форму. Без `labelPrefix` подписи `Label:` / `Size:` / `Shape:`.
 *    С `labelPrefix` тот же префикс у подписи и у `resolveGroupFieldLabel`.
 *    Строка подписи есть, только если переданы `label` и `onLabelChange`.
 *    Порядок `Size:` → `Shape:` → `Label:` запрещён
 *
 * Потребители:
 *  - панели настроек витрины — настраивают подпись, размер и форму контрола:
 *     - `src/pages/showcase/input-settings/index.tsx`
 *     - `src/pages/showcase/listbox-settings/index.tsx`
 *     - `src/pages/showcase/range-input-settings/index.tsx`
 *     - `src/pages/showcase/button-settings/index.tsx`
 *     - `src/pages/showcase/date-range-input-settings/index.tsx`
 *     - `src/pages/showcase/segment-button-settings/index.tsx`
 *     - `src/pages/showcase/stepper-settings/index.tsx`
 *     - `src/pages/showcase/locale-picker-settings/index.tsx`
 *  - `src/pages/showcase/search-field-group/index.tsx` — собирает размер и форму
 *    через необязательный `labelPrefix`. Строка подписи — только при паре `label`
 *    и `onLabelChange`
 */

import {
  SHAPE_PRESET_KEYS,
  SIZE_PRESET_KEYS,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';

import { ShapeListbox } from '../shape-listbox';
import { resolveGroupFieldLabel } from '../showcase-labels';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';

/**
 * ControlGroupProps — представляет пропсы компонента ControlGroup.
 *
 * @property label — текущая подпись контрола. Без пары с `onLabelChange`
 *   строка подписи не рисуется
 * @property labelPrefix — префикс подписей, например `Search field`.
 *   Без пропа подписи `Label:` / `Size:` / `Shape:`
 * @property onLabelChange — обработчик изменения подписи. Без пары с `label`
 *   строка подписи не рисуется
 * @property onShapeChange — обработчик изменения формы
 * @property onSizeChange — обработчик изменения размера
 * @property shape — текущая форма контрола
 * @property size — текущий размер контрола
 */
type ControlGroupProps = {
  labelPrefix?: string;
  onShapeChange: (shape: ShapePreset) => void;
  onSizeChange: (size: SizePreset) => void;
  shape: ShapePreset;
  size: SizePreset;
} & (
  | {
      label: string;
      onLabelChange: (label: string) => void;
    }
  | {
      label?: undefined;
      onLabelChange?: undefined;
    }
);

/**
 * ControlGroup — отображает блок настроек подписи, размера и формы контрола
 * в витрине дизайн-системы.
 *
 * @example
 * <ControlGroup
 *   label={state.label}
 *   shape={state.shape}
 *   size={state.size}
 *   onLabelChange={(label) => onChange('label', label)}
 *   onShapeChange={(shape) => onChange('shape', shape)}
 *   onSizeChange={(size) => onChange('size', size)}
 * />
 */
export function ControlGroup({
  label,
  labelPrefix,
  onLabelChange,
  onShapeChange,
  onSizeChange,
  shape,
  size,
}: ControlGroupProps) {
  return (
    <>
      {label !== undefined && onLabelChange !== undefined && (
        <TextGroup
          contents={[
            {
              value: label,
              onChange: onLabelChange,
            },
          ]}
          labelPrefix={labelPrefix === undefined ? 'Label' : labelPrefix}
        />
      )}

      <SizeListbox
        label={resolveGroupFieldLabel(labelPrefix, 'size')}
        sizes={SIZE_PRESET_KEYS}
        value={size}
        onChange={onSizeChange}
      />

      <ShapeListbox
        label={resolveGroupFieldLabel(labelPrefix, 'shape')}
        shapes={SHAPE_PRESET_KEYS}
        value={shape}
        onChange={onShapeChange}
      />
    </>
  );
}
