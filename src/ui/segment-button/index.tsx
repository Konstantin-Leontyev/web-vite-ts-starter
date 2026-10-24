/**
 * Файл: `src/ui/segment-button/index.tsx`
 * Предоставляет компонент SegmentButton для отображения сегментного ряда действий.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - форму оболочки через проп `shape`
 *  - тон рамки через проп `borderTone`
 *  - левый сегмент через проп `left`
 *  - средний сегмент через проп `center`. Без `center` ряд из двух сегментов
 *  - правый сегмент через проп `right`
 *  - подпись над рядом через проп `label`
 *
 * Основные задачи:
 * 1. Экспортировать компонент SegmentButton
 * 2. Типизировать пропсы через `SegmentButtonProps`
 * 3. Экспортировать тип `SegmentButtonSegments`
 * 4. Выставлять `role="group"` и `aria-labelledby` при передаче `label`
 *
 * Потребители:
 *  - компоненты приложения, например ProfileMenu — переключают режимы и действия
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { useId, type ComponentPropsWithRef } from 'react';

import { FieldLabel } from '@ui/field-label';
import { getTextSize } from '@ui/presets';
import {
  SEGMENT_BUTTON_PARTS_FLUSH_SHAPE,
  SegmentButtonParts,
  type SegmentButtonPartsProps,
} from '@ui/segment-button-parts';

import {
  StyledSegmentButton,
  StyledSegmentButtonRoot,
  splitLayoutProps,
  type SegmentButtonStyleProps,
} from './segment-button.styles';

/**
 * DistributivePick — представляет выбор полей из каждой ветки объединения.
 */
type DistributivePick<T, K extends keyof T> = T extends unknown ? Pick<T, K> : never;

/**
 * SegmentButtonSegments — представляет ветки сегментов SegmentButton.
 * Поля взяты через `DistributivePick` из `SegmentButtonPartsProps`: ветки не схлопнуты.
 * Форма, размер и размер текста частей передаются отдельными аргументами `SegmentButtonParts`.
 * Вызов с одним левым сегментом не собирается.
 *
 * @property center — средний сегмент
 * @property left — левый сегмент
 * @property right — правый сегмент
 */
type SegmentButtonSegments = DistributivePick<
  SegmentButtonPartsProps,
  'center' | 'left' | 'right'
>;

/**
 * SegmentButtonProps — представляет пропсы компонента SegmentButton.
 *
 * @property label — подпись над рядом сегментов
 */
type SegmentButtonProps = {
  label?: string;
} & Omit<SegmentButtonStyleProps, 'left' | 'right'> &
  SegmentButtonSegments &
  Omit<
    ComponentPropsWithRef<'div'>,
    'center' | 'className' | 'left' | 'right' | 'style' | keyof SegmentButtonStyleProps
  >;

/**
 * SegmentButton — отображает сегментный ряд действий в общей оболочке.
 *
 * @example
 * <SegmentButton
 *   left={{ label: 'Day', onClick: showDay }}
 *   right={{ label: 'Week', onClick: showWeek }}
 * />
 * <SegmentButton
 *   left={{ label: 'A', active: true }}
 *   center={{ label: 'B' }}
 *   right={{ label: 'C' }}
 *   size="normal"
 * />
 */
function SegmentButton({
  borderTone,
  center,
  label,
  left,
  ref,
  right,
  shape,
  size,
  ...rest
}: SegmentButtonProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const labelId = useId();
  const labelledBy = label ? labelId : undefined;

  const segments = { center, left, right } as SegmentButtonSegments;

  return (
    <StyledSegmentButtonRoot
      aria-labelledby={labelledBy}
      ref={ref}
      role={labelledBy ? 'group' : undefined}
      {...layoutProps}
      {...restProps}
    >
      <FieldLabel id={labelId}>{label}</FieldLabel>
      <StyledSegmentButton borderTone={borderTone} shape={shape} size={size}>
        <SegmentButtonParts
          // Прямые углы: скругление даёт обрезка оболочки SegmentButton, не сегменты.
          shape={SEGMENT_BUTTON_PARTS_FLUSH_SHAPE}
          size={size}
          textSize={getTextSize(size)}
          {...segments}
        />
      </StyledSegmentButton>
    </StyledSegmentButtonRoot>
  );
}

export { SegmentButton, type SegmentButtonSegments };
