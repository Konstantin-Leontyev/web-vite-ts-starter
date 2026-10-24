/**
 * Файл: `src/pages/showcase/search-field-group/index.tsx`
 * Предоставляет компонент SearchFieldGroup для отображения группы настроек
 * поля поиска в витрине дизайн-системы. Используется только в витрине:
 * в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - тон рамки через проп `borderTone`
 *  - недоступное состояние поля через проп `disabled`
 *  - тон глифа иконки через проп `iconFill`
 *  - ключ глифа через проп `iconKey`
 *  - опции глифов через проп `iconOptions`
 *  - позицию иконки через проп `iconPosition`
 *  - тон секции иконки через проп `iconTone`
 *  - подпись поля через проп `label`. Без пропа и без `onLabelChange` строка
 *    подписи не рисуется
 *  - префикс подписей через проп `labelPrefix`. Без пропа подписи без префикса
 *  - обработчик изменения тона рамки через проп `onBorderToneChange`
 *  - обработчик недоступного состояния через проп `onDisabledChange`
 *  - обработчик изменения тона глифа через проп `onIconFillChange`
 *  - обработчик смены глифа через проп `onIconKeyChange`
 *  - обработчик изменения позиции иконки через проп `onIconPositionChange`
 *  - обработчик изменения тона секции иконки через проп `onIconToneChange`
 *  - обработчик изменения подписи через проп `onLabelChange`. Без него и без
 *    `label` строка подписи не рисуется
 *  - обработчик изменения плейсхолдера через проп `onPlaceholderChange`
 *  - обработчик изменения формы через проп `onShapeChange`
 *  - обработчик показа рамки через проп `onShowBorderChange`
 *  - обработчик показа кнопки сброса через проп `onShowClearButtonChange`
 *  - обработчик показа иконки через проп `onShowIconChange`
 *  - обработчик показа обводки фокуса через проп `onShowOutlineChange`
 *  - обработчик показа тени через проп `onShowShadowChange`
 *  - обработчик изменения размера через проп `onSizeChange`
 *  - обработчик мягкой заливки через проп `onTintedChange`
 *  - плейсхолдер через проп `placeholder`
 *  - форму поля через проп `shape`
 *  - рамку через проп `showBorder`
 *  - кнопку сброса через проп `showClearButton`
 *  - секцию иконки через проп `showIcon`
 *  - обводку фокуса через проп `showOutline`
 *  - тень через проп `showShadow`
 *  - размер поля через проп `size`
 *  - мягкую заливку через проп `tinted`
 *
 * Основные задачи:
 * 1. Экспортировать компонент SearchFieldGroup
 * 2. Типизировать пропсы через `SearchFieldGroupProps`
 * 3. Рендерить единый блок настроек поля поиска. Размер и форму собирает
 *    `ControlGroup` через необязательный `labelPrefix`
 *
 * Потребители:
 *  - панели настроек витрины — настраивают поле поиска:
 *     - `src/pages/showcase/search-field-settings/index.tsx`
 *     - `src/pages/showcase/listbox-settings/index.tsx`
 *     - `src/pages/showcase/toolbar-settings/index.tsx`
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { type IconPosition } from '@ui/icon';
import { type ListboxOption } from '@ui/listbox';
import { type ShapePreset, type SizePreset } from '@ui/presets';
import { DEFAULT_SEARCH_FIELD_PLACEHOLDER } from '@ui/search-field';
import { type TonePreset } from '@ui/tones';

import { BorderGroup } from '../border-group';
import { ControlGroup } from '../control-group';
import { IconGroup } from '../icon-group';
import { resolveGroupFlagLabel } from '../showcase-labels';
import { TextGroup } from '../text-group';

/**
 * SearchFieldGroupProps — представляет пропсы компонента SearchFieldGroup.
 *
 * @property borderTone — текущий тон рамки
 * @property disabled — включает недоступное состояние поля
 * @property iconFill — текущий тон глифа иконки
 * @property iconKey — текущий ключ глифа
 * @property iconOptions — опции Listbox с глифами
 * @property iconPosition — текущая позиция иконки
 * @property iconTone — текущий тон секции иконки
 * @property label — текущая подпись поля. Без пропа и без `onLabelChange` строка
 *   не рисуется. Пустая строка схлопывается в `Set label`
 * @property labelPrefix — префикс подписей, например `Search field`.
 *   Без пропа подписи без префикса
 * @property onBorderToneChange — обработчик изменения тона рамки
 * @property onDisabledChange — обработчик изменения недоступного состояния
 * @property onIconFillChange — обработчик изменения тона глифа
 * @property onIconKeyChange — обработчик смены глифа
 * @property onIconPositionChange — обработчик изменения позиции иконки
 * @property onIconToneChange — обработчик изменения тона секции иконки
 * @property onLabelChange — обработчик изменения подписи. Без него и без `label`
 *   строка подписи не рисуется
 * @property onPlaceholderChange — обработчик изменения плейсхолдера
 * @property onShapeChange — обработчик изменения формы
 * @property onShowBorderChange — обработчик показа рамки
 * @property onShowClearButtonChange — обработчик показа кнопки сброса
 * @property onShowIconChange — обработчик показа иконки
 * @property onShowOutlineChange — обработчик показа обводки фокуса
 * @property onShowShadowChange — обработчик показа тени
 * @property onSizeChange — обработчик изменения размера
 * @property onTintedChange — обработчик мягкой заливки
 * @property placeholder — текущий плейсхолдер
 * @property shape — текущая форма поля
 * @property showBorder — включает рамку
 * @property showClearButton — включает кнопку сброса
 * @property showIcon — включает секцию иконки
 * @property showOutline — включает обводку фокуса. От рамки не зависит
 * @property showShadow — включает тень при включённой рамке
 * @property size — текущий размер поля
 * @property tinted — включает мягкую заливку
 */
type SearchFieldGroupProps = {
  borderTone: TonePreset;
  disabled: boolean;
  iconFill: TonePreset;
  iconKey: string;
  iconOptions: readonly ListboxOption[];
  iconPosition: IconPosition;
  iconTone: TonePreset;
  label?: string;
  labelPrefix?: string;
  onBorderToneChange: (tone: TonePreset) => void;
  onDisabledChange: (disabled: boolean) => void;
  onIconFillChange: (tone: TonePreset) => void;
  onIconKeyChange: (iconKey: string) => void;
  onIconPositionChange: (position: IconPosition) => void;
  onIconToneChange: (tone: TonePreset) => void;
  onLabelChange?: (label: string) => void;
  onPlaceholderChange: (placeholder: string) => void;
  onShapeChange: (shape: ShapePreset) => void;
  onShowBorderChange: (show: boolean) => void;
  onShowClearButtonChange: (show: boolean) => void;
  onShowIconChange: (show: boolean) => void;
  onShowOutlineChange: (show: boolean) => void;
  onShowShadowChange: (show: boolean) => void;
  onSizeChange: (size: SizePreset) => void;
  onTintedChange: (tinted: boolean) => void;
  placeholder: string;
  shape: ShapePreset;
  showBorder: boolean;
  showClearButton: boolean;
  showIcon: boolean;
  showOutline: boolean;
  showShadow: boolean;
  size: SizePreset;
  tinted: boolean;
};

/**
 * SearchFieldGroup — отображает группу настроек поля поиска в витрине дизайн-системы.
 *
 * @example
 * <SearchFieldGroup
 *   borderTone={state.borderTone}
 *   disabled={state.disabled}
 *   iconFill={state.iconFill}
 *   iconKey={state.iconKey}
 *   iconOptions={ICON_OPTIONS}
 *   iconPosition={state.iconPosition}
 *   iconTone={state.iconTone}
 *   label={state.label}
 *   placeholder={state.placeholder}
 *   shape={state.shape}
 *   showBorder={state.showBorder}
 *   showClearButton={state.showClearButton}
 *   showIcon={state.showIcon}
 *   showOutline={state.showOutline}
 *   showShadow={state.showShadow}
 *   size={state.size}
 *   tinted={state.tinted}
 *   onBorderToneChange={(tone) => onChange('borderTone', tone)}
 *   onDisabledChange={(disabled) => onChange('disabled', disabled)}
 *   onIconFillChange={(tone) => onChange('iconFill', tone)}
 *   onIconKeyChange={(iconKey) => onChange('iconKey', iconKey)}
 *   onIconPositionChange={(position) => onChange('iconPosition', position)}
 *   onIconToneChange={(tone) => onChange('iconTone', tone)}
 *   onLabelChange={(label) => onChange('label', label)}
 *   onPlaceholderChange={(placeholder) => onChange('placeholder', placeholder)}
 *   onShapeChange={(shape) => onChange('shape', shape)}
 *   onShowBorderChange={(show) => onChange('showBorder', show)}
 *   onShowClearButtonChange={(show) => onChange('showClearButton', show)}
 *   onShowIconChange={(show) => onChange('showIcon', show)}
 *   onShowOutlineChange={(show) => onChange('showOutline', show)}
 *   onShowShadowChange={(show) => onChange('showShadow', show)}
 *   onSizeChange={(size) => onChange('size', size)}
 *   onTintedChange={(tinted) => onChange('tinted', tinted)}
 * />
 */
export function SearchFieldGroup({
  borderTone,
  disabled,
  iconFill,
  iconKey,
  iconOptions,
  iconPosition,
  iconTone,
  label,
  labelPrefix,
  onBorderToneChange,
  onDisabledChange,
  onIconFillChange,
  onIconKeyChange,
  onIconPositionChange,
  onIconToneChange,
  onLabelChange,
  onPlaceholderChange,
  onShapeChange,
  onShowBorderChange,
  onShowClearButtonChange,
  onShowIconChange,
  onShowOutlineChange,
  onShowShadowChange,
  onSizeChange,
  onTintedChange,
  placeholder,
  shape,
  showBorder,
  showClearButton,
  showIcon,
  showOutline,
  showShadow,
  size,
  tinted,
}: SearchFieldGroupProps) {
  const placeholderPrefix =
    labelPrefix === undefined ? 'Placeholder' : `${labelPrefix} placeholder`;
  const iconLabelPrefix = labelPrefix === undefined ? 'Icon' : `${labelPrefix} icon`;

  return (
    <>
      {label !== undefined && onLabelChange !== undefined ? (
        <ControlGroup
          label={label}
          labelPrefix={labelPrefix}
          shape={shape}
          size={size}
          onLabelChange={onLabelChange}
          onShapeChange={onShapeChange}
          onSizeChange={onSizeChange}
        />
      ) : (
        <ControlGroup
          labelPrefix={labelPrefix}
          shape={shape}
          size={size}
          onShapeChange={onShapeChange}
          onSizeChange={onSizeChange}
        />
      )}

      <BorderGroup
        borderTone={borderTone}
        labelPrefix={labelPrefix}
        showBorder={showBorder}
        showShadow={showShadow}
        onBorderToneChange={onBorderToneChange}
        onShowBorderChange={onShowBorderChange}
        onShowShadowChange={onShowShadowChange}
      />

      <Checkbox
        checked={showOutline}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onShowOutlineChange(event.target.checked)
        }
      >
        {resolveGroupFlagLabel(
          labelPrefix === undefined ? undefined : `${labelPrefix} outline`,
          'Outline',
          'Show'
        )}
      </Checkbox>

      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_SEARCH_FIELD_PLACEHOLDER,
            value: placeholder,
            onChange: onPlaceholderChange,
          },
        ]}
        labelPrefix={placeholderPrefix}
      />

      <IconGroup
        fill={iconFill}
        iconOptions={iconOptions}
        iconValue={iconKey}
        labelPrefix={iconLabelPrefix}
        position={iconPosition}
        show={showIcon}
        tone={iconTone}
        onFillChange={onIconFillChange}
        onIconChange={onIconKeyChange}
        onPositionChange={onIconPositionChange}
        onShowChange={onShowIconChange}
        onToneChange={onIconToneChange}
      />

      <Checkbox
        checked={showClearButton}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onShowClearButtonChange(event.target.checked)
        }
      >
        {resolveGroupFlagLabel(
          labelPrefix === undefined ? undefined : `${labelPrefix} clear button`,
          'Clear button',
          'Show'
        )}
      </Checkbox>

      <Checkbox
        checked={disabled}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onDisabledChange(event.target.checked)
        }
      >
        {labelPrefix === undefined
          ? 'Disabled'
          : resolveGroupFlagLabel(labelPrefix, 'Search field', 'Disable')}
      </Checkbox>

      <Checkbox
        checked={tinted}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onTintedChange(event.target.checked)
        }
      >
        {resolveGroupFlagLabel(
          labelPrefix === undefined ? undefined : `${labelPrefix} tinted`,
          'Tinted',
          'Show'
        )}
      </Checkbox>
    </>
  );
}
