/**
 * Файл: `src/ui/listbox/index.tsx`
 * Предоставляет компонент Listbox для отображения выбора значения из списка опций.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - форму через проп `shape`
 *  - вид триггера через проп `appearance`
 *  - рамку вида `icon` через проп `showBorder`
 *  - тень вида `icon` через проп `showShadow`
 *  - запасной глиф вида `icon` через проп `icon`. У вида `field` не рисуется
 *  - тон рамки через проп `borderTone`
 *  - тон глифа шеврона через проп `iconFill`. Только у вида `field`
 *  - позицию шеврона через проп `iconPosition`. Только у вида `field`
 *  - тон секции шеврона через проп `iconTone`. Только у вида `field`
 *  - начальное значение через проп `defaultValue`
 *  - недоступное состояние через проп `disabled`
 *  - текст пустого результата поиска через проп `emptyMessage`. Без поиска
 *    и при `showSearchField={false}` не собирается
 *  - чекбоксы в строках опций через проп `inlineCheckbox`. Без `multiple` чекбоксы
 *    не показываются. С `option.icon` не сочетается
 *  - подпись над триггером через проп `label`. Вид `field` включает её в имя
 *    кнопки вместе со значением. Вид `icon` собирает то же имя строкой
 *    `aria-label`, видимого текста нет
 *  - множественный выбор через проп `multiple`
 *  - обработчик изменения значения через проп `onChange`
 *  - опции списка через проп `options`
 *  - плейсхолдер пустого триггера через проп `placeholder`
 *  - плейсхолдер поля поиска через проп `searchPlaceholder`. Без пропа поле ставит
 *    `Search…`, пустая строка перебивает
 *  - поиск в панели через проп `showSearchField`
 *  - форму поля поиска через проп `searchShape`. Без пропа берётся форма списка
 *  - рамку поля поиска через проп `showSearchFieldBorder`. Без пропа рамка включена
 *  - тень рамки поля поиска через проп `showSearchFieldShadow`. Без пропа тень включена.
 *    Только вместе с рамкой
 *  - тон рамки поля поиска через проп `searchFieldBorderTone`. Только вместе с
 *    `showSearchFieldBorder`
 *  - мягкую заливку поля поиска через проп `tinted`. Без пропа заливка включена
 *  - иконку поля поиска через проп `showSearchFieldIcon`. Без пропа иконки нет
 *  - глиф иконки поля поиска через проп `searchFieldIcon`. Только при включённой иконке
 *  - позицию иконки поля поиска через проп `searchFieldIconPosition`. Только при
 *    включённой иконке
 *  - тон глифа иконки поля поиска через проп `searchFieldIconFill`. Только при
 *    включённой иконке
 *  - тон секции иконки поля поиска через проп `searchFieldIconTone`. Только при
 *    включённой иконке. В SearchField уходит через `resolveSearchFieldIconProps`,
 *    отдельным пропом `iconTone` на поле не передаётся
 *  - кнопку сброса поля поиска через проп `showSearchFieldClearButton`. Без пропа
 *    поле само показывает сброс
 *  - контролируемое значение через проп `value`
 *  - опциональный сброс выбора через проп `showClearButton`. Только у вида `field`.
 *    Базовая логика — шеврон. Кнопка сброса появляется при выборе, только когда
 *    проп включён
 *  - доступное имя кнопки сброса через проп `clearAriaLabel`. Без пропа имя —
 *    `resolveClearAriaLabel`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Listbox
 * 2. Типизировать пропсы через `ListboxProps`
 * 3. Экспортировать типы `ListboxOption`, `ListboxMultipleProps`,
 *    `ListboxAppearance`, `ListboxAppearanceProps` и `ListboxSearchProps`
 * 4. Экспортировать дефолты `DEFAULT_LISTBOX_EMPTY_MESSAGE` и
 *    `DEFAULT_LISTBOX_PLACEHOLDER`
 * 5. Выставлять `role` и `aria`-атрибуты триггера, панели и строк опций.
 *    Без поиска фокус панели — на строке, и наведение переносит заливку и фокус
 *    на одну строку. С поиском — каретка в поле, активная строка через
 *    `aria-activedescendant`. Имя поля поиска —
 *    `aria-label` из `label` или `placeholder`: в панели видимой подписи нет.
 *    Имя триггера вида `field` — `aria-labelledby` подписи и узла значения.
 *    Имя триггера вида `icon` — `resolveTriggerAccessibleName` в `aria-label`.
 *    Кнопка вида `icon` получает `active` при открытом списке и при выбранном
 *    значении на закрытом. Чекбокс в строке несёт `aria-hidden` и `aria-label`
 *    из `optionSearchText`
 * 6. Вести клавиатуру панели: стрелки, `Home` и `End` по порядку опций
 *    без смены выбора
 *
 * Потребители:
 *  - `src/ui/locale-picker/index.tsx` — собирает выбор языка на Listbox
 *  - контролы и панели настроек витрины дизайн-системы, например SizeListbox
 *    и ToneListbox — выбирают значения настроек
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { useAnchoredOpen } from '@hooks/use-anchored-open';
import { CheckIcon, ChevronDownIcon } from '@icons';
import { resolveAriaLabelledBy, resolveTriggerAccessibleName } from '@ui/a11y';
import { AnchoredPanel, bindAnchoredPanelParentWidth } from '@ui/anchored-panel';
import { DEFAULT_SHOW_BORDER, resolveBorderProps, type BorderProps } from '@ui/border';
import { Checkbox } from '@ui/checkbox';
import {
  resolveClearProps,
  type ClearProps,
  type ShowClearButtonProps,
} from '@ui/field-clear';
import { FieldLabel } from '@ui/field-label';
import {
  DEFAULT_ICON_POSITION,
  Icon,
  resolveIconShape,
  type IconPosition,
} from '@ui/icon';
import {
  OpenControlChevron,
  OpenControlClear,
  resolveEnabledOpenControlIndex,
} from '@ui/open-control';
import { getTextSize, type ShapePreset, type SizePreset } from '@ui/presets';
import {
  SearchField,
  resolveSearchFieldIconProps,
  type ShowSearchFieldBorderProps,
  type ShowSearchFieldIconProps,
} from '@ui/search-field';
import { Text } from '@ui/text';
import { type TonePreset } from '@ui/tones';

import {
  StyledListboxList,
  StyledListboxOption,
  StyledListboxPanel,
  StyledListboxRoot,
  StyledListboxSearchPanel,
  StyledListboxSearchSlot,
  StyledListboxTrigger,
  StyledListboxTriggerRow,
  StyledListboxValue,
  splitLayoutProps,
  type ListboxAppearance,
  type ListboxStyleProps,
} from './listbox.styles';

/**
 * DEFAULT_LISTBOX_APPEARANCE — задаёт вид триггера по умолчанию.
 * Используется, когда вызывающий код не передал проп `appearance`.
 */
const DEFAULT_LISTBOX_APPEARANCE: ListboxAppearance = 'field';

/**
 * DEFAULT_LISTBOX_DISABLED — задаёт режим `disabled` по умолчанию.
 * Используется, когда вызывающий код не передал проп `disabled`.
 */
const DEFAULT_LISTBOX_DISABLED = false;

/**
 * DEFAULT_LISTBOX_EMPTY_MESSAGE — задаёт текст пустого результата поиска по умолчанию.
 * Используется, когда вызывающий код не передал проп `emptyMessage`.
 */
export const DEFAULT_LISTBOX_EMPTY_MESSAGE = 'Nothing found';

/**
 * DEFAULT_LISTBOX_INLINE_CHECKBOX — задаёт режим чекбоксов в строках по умолчанию.
 * Используется, когда вызывающий код не передал проп `inlineCheckbox`.
 */
const DEFAULT_LISTBOX_INLINE_CHECKBOX = false;

/**
 * DEFAULT_LISTBOX_MULTIPLE — задаёт режим множественного выбора по умолчанию.
 * Используется, когда вызывающий код не передал проп `multiple`.
 */
const DEFAULT_LISTBOX_MULTIPLE = false;

/**
 * DEFAULT_LISTBOX_PLACEHOLDER — задаёт плейсхолдер пустого триггера по умолчанию.
 * Используется, когда вызывающий код не передал проп `placeholder`.
 */
export const DEFAULT_LISTBOX_PLACEHOLDER = 'Select…';

/**
 * DEFAULT_LISTBOX_SEARCH_DISABLED — задаёт режим `searchDisabled` по умолчанию.
 * Используется, когда вызывающий код не передал проп `searchDisabled`.
 */
const DEFAULT_LISTBOX_SEARCH_DISABLED = false;

/**
 * DEFAULT_LISTBOX_SEARCH_SHOW_BORDER — задаёт режим рамки поля поиска по умолчанию.
 * Используется, когда вызывающий код не передал проп `showSearchFieldBorder`.
 */
const DEFAULT_LISTBOX_SEARCH_SHOW_BORDER = true;

/**
 * DEFAULT_LISTBOX_SEARCH_SHOW_SHADOW — задаёт режим тени рамки поля поиска по умолчанию.
 * Используется, когда вызывающий код не передал проп `showSearchFieldShadow`.
 */
const DEFAULT_LISTBOX_SEARCH_SHOW_SHADOW = true;

/**
 * DEFAULT_LISTBOX_SEARCH_SHOW_ICON — задаёт режим показа иконки поля поиска по умолчанию.
 * Используется, когда вызывающий код не передал проп `showSearchFieldIcon`.
 */
const DEFAULT_LISTBOX_SEARCH_SHOW_ICON = false;

/**
 * DEFAULT_LISTBOX_SEARCH_SHOW_OUTLINE — задаёт режим обводки фокуса поля поиска по умолчанию.
 * Используется, когда вызывающий код не передал проп `showSearchFieldOutline`.
 */
const DEFAULT_LISTBOX_SEARCH_SHOW_OUTLINE = false;

/**
 * DEFAULT_LISTBOX_SHOW_BORDER — задаёт режим рамки вида `icon` по умолчанию.
 * Используется, когда вызывающий код не передал проп `showBorder`.
 */
const DEFAULT_LISTBOX_SHOW_BORDER = DEFAULT_SHOW_BORDER;

/**
 * DEFAULT_LISTBOX_SHOW_CLEAR_BUTTON — задаёт режим показа кнопки сброса выбора по умолчанию.
 * Используется, когда вызывающий код не передал проп `showClearButton`.
 */
const DEFAULT_LISTBOX_SHOW_CLEAR_BUTTON = false;

/**
 * DEFAULT_LISTBOX_SHOW_SEARCH — задаёт режим поиска по умолчанию.
 * Используется, когда вызывающий код не передал проп `showSearchField`.
 */
const DEFAULT_LISTBOX_SHOW_SEARCH = false;

/**
 * DEFAULT_LISTBOX_TINTED — задаёт режим мягкой заливки поля поиска по умолчанию.
 * Используется, когда вызывающий код не передал проп `tinted`.
 */
const DEFAULT_LISTBOX_TINTED = true;

/**
 * ListboxOption — представляет опцию списка Listbox.
 * Поле `icon` либо обязательно, либо запрещено. Чекбокс строки включает
 * `inlineCheckbox` на Listbox: при нём иконка опции не рисуется.
 *
 * @property disabled — включает недоступное состояние опции
 * @property icon — слот перед подписью. С `inlineCheckbox` не сочетается
 * @property label — содержимое подписи опции
 * @property searchText — дополнительный текст фильтра поиска
 * @property value — стабильный ключ опции
 */
export type ListboxOption =
  | {
      disabled?: boolean;
      icon: ReactNode;
      label: ReactNode;
      searchText?: string;
      value: string;
    }
  | {
      disabled?: boolean;
      icon?: never;
      label: ReactNode;
      searchText?: string;
      value: string;
    };

/**
 * ListboxMultipleProps — представляет пропсы множественного выбора Listbox.
 * Поле `inlineCheckbox` допустимо только вместе с `multiple`. Дефолт флага — выбор одиночный.
 *
 * @property inlineCheckbox — включает чекбоксы в строках опций
 * @property multiple — включает множественный выбор
 */
export type ListboxMultipleProps =
  | {
      inlineCheckbox?: boolean;
      multiple: true;
    }
  | {
      inlineCheckbox?: never;
      multiple?: false;
    };

/**
 * ListboxAppearanceProps — представляет пропсы стилизации триггера Listbox.
 * Рамка и тень допустимы только при `appearance: 'icon'`: вид `field` держит
 * постоянную рамку ряда-триггера. Сброс выбора и пропы шеврона допустимы только
 * у вида `field`: у вида `icon` шеврона и кнопки сброса нет. Запасной глиф
 * допустим только у вида `icon`.
 *
 * @property appearance — вид триггера
 * @property icon — запасной глиф вида `icon`
 * @property iconFill — тон глифа шеврона у вида `field`
 * @property iconPosition — позиция шеврона у вида `field`
 * @property iconTone — тон секции шеврона у вида `field`
 * @property showBorder — включает рамку триггера вида `icon`
 * @property showShadow — включает тень триггера вида `icon` при включённой рамке
 */
export type ListboxAppearanceProps =
  | ({
      appearance: 'icon';
      clearAriaLabel?: never;
      icon?: ReactNode;
      iconFill?: never;
      iconPosition?: never;
      iconTone?: never;
      showClearButton?: never;
    } & BorderProps)
  | ({
      appearance?: 'field';
      icon?: never;
      iconFill?: TonePreset;
      iconPosition?: IconPosition;
      iconTone?: TonePreset;
      showBorder?: never;
      showShadow?: never;
    } & ShowClearButtonProps);

/**
 * ListboxSearchProps — представляет пропсы поля поиска Listbox.
 * Вид поля допустим только при явном `showSearchField: true`: без пропа поля нет.
 * Рамка и иконка подмешаны из `ShowSearchFieldBorderProps` и `ShowSearchFieldIconProps`.
 * Без `searchSize` размер поля — размер списка.
 * Без `searchDisabled` поле доступно. Без `showSearchFieldOutline` обводки фокуса нет.
 *
 * @property emptyMessage — текст при пустом результате поиска. Без поиска
 *   и при `showSearchField={false}` не собирается
 * @property searchDisabled — включает недоступное состояние поля поиска
 * @property searchPlaceholder — плейсхолдер поля поиска
 * @property searchShape — форма поля поиска. Без пропа берётся форма списка
 * @property searchSize — размер поля поиска. Без пропа берётся размер списка
 * @property showSearchField — включает поле поиска в панели
 * @property showSearchFieldClearButton — включает кнопку сброса поля поиска.
 *   Без пропа поле само показывает сброс
 * @property showSearchFieldOutline — включает обводку фокуса поля поиска
 * @property tinted — включает мягкую заливку поля поиска. Без пропа заливка включена
 */
export type ListboxSearchProps =
  | {
      emptyMessage?: never;
      searchDisabled?: never;
      searchFieldBorderTone?: never;
      searchFieldIcon?: never;
      searchFieldIconFill?: never;
      searchFieldIconPosition?: never;
      searchFieldIconTone?: never;
      searchPlaceholder?: never;
      searchShape?: never;
      searchSize?: never;
      showSearchField?: false;
      showSearchFieldBorder?: never;
      showSearchFieldClearButton?: never;
      showSearchFieldIcon?: never;
      showSearchFieldOutline?: never;
      showSearchFieldShadow?: never;
      tinted?: never;
    }
  | ({
      emptyMessage?: string;
      searchDisabled?: boolean;
      searchPlaceholder?: string;
      searchShape?: ShapePreset;
      searchSize?: SizePreset;
      showSearchField: true;
      showSearchFieldClearButton?: boolean;
      showSearchFieldOutline?: boolean;
      tinted?: boolean;
    } & ShowSearchFieldBorderProps &
      ShowSearchFieldIconProps);

/**
 * ListboxProps — представляет пропсы компонента Listbox.
 *
 * @property defaultValue — начальное значение в неконтролируемом режиме
 * @property disabled — включает недоступное состояние
 * @property label — подпись над триггером
 * @property onChange — обработчик изменения значения
 * @property options — опции списка
 * @property placeholder — плейсхолдер пустого триггера
 * @property value — контролируемое значение
 */
type ListboxProps = ListboxStyleProps &
  ListboxAppearanceProps &
  ListboxMultipleProps &
  ListboxSearchProps & {
    defaultValue?: string | string[];
    disabled?: boolean;
    label?: string;
    onChange?: (value: string | string[]) => void;
    options: readonly ListboxOption[];
    placeholder?: string;
    value?: string | string[];
  } & Omit<
    ComponentPropsWithRef<'div'>,
    'className' | 'onChange' | 'style' | keyof ListboxStyleProps
  >;

/**
 * toSelectedValues — преобразует сырое значение в массив выбранных ключей.
 *
 * Как работает:
 * 1. Без значения возвращает пустой массив
 * 2. В режиме `multiple` нормализует скаляр в массив из одного ключа
 * 3. В одиночном режиме берёт первый элемент массива или сам скаляр. Пустую
 *    строку отбрасывает
 *
 * @param raw сырое значение пропа `value` или `defaultValue`
 * @param multiple признак множественного выбора
 * @returns массив выбранных ключей
 */
function toSelectedValues(
  raw: string | string[] | undefined,
  multiple: boolean
): string[] {
  if (raw === undefined) {
    return [];
  }

  if (multiple) {
    return Array.isArray(raw) ? raw : [raw];
  }

  const single = Array.isArray(raw) ? raw[0] : raw;

  return single ? [single] : [];
}

/**
 * formatMultipleTriggerLabel — возвращает подпись триггера при множественном выборе.
 *
 * Как работает:
 * 1. Собирает подписи выбранных опций
 * 2. Без выбранных возвращает `null` — триггер покажет плейсхолдер
 * 3. Для одной опции возвращает её подпись, для нескольких — счётчик
 *    вида `N selected`
 *
 * @param options опции списка
 * @param selected выбранные ключи
 * @returns подпись одной опции, счётчик выбранных или `null`
 */
function formatMultipleTriggerLabel(
  options: readonly ListboxOption[],
  selected: readonly string[]
): ReactNode {
  const labels = options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label);

  if (labels.length === 0) {
    return null;
  }

  if (labels.length === 1) {
    return labels[0];
  }

  return `${labels.length} selected`;
}

/**
 * optionSearchText — возвращает строку опции для фильтра поиска.
 *
 * @param option опция списка
 * @returns `searchText`, иначе текст подписи или ключ
 */
function optionSearchText(option: ListboxOption): string {
  if (option.searchText) {
    return option.searchText;
  }

  return typeof option.label === 'string' ? option.label : option.value;
}

/**
 * filterListboxOptions — возвращает опции, подходящие под нормализованный запрос.
 *
 * Как работает:
 * 1. Без запроса возвращает исходный перечень
 * 2. Иначе оставляет опции, чей текст содержит нормализованный запрос
 *
 * @param options опции списка
 * @param normalizedQuery нормализованная строка поиска
 * @returns отфильтрованный перечень опций
 */
function filterListboxOptions(
  options: readonly ListboxOption[],
  normalizedQuery: string
): readonly ListboxOption[] {
  if (!normalizedQuery) {
    return options;
  }

  return options.filter((option) =>
    optionSearchText(option).toLowerCase().includes(normalizedQuery)
  );
}

/**
 * resolveIconAppearanceGlyph — возвращает глиф вида `icon`.
 *
 * Как работает:
 * 1. Без выбранных отдаёт запасной глиф
 * 2. Для одной выбранной отдаёт иконку опции, иначе запасной глиф
 * 3. Для нескольких отдаёт запасной глиф, если он передан, иначе иконку первой выбранной
 *
 * @param fallback запасной глиф вида `icon`
 * @param options опции списка
 * @param selected выбранные ключи
 * @returns глиф триггера вида `icon`
 */
function resolveIconAppearanceGlyph(
  fallback: ReactNode,
  options: readonly ListboxOption[],
  selected: readonly string[]
): ReactNode {
  if (selected.length === 0) {
    return fallback;
  }

  if (selected.length === 1) {
    const option = options.find((option) => option.value === selected[0]);

    return option?.icon ?? fallback;
  }

  if (fallback != null) {
    return fallback;
  }

  return options.find((option) => option.value === selected[0])?.icon;
}

/**
 * resolveListboxValueText — возвращает текстовое значение триггера для составного имени.
 *
 * Как работает:
 * 1. Берёт строковую подпись триггера, если она есть
 * 2. Иначе берёт строковую подпись выбранной опции, `searchText` или ключ
 * 3. Без выбора возвращает плейсхолдер
 *
 * @param placeholder плейсхолдер пустого триггера
 * @param selectedOption выбранная опция одиночного режима
 * @param triggerLabel видимая подпись триггера
 * @returns текст значения для имени триггера
 */
function resolveListboxValueText(
  placeholder: string,
  selectedOption: ListboxOption | undefined,
  triggerLabel: ReactNode
): string {
  if (typeof triggerLabel === 'string' && triggerLabel.trim()) {
    return triggerLabel;
  }

  if (selectedOption) {
    if (typeof selectedOption.label === 'string' && selectedOption.label.trim()) {
      return selectedOption.label;
    }

    if (selectedOption.searchText?.trim()) {
      return selectedOption.searchText;
    }

    return selectedOption.value;
  }

  return placeholder;
}

/**
 * resolveInitialActiveIndex — возвращает индекс выбранной доступной опции,
 * иначе первой доступной.
 *
 * @param options опции списка
 * @param selectedIndex индекс выбранной опции
 * @returns индекс опции для начального фокуса или `-1`
 */
function resolveInitialActiveIndex(
  options: readonly ListboxOption[],
  selectedIndex: number
): number {
  if (selectedIndex >= 0 && !options[selectedIndex]?.disabled) {
    return selectedIndex;
  }

  return resolveEnabledOpenControlIndex(options, 0, 1);
}

/**
 * resolveIconPanelParent — возвращает предка, по ширине которого встаёт панель вида `icon`.
 * Ближний предок шире кнопки-иконки: в карточке это карточка, в ряду иконок — ряд.
 *
 * @param trigger кнопка вида `icon`
 * @returns предок шире кнопки или сама кнопка, если такого предка нет
 */
function resolveIconPanelParent(trigger: HTMLElement): HTMLElement {
  const triggerWidth = trigger.getBoundingClientRect().width;
  let node = trigger.parentElement;

  while (node) {
    if (node.getBoundingClientRect().width > triggerWidth + 1) {
      return node;
    }

    node = node.parentElement;
  }

  return trigger;
}

/**
 * Listbox — отображает выбор значения из списка опций с выпадающей панелью.
 *
 * @example
 * <Listbox
 *   label="Tone:"
 *   options={options}
 *   value={tone}
 *   onChange={setTone}
 * />
 * <Listbox showSearchField options={ICON_OPTIONS} value={icon} onChange={setIcon} />
 * <Listbox multiple inlineCheckbox options={options} value={selected} onChange={setSelected} />
 */
export function Listbox({
  appearance = DEFAULT_LISTBOX_APPEARANCE,
  borderTone,
  clearAriaLabel,
  defaultValue,
  disabled = DEFAULT_LISTBOX_DISABLED,
  emptyMessage = DEFAULT_LISTBOX_EMPTY_MESSAGE,
  icon,
  iconFill,
  iconPosition = DEFAULT_ICON_POSITION,
  iconTone,
  inlineCheckbox = DEFAULT_LISTBOX_INLINE_CHECKBOX,
  label,
  multiple = DEFAULT_LISTBOX_MULTIPLE,
  onChange,
  options,
  placeholder = DEFAULT_LISTBOX_PLACEHOLDER,
  searchDisabled = DEFAULT_LISTBOX_SEARCH_DISABLED,
  searchFieldBorderTone,
  searchFieldIcon,
  searchFieldIconFill,
  searchFieldIconPosition,
  searchFieldIconTone,
  searchPlaceholder,
  searchShape,
  searchSize,
  shape,
  showBorder = DEFAULT_LISTBOX_SHOW_BORDER,
  showClearButton = DEFAULT_LISTBOX_SHOW_CLEAR_BUTTON,
  showSearchField = DEFAULT_LISTBOX_SHOW_SEARCH,
  showSearchFieldBorder = DEFAULT_LISTBOX_SEARCH_SHOW_BORDER,
  showSearchFieldClearButton,
  showSearchFieldIcon = DEFAULT_LISTBOX_SEARCH_SHOW_ICON,
  showSearchFieldOutline = DEFAULT_LISTBOX_SEARCH_SHOW_OUTLINE,
  showSearchFieldShadow = DEFAULT_LISTBOX_SEARCH_SHOW_SHADOW,
  showShadow,
  size,
  tinted = DEFAULT_LISTBOX_TINTED,
  value,
  ...rest
}: ListboxProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const surfaceProps = { borderTone, iconTone, shape, size };
  const iconShape = resolveIconShape(shape);
  const textSizePreset = getTextSize(size);
  const isIconStart = iconPosition === 'start';
  const isIconAppearance = appearance === 'icon';
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerRowRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const triggerId = useId();
  const labelId = useId();
  const valueId = useId();
  const { handleClose, handleOpen, isOpen, panelRef } = useAnchoredOpen<HTMLElement>();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isKeyboardNavigating, setIsKeyboardNavigating] = useState(false);
  const [query, setQuery] = useState('');
  const [tabStopIndex, setTabStopIndex] = useState(-1);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [internalSelected, setInternalSelected] = useState<string[]>(() =>
    toSelectedValues(defaultValue, multiple)
  );

  const isControlled = value !== undefined;
  const selected = isControlled ? toSelectedValues(value, multiple) : internalSelected;
  const selectedValue = selected[0];
  const selectedIndex = options.findIndex((option) => option.value === selectedValue);
  const isClearVisible =
    !isIconAppearance && showClearButton && selected.length > 0 && !disabled;
  const showChevron = !isClearVisible;
  const showCheckbox = multiple && inlineCheckbox;
  const normalizedQuery = query.trim().toLowerCase();
  const visibleOptions = showSearchField
    ? filterListboxOptions(options, normalizedQuery)
    : options;
  const selectedOption = options.find((option) => option.value === selected[0]);
  const triggerLabel = multiple
    ? formatMultipleTriggerLabel(options, selected)
    : (selectedOption?.label ?? null);
  const triggerIcon = !showCheckbox ? selectedOption?.icon : undefined;
  const iconAppearanceGlyph = isIconAppearance
    ? resolveIconAppearanceGlyph(icon, options, selected)
    : undefined;
  const triggerValueText = resolveListboxValueText(
    placeholder,
    selectedOption,
    triggerLabel
  );
  const iconTriggerName = resolveTriggerAccessibleName(label, triggerValueText);

  const iconNode = showChevron && (
    <OpenControlChevron
      iconFill={iconFill}
      iconTone={iconTone}
      shape={iconShape}
      size={size}
    />
  );
  const clearNode = isClearVisible && (
    <OpenControlClear
      clearAriaLabel={clearAriaLabel}
      disabled={disabled}
      iconFill={iconFill}
      iconTone={iconTone}
      label={label}
      shape={iconShape}
      size={size}
      onClick={handleClear}
    />
  );

  /**
   * Прокручивает активную опцию в видимую область списка по ссылке на узел.
   * Срабатывает при смене `activeIndex` и открытии панели.
   */
  useLayoutEffect(() => {
    if (!isOpen || activeIndex < 0) {
      return;
    }

    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, activeIndex]);

  /**
   * У вида `icon` при открытии привязывает ширину панели к родителю кнопки.
   */
  useLayoutEffect(() => {
    if (!isIconAppearance || !isOpen) {
      return;
    }

    const panel = panelRef.current;
    const trigger = triggerRef.current;

    if (!panel || !trigger) {
      return;
    }

    return bindAnchoredPanelParentWidth(panel, resolveIconPanelParent(trigger));
  }, [isIconAppearance, isOpen, panelRef]);

  function commitSelected(next: string[]): void {
    if (!isControlled) {
      setInternalSelected(next);
    }

    onChange?.(multiple ? next : (next[0] ?? ''));
  }

  /**
   * handleClear — сбрасывает выбор и оставляет фокус на триггере этого списка.
   *
   * @param event клик по кнопке сброса
   */
  function handleClear(event: { stopPropagation: () => void }): void {
    event.stopPropagation();

    if (disabled) {
      return;
    }

    commitSelected([]);
    handleClose();
    setQuery('');
    triggerRef.current?.focus();
  }

  function handleOptionToggle(option: ListboxOption): void {
    if (disabled || option.disabled) {
      return;
    }

    if (multiple) {
      const next = selected.includes(option.value)
        ? selected.filter((optionValue) => optionValue !== option.value)
        : [...selected, option.value];
      commitSelected(next);

      return;
    }

    commitSelected([option.value]);
    handleClose();
    setQuery('');
  }

  function openPanel(): void {
    if (disabled) {
      return;
    }

    const initialIndex = resolveInitialActiveIndex(options, selectedIndex);

    setQuery('');
    setActiveIndex(initialIndex);
    setTabStopIndex(initialIndex);
    handleOpen();
  }

  function handleTriggerToggle(): void {
    if (isOpen) {
      handleClose();

      return;
    }

    openPanel();
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (event.key === 'Escape') {
      handleClose();
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTriggerToggle();
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openPanel();
      setIsKeyboardNavigating(true);
    }
  }

  function handleOpenFocus(): void {
    if (showSearchField) {
      searchInputRef.current?.focus();

      return;
    }

    const targetIndex =
      tabStopIndex >= 0 && !options[tabStopIndex]?.disabled
        ? tabStopIndex
        : resolveInitialActiveIndex(options, selectedIndex);

    optionRefs.current[targetIndex]?.focus();
  }

  if (!isOpen && isKeyboardNavigating) {
    setIsKeyboardNavigating(false);
  }

  function moveActive(step: -1 | 1): void {
    const from =
      activeIndex >= 0 ? activeIndex + step : step === 1 ? 0 : visibleOptions.length - 1;
    const nextIndex = resolveEnabledOpenControlIndex(visibleOptions, from, step);

    if (nextIndex < 0) {
      return;
    }

    setActiveIndex(nextIndex);

    if (!showSearchField) {
      optionRefs.current[nextIndex]?.focus();
    }
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLElement>): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsKeyboardNavigating(true);
      moveActive(1);

      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsKeyboardNavigating(true);
      moveActive(-1);

      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setIsKeyboardNavigating(true);
      const nextIndex = resolveEnabledOpenControlIndex(visibleOptions, 0, 1);

      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);

        if (!showSearchField) {
          optionRefs.current[nextIndex]?.focus();
        }
      }

      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setIsKeyboardNavigating(true);
      const nextIndex = resolveEnabledOpenControlIndex(
        visibleOptions,
        visibleOptions.length - 1,
        -1
      );

      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);

        if (!showSearchField) {
          optionRefs.current[nextIndex]?.focus();
        }
      }

      return;
    }

    if (showSearchField && event.key === 'Enter') {
      event.preventDefault();
      const option = visibleOptions[activeIndex];

      if (option) {
        handleOptionToggle(option);
      }
    }
  }

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextQuery = event.target.value;
    const nextVisible = filterListboxOptions(options, nextQuery.trim().toLowerCase());

    setQuery(nextQuery);
    setActiveIndex(Math.max(0, resolveEnabledOpenControlIndex(nextVisible, 0, 1)));
  }

  function handlePanelMouseMove(): void {
    if (isKeyboardNavigating) {
      setIsKeyboardNavigating(false);
    }
  }

  function renderOption(option: ListboxOption, optionIndex: number): ReactNode {
    const isSelected = selected.includes(option.value);
    const isOptionDisabled = Boolean(disabled || option.disabled);
    const isActive = optionIndex === activeIndex && !isOptionDisabled;
    const isTabStop =
      !showSearchField && optionIndex === tabStopIndex && !isOptionDisabled;
    const optionIcon = !showCheckbox ? option.icon : undefined;
    const hasOptionIcon = Boolean(optionIcon);

    return (
      <StyledListboxOption
        aria-disabled={isOptionDisabled ? true : undefined}
        aria-selected={isSelected}
        data-active={isActive ? true : undefined}
        data-checkbox={showCheckbox ? true : undefined}
        data-icon={hasOptionIcon ? true : undefined}
        id={`${listId}-${option.value}`}
        key={option.value}
        ref={(node) => {
          optionRefs.current[optionIndex] = node;
        }}
        role="option"
        shape={shape}
        size={size}
        tabIndex={isTabStop ? 0 : -1}
        onClick={() => {
          if (isOptionDisabled) {
            return;
          }

          setActiveIndex(optionIndex);

          if (!showSearchField) {
            optionRefs.current[optionIndex]?.focus();
          }

          handleOptionToggle(option);
        }}
        onFocus={() => {
          if (!isOptionDisabled) {
            setTabStopIndex(optionIndex);
          }
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') {
            return;
          }

          event.preventDefault();

          if (isOptionDisabled) {
            return;
          }

          handleOptionToggle(option);
        }}
        onMouseMove={() => {
          if (isOptionDisabled) {
            return;
          }

          setActiveIndex(optionIndex);

          if (!showSearchField) {
            optionRefs.current[optionIndex]?.focus({ preventScroll: true });
          }
        }}
      >
        {showCheckbox && (
          <Checkbox
            aria-hidden
            aria-label={optionSearchText(option)}
            checked={isSelected}
            inverted
            readOnly
            size={size}
            tabIndex={-1}
          />
        )}
        {hasOptionIcon && (
          <Icon showHover={false} size={size}>
            {optionIcon}
          </Icon>
        )}
        <Text ellipsis size={textSizePreset}>
          {option.label}
        </Text>
        {!showCheckbox && isSelected && (
          <Icon
            iconFill={isActive ? undefined : 'primary'}
            marginInlineStart={hasOptionIcon ? 'auto' : undefined}
            position="relative"
            showHover={false}
            size={size}
            zIndex={1}
          >
            <CheckIcon />
          </Icon>
        )}
      </StyledListboxOption>
    );
  }

  const panelOptions = visibleOptions.map((option, optionIndex) =>
    renderOption(option, optionIndex)
  );
  const activeOption = visibleOptions[activeIndex];
  const activeOptionId =
    activeOption !== undefined ? `${listId}-${activeOption.value}` : undefined;
  const listboxAria = {
    'aria-label': label || placeholder,
    'aria-multiselectable': multiple || undefined,
    id: listId,
  };
  const triggerAria = {
    'aria-controls': listId,
    'aria-expanded': isOpen,
    'aria-haspopup': 'listbox' as const,
    disabled,
    id: triggerId,
  };
  const fieldTrigger = (
    <StyledListboxTriggerRow
      data-has-clear={isClearVisible ? true : undefined}
      data-open={isOpen ? 'true' : undefined}
      ref={triggerRowRef}
      {...surfaceProps}
    >
      {isIconStart && clearNode}

      <StyledListboxTrigger
        {...triggerAria}
        aria-labelledby={resolveAriaLabelledBy(label ? labelId : undefined, valueId)}
        ref={triggerRef}
        type="button"
        {...surfaceProps}
        onClick={handleTriggerToggle}
        onKeyDown={handleTriggerKeyDown}
      >
        {iconPosition === 'start' && iconNode}
        <StyledListboxValue id={valueId} size={size}>
          {Boolean(triggerIcon) && (
            <Icon showHover={false} size={size}>
              {triggerIcon}
            </Icon>
          )}
          <Text ellipsis size={textSizePreset} tone={triggerLabel ? undefined : 'muted'}>
            {triggerLabel ?? placeholder}
          </Text>
        </StyledListboxValue>
        {iconPosition === 'end' && iconNode}
      </StyledListboxTrigger>

      {!isIconStart && clearNode}
    </StyledListboxTriggerRow>
  );

  const iconBorderProps = resolveBorderProps(showBorder, borderTone, showShadow);
  const iconTrigger = (
    <Icon
      {...triggerAria}
      active={isOpen || selected.length > 0}
      aria-label={iconTriggerName}
      as="button"
      ref={triggerRef}
      shape={iconShape}
      size={size}
      {...iconBorderProps}
      onClick={handleTriggerToggle}
      onKeyDown={handleTriggerKeyDown}
    >
      {iconAppearanceGlyph ?? <ChevronDownIcon />}
    </Icon>
  );

  const searchFieldBorderProps = resolveBorderProps(
    showSearchFieldBorder,
    searchFieldBorderTone,
    showSearchFieldShadow
  );
  const searchFieldIconProps = resolveSearchFieldIconProps(
    showSearchFieldIcon,
    searchFieldIcon,
    searchFieldIconPosition,
    searchFieldIconTone
  );
  const searchFieldClearProps: ClearProps =
    showSearchFieldClearButton === undefined
      ? {}
      : resolveClearProps(showSearchFieldClearButton);

  const searchPanel = (
    <StyledListboxSearchPanel
      appearance={appearance}
      ref={(node) => {
        panelRef.current = node;
      }}
      shape={shape}
      size={size}
      onKeyDown={handleListKeyDown}
    >
      <StyledListboxSearchSlot>
        <SearchField
          aria-activedescendant={activeOptionId}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded
          aria-label={label || placeholder}
          disabled={searchDisabled}
          iconFill={searchFieldIconFill}
          placeholder={searchPlaceholder}
          ref={searchInputRef}
          role="combobox"
          shape={searchShape ?? shape}
          size={searchSize ?? size}
          tinted={tinted}
          value={query}
          {...searchFieldBorderProps}
          {...searchFieldClearProps}
          {...searchFieldIconProps}
          showOutline={showSearchFieldOutline}
          onChange={handleQueryChange}
          onClear={() => setQuery('')}
        />
      </StyledListboxSearchSlot>
      <StyledListboxList {...listboxAria} role="listbox" size={size}>
        {visibleOptions.length === 0 && (
          <Text
            as="li"
            paddingBlock={8}
            placeSelf="center"
            role="presentation"
            size={textSizePreset}
            tone="muted"
          >
            {emptyMessage}
          </Text>
        )}
        {panelOptions}
      </StyledListboxList>
    </StyledListboxSearchPanel>
  );

  const optionsPanel = (
    <StyledListboxPanel
      {...listboxAria}
      appearance={appearance}
      data-keyboard-navigating={isKeyboardNavigating ? true : undefined}
      ref={(node) => {
        panelRef.current = node;
      }}
      role="listbox"
      shape={shape}
      size={size}
      onKeyDown={handleListKeyDown}
      onMouseMove={handlePanelMouseMove}
    >
      {panelOptions}
    </StyledListboxPanel>
  );

  return (
    <StyledListboxRoot
      appearance={appearance}
      data-disabled={disabled ? true : undefined}
      ref={rootRef}
      {...layoutProps}
      {...restProps}
    >
      {!isIconAppearance && (
        <FieldLabel htmlFor={triggerId} id={labelId}>
          {label}
        </FieldLabel>
      )}
      {isIconAppearance ? iconTrigger : fieldTrigger}

      {/* Вид `field` якорит панель на ряд триггера, не на корень с подписью.
          Вид `icon` якорит на кнопку. */}
      <AnchoredPanel
        anchorRef={isIconAppearance ? triggerRef : triggerRowRef}
        dismissZoneRefs={[rootRef, panelRef]}
        open={isOpen}
        panelRef={panelRef}
        returnFocusRef={triggerRef}
        onDismiss={handleClose}
        onOpenFocus={handleOpenFocus}
      >
        {showSearchField ? searchPanel : optionsPanel}
      </AnchoredPanel>
    </StyledListboxRoot>
  );
}

export type { ListboxAppearance };
