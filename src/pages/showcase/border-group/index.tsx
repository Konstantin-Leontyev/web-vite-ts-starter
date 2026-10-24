/**
 * Файл: `src/pages/showcase/border-group/index.tsx`
 * Предоставляет компонент BorderGroup для отображения группы настроек рамки
 * и тени в витрине дизайн-системы. Используется только в витрине: в продуктовый
 * код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - тон рамки через проп `borderTone`
 *  - префикс подписей через проп `labelPrefix`. Без пропа подписи
 *    `Show border`, `Show shadow` и `Border tone:`
 *  - показ рамки через проп `showBorder`. Без пары обработчиков показа
 *    группа рисует только тон
 *  - показ тени через проп `showShadow`. Без пары обработчиков показа
 *    группа рисует только тон
 *  - обработчик изменения тона рамки через проп `onBorderToneChange`
 *  - обработчик показа рамки через проп `onShowBorderChange`. Без пары
 *    с `onShowShadowChange` группа рисует только тон
 *  - обработчик показа тени через проп `onShowShadowChange`. Без пары
 *    с `onShowBorderChange` группа рисует только тон
 *
 * Основные задачи:
 * 1. Экспортировать компонент BorderGroup
 * 2. Типизировать пропсы через `BorderGroupProps`
 * 3. Рендерить блок рамки. Без обработчиков показа — один `Border tone:`.
 *    С обработчиками — показ рамки, при включённой рамке показ тени и тон
 *
 * Потребители:
 *  - панели настроек витрины — настраивают рамку компонента:
 *     - `src/pages/showcase/card-settings/index.tsx`
 *     - `src/pages/showcase/icon-settings/index.tsx`
 *     - `src/pages/showcase/input-settings/index.tsx`
 *     - `src/pages/showcase/listbox-settings/index.tsx`
 *     - `src/pages/showcase/locale-picker-settings/index.tsx`
 *     - `src/pages/showcase/modal-settings/index.tsx`
 *     - `src/pages/showcase/search-field-group/index.tsx`
 *     - `src/pages/showcase/tag-settings/index.tsx`
 *     - `src/pages/showcase/toolbar-settings/index.tsx`
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { resolveGroupFieldLabel, resolveGroupFlagLabel } from '../showcase-labels';
import { ToneListbox } from '../tone-listbox';

/**
 * BorderGroupProps — представляет пропсы компонента BorderGroup.
 *
 * @property borderTone — текущий тон рамки
 * @property labelPrefix — префикс подписей, например `Search field`.
 *   Без пропа подписи `Show border`, `Show shadow` и `Border tone:`
 * @property onBorderToneChange — обработчик изменения тона рамки
 * @property onShowBorderChange — обработчик показа рамки. Без пары с
 *   `onShowShadowChange` группа рисует только `Border tone:`
 * @property onShowShadowChange — обработчик показа тени. Без пары с
 *   `onShowBorderChange` группа рисует только `Border tone:`
 * @property showBorder — включает рамку. Только вместе с обработчиками показа
 * @property showShadow — включает тень при включённой рамке. Только вместе
 *   с обработчиками показа
 */
type BorderGroupProps = {
  borderTone: TonePreset;
  labelPrefix?: string;
  onBorderToneChange: (tone: TonePreset) => void;
} & (
  | {
      onShowBorderChange: (show: boolean) => void;
      onShowShadowChange: (show: boolean) => void;
      showBorder: boolean;
      showShadow: boolean;
    }
  | {
      onShowBorderChange?: undefined;
      onShowShadowChange?: undefined;
      showBorder?: undefined;
      showShadow?: undefined;
    }
);

/**
 * BorderGroup — отображает группу настроек рамки и тени в витрине дизайн-системы.
 *
 * @example
 * <BorderGroup
 *   borderTone={state.borderTone}
 *   showBorder={state.showBorder}
 *   showShadow={state.showShadow}
 *   onBorderToneChange={(tone) => onChange('borderTone', tone)}
 *   onShowBorderChange={(show) => onChange('showBorder', show)}
 *   onShowShadowChange={(show) => onChange('showShadow', show)}
 * />
 */
export function BorderGroup({
  borderTone,
  labelPrefix,
  onBorderToneChange,
  onShowBorderChange,
  onShowShadowChange,
  showBorder,
  showShadow,
}: BorderGroupProps) {
  const borderLabelPrefix =
    labelPrefix === undefined ? undefined : `${labelPrefix} border`;
  const toneLabel = resolveGroupFieldLabel(
    labelPrefix === undefined ? 'Border' : borderLabelPrefix,
    'tone'
  );
  const toneListbox = (
    <ToneListbox
      label={toneLabel}
      tones={TONE_PRESET_KEYS}
      value={borderTone}
      onChange={onBorderToneChange}
    />
  );

  if (onShowBorderChange === undefined || onShowShadowChange === undefined) {
    return toneListbox;
  }

  return (
    <>
      <Checkbox
        checked={showBorder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onShowBorderChange(event.target.checked)
        }
      >
        {resolveGroupFlagLabel(borderLabelPrefix, 'Border', 'Show')}
      </Checkbox>

      {showBorder && (
        <>
          <Checkbox
            checked={showShadow}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onShowShadowChange(event.target.checked)
            }
          >
            {resolveGroupFlagLabel(
              labelPrefix === undefined ? undefined : `${labelPrefix} shadow`,
              'Shadow',
              'Show'
            )}
          </Checkbox>

          {toneListbox}
        </>
      )}
    </>
  );
}
