/**
 * Файл: `src/ui/open-control/open-control-clear.tsx`
 * Предоставляет компонент OpenControlClear для отображения слота сброса ряда open-контрола.
 *
 * Поддерживает:
 *  - размерный ряд через проп `size`. Без пропа окно размера `normal`
 *  - форму окна через проп `shape`
 *  - тон секции через проп `iconTone`
 *  - тон глифа через проп `iconFill`
 *  - недоступное состояние слота сброса через проп `disabled`
 *  - подпись для имени слота сброса через проп `label`
 *  - доступное имя слота сброса через проп `clearAriaLabel`. Без пропа имя —
 *    `resolveClearAriaLabel`
 *  - обработчик клика слота сброса через проп `onClick`
 *
 * Основные задачи:
 * 1. Экспортировать компонент OpenControlClear
 * 2. Типизировать пропсы через `OpenControlClearProps`
 *
 * Потребители:
 *  - `src/ui/listbox/index.tsx` — ставит слот сброса в ряд триггера
 *  - `src/ui/range-input/index.tsx` — ставит слот сброса в ряд триггера
 */

import { type MouseEvent } from 'react';

import { CloseIcon } from '@icons';
import { resolveClearAriaLabel } from '@ui/a11y';
import { Icon, type IconShapePreset } from '@ui/icon';
import { DEFAULT_SIZE_PRESET, type SizePreset } from '@ui/presets';
import { type TonePreset } from '@ui/tones';

/**
 * OpenControlClearProps — представляет пропсы компонента OpenControlClear.
 *
 * @property clearAriaLabel — доступное имя слота сброса
 * @property disabled — включает недоступное состояние
 * @property iconFill — тон глифа слота сброса
 * @property iconTone — тон секции слота сброса
 * @property label — подпись ряда для имени слота сброса
 * @property onClick — обработчик клика
 * @property shape — форма окна слота сброса
 * @property size — размер окна слота сброса
 */
type OpenControlClearProps = {
  clearAriaLabel?: string;
  disabled?: boolean;
  iconFill?: TonePreset;
  iconTone?: TonePreset;
  label?: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  shape: IconShapePreset;
  size?: SizePreset;
};

/**
 * OpenControlClear — отображает слот сброса ряда open-контрола.
 *
 * @example
 * <OpenControlClear
 *   clearAriaLabel={clearAriaLabel}
 *   disabled={disabled}
 *   iconFill={iconFill}
 *   iconTone={iconTone}
 *   label={label}
 *   shape={iconShape}
 *   size={size}
 *   onClick={handleClear}
 * />
 */
export function OpenControlClear({
  clearAriaLabel,
  disabled,
  iconFill,
  iconTone,
  label,
  onClick,
  shape,
  size = DEFAULT_SIZE_PRESET,
}: OpenControlClearProps) {
  return (
    <Icon
      aria-label={clearAriaLabel ?? resolveClearAriaLabel(label)}
      as="button"
      data-slot="clear"
      disabled={disabled}
      iconFill={iconFill}
      iconTone={iconTone}
      shape={shape}
      showBorder
      showShadow={false}
      size={size}
      onClick={onClick}
    >
      <CloseIcon />
    </Icon>
  );
}
