/**
 * Файл: `src/pages/showcase/date-range-input-settings/index.tsx`
 * Определяет панель настроек компонента DateRangeInput в витрине дизайн-системы.
 * Содержит контролы для изменения подписи, размера, формы, тона рамки,
 * показа сброса, формы подсветки дня, формы кнопок подвала, текстов `Set`,
 * `Reset` и `Close`, локали, подписей дней недели, границ дней и состояния `disabled`
 * в реальном времени. Сброс стартует выключенным.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `DateRangeInputWidgetState`
 * 2. Экспортировать компонент `DateRangeInputSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета DateRangeInput
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import {
  DEFAULT_CALENDAR_LOCALE,
  DEFAULT_DATE_RANGE_INPUT_COMMIT_LABEL,
  DEFAULT_DATE_RANGE_INPUT_DISMISS_LABEL,
  DEFAULT_DATE_RANGE_INPUT_RESET_LABEL,
  resolveCalendarLocale,
  resolveCalendarWeekdayLabels,
  type CalendarWeekdayLabels,
} from '@ui/date-range-input';
import { Input } from '@ui/input';
import { SHAPE_PRESET_KEYS, type ShapePreset, type SizePreset } from '@ui/presets';
import { type TonePreset } from '@ui/tones';

import { BorderGroup } from '../border-group';
import { ControlGroup } from '../control-group';
import { ShapeListbox } from '../shape-listbox';
import { StyledSettingsForm } from '../showcase.styles';
import { TextGroup } from '../text-group';

/**
 * WEEKDAY_LABEL_PREFIXES — задаёт префиксы подписей дней недели в панели.
 * Порядок — с понедельника по воскресенье.
 */
const WEEKDAY_LABEL_PREFIXES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

/**
 * DateRangeInputWidgetState — представляет состояние настроек компонента DateRangeInput в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента DateRangeInput, кроме витринных ключей: `withClear`
 * управляет передачей `onClear` в превью.
 * Используется для синхронизации значений между панелью управления и демонстрационным DateRangeInput.
 *
 * @property borderTone — тон рамки
 * @property buttonShape — форма кнопок подвала панели. Стартует с формы контрола
 * @property commitLabel — видимый текст кнопки подтверждения
 * @property dayShape — форма подсветки дня в панели. Стартует с формы контрола
 * @property disabled — включает недоступное состояние
 * @property dismissLabel — видимый текст кнопки закрытия панели
 * @property endDay — буфер конечного дня диапазона в превью. В панель не выносится
 * @property label — подпись над рядом сегментов
 * @property locale — локаль оформления даты
 * @property maxDay — верхняя граница допустимых дней в формате ISO
 * @property minDay — нижняя граница допустимых дней в формате ISO
 * @property resetLabel — видимый текст кнопки сброса черновика
 * @property shape — форма поверхности
 * @property size — размер компонента
 * @property startDay — буфер начального дня диапазона в превью. В панель не выносится
 * @property weekdayLabels — подписи дней недели с понедельника по воскресенье
 * @property withClear — витринный ключ показа сброса. Выключенный — превью без `onClear`
 */
export type DateRangeInputWidgetState = {
  borderTone: TonePreset;
  buttonShape: ShapePreset;
  commitLabel: string;
  dayShape: ShapePreset;
  disabled: boolean;
  dismissLabel: string;
  endDay: string;
  label: string;
  locale: string;
  maxDay: string;
  minDay: string;
  resetLabel: string;
  shape: ShapePreset;
  size: SizePreset;
  startDay: string;
  weekdayLabels: CalendarWeekdayLabels;
  withClear: boolean;
};

/**
 * DateRangeInputSettingsProps — представляет пропсы компонента DateRangeInputSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек DateRangeInput
 */
type DateRangeInputSettingsProps = {
  onChange: <K extends keyof DateRangeInputWidgetState>(
    key: K,
    value: DateRangeInputWidgetState[K]
  ) => void;
  state: DateRangeInputWidgetState;
};

/**
 * DateRangeInputSettings — отображает панель настроек DateRangeInput в витрине дизайн-системы.
 *
 * @example
 * <DateRangeInputSettings state={dateRangeInput} onChange={updateDateRangeInput} />
 */
export function DateRangeInputSettings({
  onChange,
  state,
}: DateRangeInputSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <ControlGroup
        label={state.label}
        shape={state.shape}
        size={state.size}
        onLabelChange={(label) => onChange('label', label)}
        onShapeChange={(shape) => {
          onChange('shape', shape);
          onChange('dayShape', shape);
          onChange('buttonShape', shape);
        }}
        onSizeChange={(size) => onChange('size', size)}
      />

      <BorderGroup
        borderTone={state.borderTone}
        onBorderToneChange={(tone) => onChange('borderTone', tone)}
      />

      <Checkbox
        checked={state.withClear}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('withClear', event.target.checked)
        }
      >
        Show clear
      </Checkbox>

      <ShapeListbox
        label="Day shape:"
        shapes={SHAPE_PRESET_KEYS}
        value={state.dayShape}
        onChange={(shape) => onChange('dayShape', shape)}
      />

      <ShapeListbox
        label="Button shape:"
        shapes={SHAPE_PRESET_KEYS}
        value={state.buttonShape}
        onChange={(shape) => onChange('buttonShape', shape)}
      />

      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_DATE_RANGE_INPUT_COMMIT_LABEL,
            value: state.commitLabel,
            onChange: (value) => onChange('commitLabel', value),
          },
        ]}
        labelPrefix="Commit text"
      />

      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_DATE_RANGE_INPUT_RESET_LABEL,
            value: state.resetLabel,
            onChange: (value) => onChange('resetLabel', value),
          },
        ]}
        labelPrefix="Reset text"
      />

      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_DATE_RANGE_INPUT_DISMISS_LABEL,
            value: state.dismissLabel,
            onChange: (value) => onChange('dismissLabel', value),
          },
        ]}
        labelPrefix="Close text"
      />

      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_CALENDAR_LOCALE,
            value: state.locale,
            onChange: (value) => {
              const previousLocale = resolveCalendarLocale(state.locale);
              const previousLabels = resolveCalendarWeekdayLabels(previousLocale);
              const followsLocale = state.weekdayLabels.every(
                (label, index) => label === previousLabels[index]
              );

              onChange('locale', value);

              if (followsLocale) {
                onChange(
                  'weekdayLabels',
                  resolveCalendarWeekdayLabels(resolveCalendarLocale(value))
                );
              }
            },
          },
        ]}
        labelPrefix="Locale"
      />

      {WEEKDAY_LABEL_PREFIXES.map((prefix, index) => (
        <TextGroup
          contents={[
            {
              boxedString: resolveCalendarWeekdayLabels(
                resolveCalendarLocale(state.locale)
              )[index],
              value: state.weekdayLabels[index],
              onChange: (value) => {
                const next = [...state.weekdayLabels] as [
                  string,
                  string,
                  string,
                  string,
                  string,
                  string,
                  string,
                ];

                next[index] = value;
                onChange('weekdayLabels', next);
              },
            },
          ]}
          key={prefix}
          labelPrefix={prefix}
        />
      ))}

      <Input
        label="Min day:"
        value={state.minDay}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange('minDay', event.target.value);
        }}
        onClear={() => onChange('minDay', '')}
      />

      <Input
        label="Max day:"
        value={state.maxDay}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange('maxDay', event.target.value);
        }}
        onClear={() => onChange('maxDay', '')}
      />

      <Checkbox
        checked={state.disabled}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange('disabled', event.target.checked);
        }}
      >
        Disabled
      </Checkbox>
    </StyledSettingsForm>
  );
}
