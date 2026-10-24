/**
 * Файл: `src/pages/showcase/toolbar-settings/index.tsx`
 * Определяет панель настроек компонента Toolbar в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, рамки, тени, заливки,
 * рамки и тени действий, набора действий и поля поиска в реальном времени.
 * Включён поиск — форма становится скруглённой `rounded`, список формы недоступен.
 * Выбрана капсула `pill` — флажок поиска недоступен.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `ToolbarWidgetState`
 * 2. Экспортировать компонент `ToolbarSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета Toolbar
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import {
  ICON_SIZE_PRESET_KEYS,
  getIconPadding,
  type IconPosition,
  type IconSizePreset,
} from '@ui/icon';
import {
  DEFAULT_SHAPE_PRESET,
  SHAPE_PRESET_KEYS,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { type SurfaceBackgroundPreset } from '@ui/surface';
import { type TonePreset } from '@ui/tones';
import { resolveToolbarFieldSize } from '@ui/toolbar';

import { ActionBorderGroup } from '../action-border-group';
import { BackgroundListbox } from '../background-listbox';
import { BorderGroup } from '../border-group';
import { IconRowGroup, type IconRowGroupAction } from '../icon-row-group';
import { SearchFieldGroup } from '../search-field-group';
import { ShapeListbox } from '../shape-listbox';
import { ICON_OPTIONS, type IconKey } from '../showcase-icon-options';
import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';

/**
 * ToolbarWidgetState — представляет состояние настроек компонента Toolbar в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Toolbar, кроме витринных ключей:
 * `searchIconKey` выбирает глиф лупы поля поиска.
 * `actions` хранит демо-ряд действий с ключом иконки, подсказкой, отступом окна
 * Icon и флагами `active` и `disabled` вместо `ReactNode` и обработчика.
 * Используется для синхронизации значений между панелью управления и демонстрационным виджетом Toolbar.
 *
 * @property actions — демо-ряд действий
 * @property background — заливка панели инструментов
 * @property borderTone — тон рамки
 * @property searchDisabled — включает недоступное состояние поля поиска
 * @property searchFieldBorderTone — тон рамки поля поиска
 * @property searchFieldIconFill — тон глифа лупы поля поиска
 * @property searchFieldIconPosition — позиция лупы поля поиска
 * @property searchFieldIconTone — тон секции лупы поля поиска
 * @property searchIconKey — витринный ключ глифа лупы поля поиска
 * @property searchPlaceholder — плейсхолдер поля поиска
 * @property searchShape — форма поля поиска
 * @property searchSize — размер поля поиска
 * @property shape — форма панели
 * @property showActionBorder — включает рамку действий
 * @property showActionShadow — включает тень действий при включённой рамке
 * @property showBorder — включает рамку
 * @property showSearchField — включает поле поиска
 * @property showSearchFieldBorder — включает рамку поля поиска
 * @property showSearchFieldClearButton — включает кнопку сброса поля поиска
 * @property showSearchFieldIcon — включает лупу поля поиска
 * @property showSearchFieldOutline — включает обводку фокуса поля поиска
 * @property showSearchFieldShadow — включает тень поля поиска
 * @property showShadow — включает тень при включённой рамке
 * @property size — размер окна действия
 * @property tinted — включает мягкую заливку поля поиска
 */
export type ToolbarWidgetState = {
  actions: IconRowGroupAction[];
  background: SurfaceBackgroundPreset;
  borderTone: TonePreset;
  searchDisabled: boolean;
  searchFieldBorderTone: TonePreset;
  searchFieldIconFill: TonePreset;
  searchFieldIconPosition: IconPosition;
  searchFieldIconTone: TonePreset;
  searchIconKey: IconKey;
  searchPlaceholder: string;
  searchShape: ShapePreset;
  searchSize: SizePreset;
  shape: ShapePreset;
  showActionBorder: boolean;
  showActionShadow: boolean;
  showBorder: boolean;
  showSearchField: boolean;
  showSearchFieldBorder: boolean;
  showSearchFieldClearButton: boolean;
  showSearchFieldIcon: boolean;
  showSearchFieldOutline: boolean;
  showSearchFieldShadow: boolean;
  showShadow: boolean;
  size: IconSizePreset;
  tinted: boolean;
};

/**
 * ToolbarSettingsProps — представляет пропсы компонента ToolbarSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек панели инструментов
 */
type ToolbarSettingsProps = {
  onChange: <K extends keyof ToolbarWidgetState>(
    key: K,
    value: ToolbarWidgetState[K]
  ) => void;
  state: ToolbarWidgetState;
};

/**
 * ToolbarSettings — отображает панель настроек Toolbar в витрине дизайн-системы.
 *
 * @example
 * <ToolbarSettings state={toolbar} onChange={updateToolbar} />
 */
export function ToolbarSettings({ onChange, state }: ToolbarSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SizeListbox
        label="Size:"
        sizes={ICON_SIZE_PRESET_KEYS}
        value={state.size}
        onChange={(size) => {
          onChange('size', size);
          onChange('searchSize', resolveToolbarFieldSize(size));
          onChange(
            'actions',
            state.actions.map((action) => ({
              ...action,
              iconPadding: getIconPadding(size),
            }))
          );
        }}
      />

      <ShapeListbox
        disabled={state.showSearchField}
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

      <ActionBorderGroup
        showActionBorder={state.showActionBorder}
        showActionShadow={state.showActionShadow}
        onShowActionBorderChange={(show) => onChange('showActionBorder', show)}
        onShowActionShadowChange={(show) => onChange('showActionShadow', show)}
      />

      <IconRowGroup
        actions={state.actions}
        defaultIconPadding={getIconPadding(state.size)}
        onActionsChange={(actions) => onChange('actions', actions)}
      />

      <Checkbox
        checked={state.showSearchField}
        disabled={state.shape === 'pill'}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const showSearchField = event.target.checked;

          if (showSearchField) {
            onChange('shape', DEFAULT_SHAPE_PRESET);
          }

          onChange('showSearchField', showSearchField);
        }}
      >
        Show search field
      </Checkbox>

      {state.showSearchField && (
        <SearchFieldGroup
          borderTone={state.searchFieldBorderTone}
          disabled={state.searchDisabled}
          iconFill={state.searchFieldIconFill}
          iconKey={state.searchIconKey}
          iconOptions={ICON_OPTIONS}
          iconPosition={state.searchFieldIconPosition}
          iconTone={state.searchFieldIconTone}
          labelPrefix="Search field"
          placeholder={state.searchPlaceholder}
          shape={state.searchShape}
          showBorder={state.showSearchFieldBorder}
          showClearButton={state.showSearchFieldClearButton}
          showIcon={state.showSearchFieldIcon}
          showOutline={state.showSearchFieldOutline}
          showShadow={state.showSearchFieldShadow}
          size={state.searchSize}
          tinted={state.tinted}
          onBorderToneChange={(tone) => onChange('searchFieldBorderTone', tone)}
          onDisabledChange={(disabled) => onChange('searchDisabled', disabled)}
          onIconFillChange={(tone) => onChange('searchFieldIconFill', tone)}
          onIconKeyChange={(iconKey) => onChange('searchIconKey', iconKey as IconKey)}
          onIconPositionChange={(position) =>
            onChange('searchFieldIconPosition', position)
          }
          onIconToneChange={(tone) => onChange('searchFieldIconTone', tone)}
          onPlaceholderChange={(placeholder) =>
            onChange('searchPlaceholder', placeholder)
          }
          onShapeChange={(shape) => onChange('searchShape', shape)}
          onShowBorderChange={(show) => onChange('showSearchFieldBorder', show)}
          onShowClearButtonChange={(show) =>
            onChange('showSearchFieldClearButton', show)
          }
          onShowIconChange={(show) => onChange('showSearchFieldIcon', show)}
          onShowOutlineChange={(show) => onChange('showSearchFieldOutline', show)}
          onShowShadowChange={(show) => onChange('showSearchFieldShadow', show)}
          onSizeChange={(size) => onChange('searchSize', size)}
          onTintedChange={(tinted) => onChange('tinted', tinted)}
        />
      )}
    </StyledSettingsForm>
  );
}
