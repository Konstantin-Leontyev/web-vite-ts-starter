/**
 * Файл: `src/pages/showcase/search-field-settings/index.tsx`
 * Определяет панель настроек компонента SearchField в витрине дизайн-системы.
 * Содержит группу настроек поля поиска.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `SearchFieldWidgetState`
 * 2. Экспортировать компонент `SearchFieldSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета SearchField
 */

import { type IconPosition } from '@ui/icon';
import { type ShapePreset, type SizePreset } from '@ui/presets';
import { type TonePreset } from '@ui/tones';

import { SearchFieldGroup } from '../search-field-group';
import { ICON_OPTIONS, type IconKey } from '../showcase-icon-options';
import { StyledSettingsForm } from '../showcase.styles';

/**
 * SearchFieldWidgetState — представляет состояние настроек компонента SearchField в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента SearchField, кроме витринных ключей:
 * `iconKey` выбирает глиф для пропа `icon` в превью.
 * Используется для синхронизации значений между панелью управления и демонстрационным SearchField.
 *
 * @property borderTone — тон рамки
 * @property disabled — включает недоступное состояние поля
 * @property iconFill — тон глифа иконки
 * @property iconKey — витринный ключ выбора глифа иконки для превью
 * @property iconPosition — позиция иконки относительно поля
 * @property iconTone — тон секции иконки
 * @property label — подпись над полем
 * @property placeholder — плейсхолдер значения
 * @property shape — форма строки-поля
 * @property showBorder — включает рамку контрола
 * @property showClearButton — включает кнопку сброса
 * @property showIcon — включает секцию иконки
 * @property showOutline — включает обводку фокуса. От рамки не зависит
 * @property showShadow — включает тень при включённой рамке
 * @property size — размер контрола
 * @property tinted — включает мягкую заливку
 * @property value — значение поля
 */
export type SearchFieldWidgetState = {
  borderTone: TonePreset;
  disabled: boolean;
  iconFill: TonePreset;
  iconKey: IconKey;
  iconPosition: IconPosition;
  iconTone: TonePreset;
  label: string;
  placeholder: string;
  shape: ShapePreset;
  showBorder: boolean;
  showClearButton: boolean;
  showIcon: boolean;
  showOutline: boolean;
  showShadow: boolean;
  size: SizePreset;
  tinted: boolean;
  value: string;
};

/**
 * SearchFieldSettingsProps — представляет пропсы компонента SearchFieldSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек SearchField
 */
type SearchFieldSettingsProps = {
  onChange: <K extends keyof SearchFieldWidgetState>(
    key: K,
    value: SearchFieldWidgetState[K]
  ) => void;
  state: SearchFieldWidgetState;
};

/**
 * SearchFieldSettings — отображает панель настроек SearchField в витрине дизайн-системы.
 *
 * @example
 * <SearchFieldSettings state={searchField} onChange={updateSearchField} />
 */
export function SearchFieldSettings({ onChange, state }: SearchFieldSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SearchFieldGroup
        borderTone={state.borderTone}
        disabled={state.disabled}
        iconFill={state.iconFill}
        iconKey={state.iconKey}
        iconOptions={ICON_OPTIONS}
        iconPosition={state.iconPosition}
        iconTone={state.iconTone}
        label={state.label}
        placeholder={state.placeholder}
        shape={state.shape}
        showBorder={state.showBorder}
        showClearButton={state.showClearButton}
        showIcon={state.showIcon}
        showOutline={state.showOutline}
        showShadow={state.showShadow}
        size={state.size}
        tinted={state.tinted}
        onBorderToneChange={(tone) => onChange('borderTone', tone)}
        onDisabledChange={(disabled) => onChange('disabled', disabled)}
        onIconFillChange={(tone) => onChange('iconFill', tone)}
        onIconKeyChange={(iconKey) => onChange('iconKey', iconKey as IconKey)}
        onIconPositionChange={(position) => onChange('iconPosition', position)}
        onIconToneChange={(tone) => onChange('iconTone', tone)}
        onLabelChange={(label) => onChange('label', label)}
        onPlaceholderChange={(placeholder) => onChange('placeholder', placeholder)}
        onShapeChange={(shape) => onChange('shape', shape)}
        onShowBorderChange={(show) => onChange('showBorder', show)}
        onShowClearButtonChange={(show) => onChange('showClearButton', show)}
        onShowIconChange={(show) => onChange('showIcon', show)}
        onShowOutlineChange={(show) => onChange('showOutline', show)}
        onShowShadowChange={(show) => onChange('showShadow', show)}
        onSizeChange={(size) => onChange('size', size)}
        onTintedChange={(tinted) => onChange('tinted', tinted)}
      />
    </StyledSettingsForm>
  );
}
