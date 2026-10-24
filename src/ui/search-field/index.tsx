/**
 * Файл: `src/ui/search-field/index.tsx`
 * Предоставляет компонент SearchField для отображения управляемого поля поиска
 * с секцией иконки и кнопкой сброса.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - форму строки-поля через проп `shape`
 *  - рамку контрола через проп `showBorder`
 *  - обводку фокуса через проп `showOutline`. Без пропа обводка есть и без рамки.
 *    `false` гасит её
 *  - режим мягкой заливки через проп `tinted`
 *  - тень через проп `showShadow`
 *  - тон рамки через проп `borderTone`
 *  - иконку через проп `icon`
 *  - позицию иконки через проп `iconPosition`
 *  - тон секции иконки через проп `iconTone`. Только в ветке включённой иконки.
 *    Вызов с `iconTone` и `showIcon={false}` не собирается. Тихий крестик
 *    его не получает
 *  - тон глифа иконки через проп `iconFill`. Тихий крестик его не получает
 *  - секцию иконки через проп `showIcon`
 *  - подпись над полем через проп `label`
 *  - плейсхолдер поля через проп `placeholder`. Без пропа — `Search…`, пустая строка перебивает
 *  - контролируемое значение через проп `value`
 *  - обработчик изменения значения через проп `onChange`
 *  - кнопку сброса через проп `showClearButton`. Дефолт — сброс есть. Кнопка
 *    появляется при непустом значении
 *  - обработчик сброса значения через проп `onClear`
 *  - доступное имя кнопки сброса через проп `clearAriaLabel`. Без пропа имя —
 *    `resolveClearAriaLabel`
 *
 * Основные задачи:
 * 1. Экспортировать компонент SearchField
 * 2. Типизировать пропсы через `SearchFieldProps`
 * 3. Экспортировать тип `SearchFieldIconProps` и функцию
 *    `resolveSearchFieldIconProps`
 * 4. Экспортировать пакеты `ShowSearchFieldBorderProps` и `ShowSearchFieldIconProps`
 *    и функции `resolveSearchFieldBorderProps` и `resolveShowSearchFieldIconProps`
 * 5. Экспортировать дефолт `DEFAULT_SEARCH_FIELD_PLACEHOLDER`
 * 6. Связывать подпись и поле для доступности
 * 7. Выставлять `aria-label` кнопки сброса через `clearAriaLabel` или
 *    `resolveClearAriaLabel`
 *
 * Потребители:
 *  - `@ui/listbox` — рендерит поле поиска в панели и подключает пакеты рамки и иконки
 *  - `@ui/toolbar` — рендерит поле поиска второй линией и подключает те же пакеты
 *  - страницы приложения — собирают фильтры и поиск
 *  - `src/pages/showcase` — демонстрирует состояния и собирает пакеты через резолверы
 */

import {
  useId,
  useRef,
  type ChangeEventHandler,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { SearchIcon } from '@icons';
import { resolveClearAriaLabel } from '@ui/a11y';
import { FieldClear, type ClearProps } from '@ui/field-clear';
import { FieldLabel } from '@ui/field-label';
import { Icon, resolveIconShape, type IconPosition } from '@ui/icon';
import { assignRef } from '@ui/ref';
import { type TonePreset } from '@ui/tones';

import {
  StyledSearchFieldControl,
  StyledSearchFieldRoot,
  StyledSearchFieldRow,
  splitLayoutProps,
  type SearchFieldStyleProps,
} from './search-field.styles';

/**
 * DEFAULT_SEARCH_FIELD_ICON — задаёт иконку по умолчанию.
 * Используется, когда вызывающий код не передал проп `icon`.
 */
const DEFAULT_SEARCH_FIELD_ICON = <SearchIcon />;

/**
 * DEFAULT_SEARCH_FIELD_ICON_POSITION — задаёт позицию иконки по умолчанию.
 * Используется, когда вызывающий код не передал проп `iconPosition`.
 */
const DEFAULT_SEARCH_FIELD_ICON_POSITION: IconPosition = 'start';

/**
 * DEFAULT_SEARCH_FIELD_PLACEHOLDER — задаёт плейсхолдер поля поиска по умолчанию.
 * Используется, когда вызывающий код не передал проп `placeholder`.
 */
export const DEFAULT_SEARCH_FIELD_PLACEHOLDER = 'Search…';

/**
 * DEFAULT_SEARCH_FIELD_SHOW_ICON — задаёт режим показа секции иконки по умолчанию.
 * Используется, когда вызывающий код не передал проп `showIcon`.
 */
const DEFAULT_SEARCH_FIELD_SHOW_ICON = true;

/**
 * DEFAULT_SEARCH_FIELD_SHOW_CLEAR_BUTTON — задаёт режим показа кнопки сброса по умолчанию.
 * Используется, когда вызывающий код не передал проп `showClearButton`.
 */
const DEFAULT_SEARCH_FIELD_SHOW_CLEAR_BUTTON = true;

/**
 * CLEAR_SEARCH_ARIA_LABEL — задаёт запасной `aria-label` кнопки сброса поиска.
 * Передаётся вторым аргументом в `resolveClearAriaLabel`, когда подпись пуста.
 */
const CLEAR_SEARCH_ARIA_LABEL = 'Clear search';

/**
 * ShowSearchFieldBorderProps — представляет пропсы рамки вложенного поля поиска.
 * Тон и тень допустимы, когда рамка не выключена явно. Без пропа рамка включена.
 * Подключается локально через `& ShowSearchFieldBorderProps` у Listbox и Toolbar.
 *
 * @property searchFieldBorderTone — тон рамки поля поиска
 * @property showSearchFieldBorder — включает рамку поля поиска. Без пропа рамка включена
 * @property showSearchFieldShadow — включает тень поля поиска при включённой рамке.
 *   Без пропа тень включена
 */
type ShowSearchFieldBorderProps =
  | {
      searchFieldBorderTone?: never;
      showSearchFieldBorder: false;
      showSearchFieldShadow?: never;
    }
  | {
      searchFieldBorderTone?: TonePreset;
      showSearchFieldBorder?: true;
      showSearchFieldShadow?: boolean;
    };

/**
 * resolveSearchFieldBorderProps — возвращает пакет пропсов рамки вложенного поля поиска.
 * При включённой рамке отдаёт `showSearchFieldBorder` вместе с тоном и тенью, иначе гасит
 * зависимые поля. Результат подходит к `ShowSearchFieldBorderProps`.
 * Используется в `src/pages/showcase`.
 *
 * @param showSearchFieldBorder включает рамку поля поиска
 * @param searchFieldBorderTone тон рамки при включённой рамке
 * @param showSearchFieldShadow включает тень при включённой рамке
 * @returns пакет пропсов рамки для передачи в Listbox или Toolbar
 */
function resolveSearchFieldBorderProps(
  showSearchFieldBorder: boolean,
  searchFieldBorderTone?: TonePreset,
  showSearchFieldShadow?: boolean
): ShowSearchFieldBorderProps {
  return showSearchFieldBorder
    ? { searchFieldBorderTone, showSearchFieldBorder: true, showSearchFieldShadow }
    : { showSearchFieldBorder: false };
}

/**
 * ShowSearchFieldIconProps — представляет пропсы иконки вложенного поля поиска.
 * Поля иконки допустимы только при явном `showSearchFieldIcon: true`: без пропа иконки нет.
 * Подключается локально через `& ShowSearchFieldIconProps` у Listbox и Toolbar.
 *
 * @property searchFieldIcon — глиф иконки поля поиска
 * @property searchFieldIconFill — тон глифа иконки поля поиска
 * @property searchFieldIconPosition — позиция иконки поля поиска
 * @property searchFieldIconTone — тон секции иконки поля поиска
 * @property showSearchFieldIcon — включает иконку поля поиска. Без пропа иконки нет
 */
type ShowSearchFieldIconProps =
  | {
      searchFieldIcon?: never;
      searchFieldIconFill?: never;
      searchFieldIconPosition?: never;
      searchFieldIconTone?: never;
      showSearchFieldIcon?: false;
    }
  | {
      searchFieldIcon?: ReactNode;
      searchFieldIconFill?: TonePreset;
      searchFieldIconPosition?: IconPosition;
      searchFieldIconTone?: TonePreset;
      showSearchFieldIcon: true;
    };

/**
 * resolveShowSearchFieldIconProps — возвращает пакет пропсов иконки вложенного поля поиска.
 * При включённой иконке отдаёт `showSearchFieldIcon` вместе с глифом, тоном глифа, позицией
 * и тоном секции, иначе гасит зависимые поля. Результат подходит к `ShowSearchFieldIconProps`.
 * Используется в `src/pages/showcase`.
 *
 * @param showSearchFieldIcon включает иконку поля поиска
 * @param searchFieldIcon глиф иконки при включённой иконке
 * @param searchFieldIconFill тон глифа при включённой иконке
 * @param searchFieldIconPosition позиция иконки при включённой иконке
 * @param searchFieldIconTone тон секции иконки при включённой иконке
 * @returns пакет пропсов иконки для передачи в Listbox или Toolbar
 */
function resolveShowSearchFieldIconProps(
  showSearchFieldIcon: boolean,
  searchFieldIcon?: ReactNode,
  searchFieldIconFill?: TonePreset,
  searchFieldIconPosition?: IconPosition,
  searchFieldIconTone?: TonePreset
): ShowSearchFieldIconProps {
  return showSearchFieldIcon
    ? {
        searchFieldIcon,
        searchFieldIconFill,
        searchFieldIconPosition,
        searchFieldIconTone,
        showSearchFieldIcon: true,
      }
    : { showSearchFieldIcon: false };
}

/**
 * SearchFieldIconProps — представляет пропсы секции иконки SearchField.
 * Поля секции допустимы, пока `showIcon` не выключен: дефолт флага — иконка есть.
 *
 * @property icon — svg секции иконки
 * @property iconPosition — позиция иконки относительно поля
 * @property iconTone — тон секции иконки
 * @property showIcon — включает секцию иконки
 */
type SearchFieldIconProps =
  | {
      icon?: never;
      iconPosition?: never;
      iconTone?: never;
      showIcon: false;
    }
  | {
      icon?: ReactNode;
      iconPosition?: IconPosition;
      iconTone?: TonePreset;
      showIcon?: true;
    };

/**
 * resolveSearchFieldIconProps — возвращает пакет пропсов секции иконки по флагу показа.
 * При включённой секции отдаёт `showIcon` вместе с глифом, позицией и `iconTone`, иначе гасит
 * зависимые поля. Результат подходит к `SearchFieldIconProps`.
 * Используется в `src/pages/showcase`, `@ui/listbox` и `@ui/toolbar`.
 *
 * @param showIcon включает секцию иконки
 * @param icon глиф секции иконки при включённой секции
 * @param iconPosition позиция иконки при включённой секции
 * @param iconTone тон секции иконки при включённой секции
 * @returns пакет пропсов секции иконки для передачи в SearchField
 */
function resolveSearchFieldIconProps(
  showIcon: boolean,
  icon?: ReactNode,
  iconPosition?: IconPosition,
  iconTone?: TonePreset
): SearchFieldIconProps {
  return showIcon
    ? { icon, iconPosition, iconTone, showIcon: true }
    : { showIcon: false };
}

/**
 * SearchFieldProps — представляет пропсы компонента SearchField.
 *
 * @property iconFill — тон глифа иконки при нейтральном `iconTone`
 * @property label — подпись над полем
 * @property onChange — обработчик изменения значения
 * @property onClear — обработчик сброса значения
 * @property value — контролируемое значение
 */
type SearchFieldProps = {
  iconFill?: TonePreset;
  label?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClear: () => void;
  value: string;
} & ClearProps &
  SearchFieldIconProps &
  SearchFieldStyleProps &
  Omit<
    ComponentPropsWithRef<'input'>,
    'className' | 'onChange' | 'style' | 'type' | 'value' | keyof SearchFieldStyleProps
  >;

/**
 * SearchField — отображает управляемое поле поиска с секцией иконки и кнопкой сброса.
 *
 * @example
 * <SearchField
 *   label="Label:"
 *   value={query}
 *   onChange={handleQueryChange}
 *   onClear={() => setQuery('')}
 * />
 * <SearchField
 *   showBorder={false}
 *   showIcon={false}
 *   value={query}
 *   onChange={handleQueryChange}
 *   onClear={() => setQuery('')}
 * />
 */
function SearchField({
  borderTone,
  clearAriaLabel,
  icon = DEFAULT_SEARCH_FIELD_ICON,
  iconFill,
  iconPosition = DEFAULT_SEARCH_FIELD_ICON_POSITION,
  iconTone,
  label,
  onChange,
  onClear,
  placeholder = DEFAULT_SEARCH_FIELD_PLACEHOLDER,
  shape,
  showBorder,
  showClearButton = DEFAULT_SEARCH_FIELD_SHOW_CLEAR_BUTTON,
  showIcon = DEFAULT_SEARCH_FIELD_SHOW_ICON,
  showOutline,
  showShadow,
  size,
  tinted,
  value,
  ...rest
}: SearchFieldProps) {
  const iconShape = resolveIconShape(shape);
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const { disabled, id: idProp, ref, ...inputProps } = restProps;
  const fallbackId = useId();
  const id = idProp ?? fallbackId;
  const inputRef = useRef<HTMLInputElement>(null);
  const hasClear = showClearButton && value.length > 0;
  const isIconStart = iconPosition === 'start';

  function handleClear(): void {
    onClear();
    inputRef.current?.focus();
  }

  /**
   * handleRowMouseDown — переносит фокус в поле по `mousedown` левой кнопки
   * вне поля и вне сброса.
   * Клик по полю и по сбросу не перехватывается.
   * Секция иконки не является кнопкой и не имеет своего шага `Tab`.
   *
   * @param event нажатие мыши на ряде
   */
  function handleRowMouseDown(event: MouseEvent<HTMLDivElement>): void {
    if (disabled || event.button !== 0) {
      return;
    }

    const control = inputRef.current;
    const { target } = event;

    if (!control || !(target instanceof Node) || control.contains(target)) {
      return;
    }

    if (target instanceof Element && target.closest('[data-slot="clear"]')) {
      return;
    }

    event.preventDefault();
    control.focus();
  }

  const iconNode = showIcon && (
    <Icon
      data-slot="icon"
      iconFill={iconFill}
      iconTone={iconTone}
      interactive
      shape={iconShape}
      showBorder={false}
      showHover={false}
      size={size}
    >
      {icon}
    </Icon>
  );

  const clearNode = hasClear && (
    <FieldClear
      ariaLabel={clearAriaLabel ?? resolveClearAriaLabel(label, CLEAR_SEARCH_ARIA_LABEL)}
      disabled={disabled}
      size={size}
      onClick={handleClear}
    />
  );

  return (
    <StyledSearchFieldRoot data-disabled={disabled ? true : undefined} {...layoutProps}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <StyledSearchFieldRow
        borderTone={borderTone}
        data-has-clear={hasClear ? true : undefined}
        iconTone={iconTone}
        shape={shape}
        showBorder={showBorder}
        showOutline={showOutline}
        showShadow={showShadow}
        size={size}
        tinted={tinted}
        onMouseDown={handleRowMouseDown}
      >
        {isIconStart && iconNode}
        <StyledSearchFieldControl
          {...inputProps}
          disabled={disabled}
          id={id}
          placeholder={placeholder}
          ref={(node) => {
            inputRef.current = node;
            assignRef(ref, node);
          }}
          size={size}
          type="search"
          value={value}
          onChange={onChange}
        />
        {!isIconStart && iconNode}
        {clearNode}
      </StyledSearchFieldRow>
    </StyledSearchFieldRoot>
  );
}

/* eslint-disable react-refresh/only-export-components -- пакеты рамки и иконки вложенного поиска для Listbox и Toolbar */
export {
  SearchField,
  resolveSearchFieldBorderProps,
  resolveSearchFieldIconProps,
  resolveShowSearchFieldIconProps,
  type SearchFieldIconProps,
  type ShowSearchFieldBorderProps,
  type ShowSearchFieldIconProps,
};
