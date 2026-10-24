/**
 * Файл: `src/ui/open-control/open-control-chevron.tsx`
 * Предоставляет компонент OpenControlChevron для отображения шеврона ряда open-контрола.
 *
 * Поддерживает:
 *  - размерный ряд через проп `size`. Без пропа окно размера `normal`
 *  - форму окна через проп `shape`
 *  - тон секции через проп `iconTone`
 *  - тон глифа через проп `iconFill`
 *
 * Основные задачи:
 * 1. Экспортировать компонент OpenControlChevron
 * 2. Типизировать пропсы через `OpenControlChevronProps`
 *
 * Потребители:
 *  - `src/ui/listbox/index.tsx` — ставит шеврон в ряд триггера
 *  - `src/ui/range-input/index.tsx` — ставит шеврон в ряд триггера
 */

import { ChevronDownIcon } from '@icons';
import { Icon, type IconShapePreset } from '@ui/icon';
import { DEFAULT_SIZE_PRESET, type SizePreset } from '@ui/presets';
import { type TonePreset } from '@ui/tones';

/**
 * OpenControlChevronProps — представляет пропсы компонента OpenControlChevron.
 *
 * @property iconFill — тон глифа шеврона
 * @property iconTone — тон секции шеврона
 * @property shape — форма окна шеврона
 * @property size — размер окна шеврона
 */
type OpenControlChevronProps = {
  iconFill?: TonePreset;
  iconTone?: TonePreset;
  shape: IconShapePreset;
  size?: SizePreset;
};

/**
 * OpenControlChevron — отображает шеврон ряда open-контрола.
 *
 * @example
 * <OpenControlChevron iconFill={iconFill} iconTone={iconTone} shape={iconShape} size={size} />
 */
export function OpenControlChevron({
  iconFill,
  iconTone,
  shape,
  size = DEFAULT_SIZE_PRESET,
}: OpenControlChevronProps) {
  return (
    <Icon
      data-slot="icon"
      iconFill={iconFill}
      iconTone={iconTone}
      interactive
      shape={shape}
      showBorder
      showHover={false}
      showShadow={false}
      size={size}
    >
      <ChevronDownIcon />
    </Icon>
  );
}
