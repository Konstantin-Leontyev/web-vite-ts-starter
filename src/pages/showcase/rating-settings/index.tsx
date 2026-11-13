/**
 * Файл: `src/pages/showcase/rating-settings/index.tsx`
 * Определяет панель настроек компонента Rating в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, рамки, заливки, заголовка,
 * описания, порога и адресов в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `RatingWidgetState`
 * 2. Экспортировать компонент `RatingSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета Rating
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { ICON_SIZE_PRESET_KEYS, type IconSizePreset } from '@ui/icon';
import { Input } from '@ui/input';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { SHAPE_PRESET_KEYS, type ShapePreset } from '@ui/presets';
import {
  DEFAULT_RATING_DESCRIPTION,
  DEFAULT_RATING_TITLE,
  RATING_VALUES,
  type RatingValue,
} from '@ui/rating';
import { type SurfaceBackgroundPreset } from '@ui/surface';
import { type TonePreset } from '@ui/tones';

import { BackgroundListbox } from '../background-listbox';
import { BorderGroup } from '../border-group';
import { ShapeListbox } from '../shape-listbox';
import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';

/**
 * RATING_THRESHOLD_OPTIONS — формирует опции порога из `RATING_VALUES`.
 * Используется в контроле `Threshold:` панели настроек Rating.
 */
const RATING_THRESHOLD_OPTIONS: readonly ListboxOption[] = RATING_VALUES.map(
  (value) => ({
    label: String(value),
    value: String(value),
  })
);

/**
 * RatingWidgetState — представляет состояние настроек компонента Rating в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Rating.
 * Используется для синхронизации значений между панелью управления и демонстрационным Rating.
 *
 * @property background — заливка поверхности
 * @property borderTone — тон рамки
 * @property description — описание звёзд для экранного чтеца
 * @property highRatingHref — адрес для оценки выше порога
 * @property lowRatingHref — адрес для оценки не выше порога
 * @property shape — форма поверхности
 * @property showBorder — включает рамку
 * @property showShadow — включает тень
 * @property size — размер звезды
 * @property threshold — порог оценки
 * @property title — заголовок
 * @property titleInline — включает заголовок в одну строку со звёздами
 */
export type RatingWidgetState = {
  background: SurfaceBackgroundPreset;
  borderTone: TonePreset;
  description: string;
  highRatingHref: string;
  lowRatingHref: string;
  shape: ShapePreset;
  showBorder: boolean;
  showShadow: boolean;
  size: IconSizePreset;
  threshold: RatingValue;
  title: string;
  titleInline: boolean;
};

/**
 * RatingSettingsProps — представляет пропсы компонента RatingSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек Rating
 */
type RatingSettingsProps = {
  onChange: <K extends keyof RatingWidgetState>(
    key: K,
    value: RatingWidgetState[K]
  ) => void;
  state: RatingWidgetState;
};

/**
 * resolveRatingThreshold — возвращает порог по строке опции.
 *
 * @param value строка выбранной опции
 * @returns оценка или `undefined`, когда строки нет среди `RATING_VALUES`
 */
function resolveRatingThreshold(value: string): RatingValue | undefined {
  return RATING_VALUES.find((item) => String(item) === value);
}

/**
 * RatingSettings — отображает панель настроек Rating в витрине дизайн-системы.
 *
 * @example
 * <RatingSettings state={rating} onChange={updateRating} />
 */
export function RatingSettings({ onChange, state }: RatingSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SizeListbox
        label="Size:"
        sizes={ICON_SIZE_PRESET_KEYS}
        value={state.size}
        onChange={(size) => onChange('size', size)}
      />

      <ShapeListbox
        label="Shape:"
        shapes={SHAPE_PRESET_KEYS}
        value={state.shape}
        onChange={(shape) => onChange('shape', shape)}
      />

      <BorderGroup
        borderTone={state.borderTone}
        showBorder={state.showBorder}
        showShadow={state.showShadow}
        onBorderToneChange={(tone) => onChange('borderTone', tone)}
        onShowBorderChange={(show) => onChange('showBorder', show)}
        onShowShadowChange={(show) => onChange('showShadow', show)}
      />

      <BackgroundListbox
        label="Background:"
        value={state.background}
        onChange={(background) => onChange('background', background)}
      />

      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_RATING_TITLE,
            value: state.title,
            onChange: (value) => onChange('title', value),
          },
        ]}
        labelPrefix="Title"
      />

      {state.title.trim() !== '' && (
        <Checkbox
          checked={state.titleInline}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange('titleInline', event.target.checked)
          }
        >
          Show inline
        </Checkbox>
      )}

      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_RATING_DESCRIPTION,
            value: state.description,
            onChange: (value) => onChange('description', value),
          },
        ]}
        labelPrefix="Description"
      />

      <Listbox
        label="Threshold:"
        options={RATING_THRESHOLD_OPTIONS}
        value={String(state.threshold)}
        onChange={(value) => {
          if (typeof value !== 'string') {
            return;
          }

          const next = resolveRatingThreshold(value);

          if (next === undefined) {
            return;
          }

          onChange('threshold', next);
        }}
      />

      <Input
        label="Low address:"
        value={state.lowRatingHref}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('lowRatingHref', event.target.value)
        }
        onClear={() => onChange('lowRatingHref', '')}
      />

      <Input
        label="High address:"
        value={state.highRatingHref}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('highRatingHref', event.target.value)
        }
        onClear={() => onChange('highRatingHref', '')}
      />
    </StyledSettingsForm>
  );
}
