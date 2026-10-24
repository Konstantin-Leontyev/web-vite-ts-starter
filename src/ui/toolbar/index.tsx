/**
 * Файл: `src/ui/toolbar/index.tsx`
 * Предоставляет компонент Toolbar для отображения панели инструментов с рядом
 * иконочных действий и полем поиска.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - форму через проп `shape`. Капсула `pill` и включённый поиск вместе не собираются.
 *    Без пропа поиск есть, поэтому одна капсула без явного `showSearchField: false`
 *    тоже не собирается. Скруглённая форма `rounded` с поиском законна
 *  - заливку через проп `background`
 *  - рамку через проп `showBorder`
 *  - тень через проп `showShadow`
 *  - тон рамки через проп `borderTone`
 *  - рамку действий через проп `showActionBorder`
 *  - тень действий через проп `showActionShadow`
 *  - ряд действий через проп `actions`. Элемент — иконочное действие или слот
 *    `control`
 *  - поле поиска через проп `showSearchField`. Без пропа поле есть.
 *    `showSearchField={false}` гасит хвост поиска, в том числе `searchPlaceholder`
 *  - обработчик изменения текста поиска через проп `onSearchChange`. Панель
 *    хранит текст сама. При выключенном поиске обработчик не собирается.
 *    Витрина его не подключает
 *  - тон рамки поля поиска через проп `searchFieldBorderTone`
 *  - недоступное состояние поля поиска через проп `searchDisabled`
 *  - глиф лупы через проп `searchFieldIcon`
 *  - тон глифа лупы через проп `searchFieldIconFill`. Только при `showSearchFieldIcon: true`
 *  - позицию лупы через проп `searchFieldIconPosition`
 *  - тон секции лупы через проп `searchFieldIconTone`. В SearchField уходит через
 *    `resolveSearchFieldIconProps`, отдельным пропом `iconTone` на поле
 *    не передаётся
 *  - плейсхолдер поля поиска через проп `searchPlaceholder`
 *  - форму поля поиска через проп `searchShape`. Без пропа берётся форма панели
 *  - рамку поля поиска через проп `showSearchFieldBorder`. Без пропа рамка включена
 *  - кнопку сброса поля поиска через проп `showSearchFieldClearButton`. Без пропа
 *    сброс есть: пропущенное значение становится `true` в деструктуризации,
 *    до `resolveClearProps`
 *  - лупу поля поиска через проп `showSearchFieldIcon`. Без пропа лупы нет
 *  - обводку фокуса поля поиска через проп `showSearchFieldOutline`. Без пропа
 *    обводка есть
 *  - тень поля поиска через проп `showSearchFieldShadow`. Без пропа тень есть.
 *    При `showSearchFieldBorder={false}` не собирается
 *  - размер поля поиска через проп `searchSize`. Без пропа берётся размер окон
 *  - мягкую заливку поля поиска через проп `tinted`. Без пропа заливка включена
 *  - доступное имя для скринридера через проп `ariaLabel`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Toolbar и функцию `resolveToolbarFieldSize`
 * 2. Типизировать пропсы через `ToolbarProps`
 * 3. Выставлять `role="toolbar"` и `aria-label` из пропа `ariaLabel` и включать
 *    roving focus у ряда действий
 * 4. Схлопывать поле поиска по ширине родителя. Порог — ширина ряда вместе
 *    с иконкой поиска. Ширина родителя — content-box из `ResizeObserver`, без
 *    padding родителя. При ширине не меньше порога иконка встаёт на индекс 0
 *    и поле прячется. Клик, Enter или пробел по лупе ставит курсор в поле.
 *    Escape в поле сворачивает строку и возвращает фокус на лупу. Если порог
 *    пересечён, пока курсор уже в поле, строка остаётся открытой и фокус не
 *    падает на страницу. Пока ширина родителя неизвестна или меньше порога,
 *    иконки в ряду нет и поле остаётся второй строкой. У скрытой строки `inert`.
 *    Пока ряд не сжат, флаг раскрытия выключен
 *
 * Потребители:
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { flushSync } from 'react-dom';

import { SearchIcon } from '@icons';
import { resolveBorderProps, type ShowActionBorderProps } from '@ui/border';
import { resolveClearProps, type ClearProps } from '@ui/field-clear';
import {
  Icon,
  resolveIconShape,
  type IconShapePreset,
  type IconSizePreset,
} from '@ui/icon';
import { IconButtonRow, type IconButtonRowAction } from '@ui/icon-button-row';
import { DEFAULT_SIZE_PRESET, type ShapePreset, type SizePreset } from '@ui/presets';
import { assignRef } from '@ui/ref';
import {
  SearchField,
  resolveSearchFieldIconProps,
  type ShowSearchFieldBorderProps,
  type ShowSearchFieldIconProps,
} from '@ui/search-field';
import { type DistributiveOmit } from '@ui/type-utils';

import {
  StyledToolbar,
  StyledToolbarSearchAction,
  StyledToolbarSearchClip,
  StyledToolbarSearchRow,
  resolveToolbarActionRowInlineSizePx,
  resolveToolbarFieldSize,
  type ToolbarStyleProps,
} from './toolbar.styles';

/**
 * ToolbarSearchProps — представляет пропсы поля поиска Toolbar.
 * Без пропа поиск есть. `showSearchField={false}` гасит хвост поиска, в том числе
 * `searchPlaceholder`. Рамка и лупа подмешаны из `ShowSearchFieldBorderProps`
 * и `ShowSearchFieldIconProps`. `shape` снят со стилевого пересечения и живёт
 * в ветках поиска. Капсула `pill` и включённый поиск вместе не собираются,
 * в том числе одна капсула без явного `showSearchField: false`.
 * Скруглённая форма `rounded` с поиском законна.
 *
 * @property onSearchChange — обработчик изменения текста поиска. При выключенном
 *   поиске не собирается. Витрина его не подключает
 * @property searchDisabled — включает недоступное состояние поля поиска
 * @property searchPlaceholder — плейсхолдер поля поиска. При `showSearchField={false}`
 *   не собирается
 * @property searchShape — форма поля поиска. Без пропа берётся форма панели
 * @property searchSize — размер поля. Без пропа берётся размер окон
 * @property shape — форма панели. Капсула `pill` только при `showSearchField: false`
 * @property showSearchField — включает поле поиска. Без пропа поле есть
 * @property showSearchFieldClearButton — включает кнопку сброса. Без пропа сброс есть
 * @property showSearchFieldOutline — включает обводку фокуса. Без пропа обводка есть
 * @property tinted — включает мягкую заливку поля. Без пропа заливка включена
 */
type ToolbarSearchProps =
  | ({
      onSearchChange?: (query: string) => void;
      searchDisabled?: boolean;
      searchPlaceholder?: string;
      searchShape?: ShapePreset;
      searchSize?: SizePreset;
      shape?: Exclude<ShapePreset, 'pill'>;
      showSearchField?: true;
      showSearchFieldClearButton?: boolean;
      showSearchFieldOutline?: boolean;
      tinted?: boolean;
    } & ShowSearchFieldBorderProps &
      ShowSearchFieldIconProps)
  | {
      onSearchChange?: never;
      searchDisabled?: never;
      searchFieldBorderTone?: never;
      searchFieldIcon?: never;
      searchFieldIconFill?: never;
      searchFieldIconPosition?: never;
      searchFieldIconTone?: never;
      searchPlaceholder?: never;
      searchShape?: never;
      searchSize?: never;
      shape?: ShapePreset;
      showSearchField: false;
      showSearchFieldBorder?: never;
      showSearchFieldClearButton?: never;
      showSearchFieldIcon?: never;
      showSearchFieldOutline?: never;
      showSearchFieldShadow?: never;
      tinted?: never;
    };

/**
 * ToolbarProps — представляет пропсы компонента Toolbar.
 *
 * @property actions — ряд действий. Элемент — иконочная кнопка или слот `control`
 * @property ariaLabel — доступное имя для скринридера
 */
type ToolbarProps = {
  actions: IconButtonRowAction[];
  ariaLabel: string;
} & ShowActionBorderProps &
  ToolbarSearchProps &
  DistributiveOmit<ToolbarStyleProps, 'shape' | 'showSearchField'> &
  Omit<
    ComponentPropsWithRef<'div'>,
    'aria-label' | 'className' | 'role' | 'style' | keyof ToolbarStyleProps
  >;

/**
 * TOOLBAR_SEARCH_ARIA_LABEL — задаёт доступное имя поля поиска панели.
 */
const TOOLBAR_SEARCH_ARIA_LABEL = 'Search';

/**
 * TOOLBAR_SEARCH_ROW_INDEX — задаёт индекс иконки поиска в ряду действий.
 * Иконка занимает первое место ряда, перед действиями вызывающего кода.
 */
const TOOLBAR_SEARCH_ROW_INDEX = 0;

/**
 * ToolbarCollapsibleRow — представляет действие, которое встаёт в ряд при схлопывании.
 *
 * @property action — действие ряда
 * @property index — индекс вставки в ряд действий
 */
type ToolbarCollapsibleRow = {
  action: IconButtonRowAction;
  index: number;
};

/**
 * ToolbarSearchActionProps — представляет пропсы иконки поиска в ряду Toolbar.
 *
 * @property active — включает раскрытое поле поиска
 * @property iconShape — форма окна иконки
 * @property onClick — обработчик клика по иконке поиска
 * @property showBorder — включает рамку окна
 * @property showShadow — включает тень окна при включённой рамке
 * @property size — размер окна иконки
 */
type ToolbarSearchActionProps = {
  active: boolean;
  iconShape: IconShapePreset;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  showBorder?: boolean;
  showShadow?: boolean;
  size?: IconSizePreset;
} & Pick<
  ComponentPropsWithRef<'button'>,
  'aria-controls' | 'aria-expanded' | 'aria-label' | 'ref'
>;

/**
 * resolveToolbarCollapsibleRows — возвращает иконку поиска для вставки в ряд.
 * Без поля поиска ряд не получает иконку.
 *
 * @param showSearchField включает поле поиска
 * @param searchAction действие иконки поиска
 * @returns перечень из иконки на индексе `TOOLBAR_SEARCH_ROW_INDEX` или пустой перечень
 */
function resolveToolbarCollapsibleRows(
  showSearchField: boolean,
  searchAction: IconButtonRowAction
): readonly ToolbarCollapsibleRow[] {
  if (!showSearchField) {
    return [];
  }

  return [{ action: searchAction, index: TOOLBAR_SEARCH_ROW_INDEX }];
}

/**
 * resolveResizeObserverContentInlineSizePx — возвращает ширину content-box родителя в px.
 * Берёт `inlineSize` из `contentBoxSize`, иначе ширину `contentRect`. Padding родителя
 * в эту ширину не входит.
 *
 * @param entry запись `ResizeObserver`
 * @returns ширина content-box в px
 */
function resolveResizeObserverContentInlineSizePx(entry: ResizeObserverEntry): number {
  return entry.contentBoxSize[0]?.inlineSize ?? entry.contentRect.width;
}

/**
 * insertToolbarCollapsibleActions — вставляет сворачиваемые действия в ряд по их индексам.
 *
 * Как работает:
 * 1. Копирует исходный ряд
 * 2. Сортирует вставки по индексу и ставит каждую в свою позицию, не дальше конца ряда
 *
 * @param actions исходный ряд действий
 * @param rows сворачиваемые действия с индексами
 * @returns ряд с вставленными действиями
 */
function insertToolbarCollapsibleActions(
  actions: readonly IconButtonRowAction[],
  rows: readonly ToolbarCollapsibleRow[]
): IconButtonRowAction[] {
  const next = [...actions];

  for (const row of [...rows].sort((row, other) => row.index - other.index)) {
    const index = Math.min(Math.max(row.index, 0), next.length);

    next.splice(index, 0, row.action);
  }

  return next;
}

/**
 * ToolbarSearchAction — отображает иконку поиска в ряду действий.
 *
 * @example
 * <ToolbarSearchAction
 *   active={isSearchOpen}
 *   aria-label="Search"
 *   iconShape="round"
 *   onClick={handleSearchToggle}
 * />
 */
function ToolbarSearchAction({
  active,
  'aria-controls': ariaControls,
  'aria-expanded': ariaExpanded,
  'aria-label': ariaLabel,
  iconShape,
  onClick,
  ref,
  showBorder,
  showShadow,
  size,
}: ToolbarSearchActionProps) {
  const borderProps = resolveBorderProps(Boolean(showBorder), undefined, showShadow);

  return (
    <StyledToolbarSearchAction>
      <Icon
        active={active}
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        aria-label={ariaLabel}
        as="button"
        ref={ref}
        shape={iconShape}
        size={size}
        onClick={onClick}
        {...borderProps}
      >
        <SearchIcon />
      </Icon>
    </StyledToolbarSearchAction>
  );
}

/**
 * Toolbar — отображает панель инструментов с рядом иконочных действий и полем поиска.
 *
 * @example
 * <Toolbar
 *   actions={[{ ariaLabel: 'Download', icon: <DownloadIcon />, onClick: handleDownload }]}
 *   ariaLabel="Toolbar"
 * />
 */
function Toolbar({
  actions,
  ariaLabel,
  onSearchChange,
  ref,
  searchDisabled = false,
  searchFieldBorderTone,
  searchFieldIcon,
  searchFieldIconFill,
  searchFieldIconPosition,
  searchFieldIconTone,
  searchPlaceholder,
  searchShape,
  searchSize,
  shape,
  showActionBorder,
  showActionShadow,
  showSearchField = true,
  showSearchFieldBorder = true,
  showSearchFieldClearButton = true,
  showSearchFieldIcon = false,
  showSearchFieldOutline = true,
  showSearchFieldShadow = true,
  size,
  tinted = true,
  ...rest
}: ToolbarProps) {
  const [isQueryFocused, setIsQueryFocused] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [parentInlineSize, setParentInlineSize] = useState<null | number>(null);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement | null>(null);
  const searchActionRef = useRef<HTMLButtonElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const shouldFocusQueryRef = useRef(false);
  const searchFieldId = useId();
  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      assignRef(ref, node);
    },
    [ref]
  );

  /**
   * Следит за content-box родителя: порог схлопывания считается от этой ширины,
   * padding родителя в неё не входит.
   */
  useLayoutEffect(() => {
    const parent = rootRef.current?.parentElement;

    if (!(parent instanceof HTMLElement)) {
      return;
    }

    const observedParent = parent;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry || entry.target !== observedParent) {
        return;
      }

      const next = resolveResizeObserverContentInlineSizePx(entry);

      flushSync(() => {
        setParentInlineSize((current) => (current === next ? current : next));
      });
    });

    resizeObserver.observe(observedParent, { box: 'content-box' });

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  function updateQuery(next: string): void {
    setQuery(next);
    onSearchChange?.(next);
  }

  function handleClear(): void {
    updateQuery('');
  }

  function handleQueryBlur(): void {
    setIsQueryFocused(false);
  }

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>): void {
    updateQuery(event.target.value);
  }

  function handleQueryFocus(): void {
    setIsQueryFocused(true);
  }

  function handleQueryKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key !== 'Escape' || !isSearchOpen) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    setIsSearchOpen(false);
    searchActionRef.current?.focus();
  }

  function handleSearchToggle(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();

    if (isSearchOpen) {
      setIsSearchOpen(false);

      return;
    }

    shouldFocusQueryRef.current = true;
    setIsSearchOpen(true);
  }

  const actionShape = resolveIconShape(shape);
  const iconSize = size ?? DEFAULT_SIZE_PRESET;
  const searchAction: IconButtonRowAction = {
    control: (
      <ToolbarSearchAction
        active={isSearchOpen}
        aria-controls={searchFieldId}
        aria-expanded={isSearchOpen}
        aria-label={TOOLBAR_SEARCH_ARIA_LABEL}
        iconShape={actionShape}
        ref={searchActionRef}
        onClick={handleSearchToggle}
      />
    ),
  };
  const collapsibleRows = resolveToolbarCollapsibleRows(showSearchField, searchAction);
  const requiredInlineSizePx = resolveToolbarActionRowInlineSizePx(
    actions.length,
    collapsibleRows.length,
    iconSize,
    rest
  );
  const isCollapsed =
    collapsibleRows.length > 0 &&
    parentInlineSize !== null &&
    parentInlineSize >= requiredInlineSizePx;

  useLayoutEffect(() => {
    if (!shouldFocusQueryRef.current) {
      return;
    }

    shouldFocusQueryRef.current = false;

    if (!isSearchOpen) {
      return;
    }

    searchInputRef.current?.focus();
  }, [isCollapsed, isSearchOpen]);

  if (!isCollapsed && isSearchOpen) {
    setIsSearchOpen(false);
  } else if (isCollapsed && isQueryFocused && !isSearchOpen) {
    setIsSearchOpen(true);
  }

  if (!showSearchField && isQueryFocused) {
    setIsQueryFocused(false);
  }

  const isSearchFieldVisible = showSearchField && (!isCollapsed || isSearchOpen);
  const rowActions = isCollapsed
    ? insertToolbarCollapsibleActions(actions, collapsibleRows)
    : actions;
  const actionBorderProps = resolveBorderProps(
    showActionBorder ?? false,
    undefined,
    showActionShadow
  );
  const fieldSize =
    searchSize ?? (size === undefined ? undefined : resolveToolbarFieldSize(size));
  const searchBorderProps = resolveBorderProps(
    showSearchFieldBorder,
    searchFieldBorderTone,
    showSearchFieldShadow
  );
  const searchIconProps = resolveSearchFieldIconProps(
    showSearchFieldIcon,
    searchFieldIcon,
    searchFieldIconPosition,
    searchFieldIconTone
  );
  const searchClearProps: ClearProps = resolveClearProps(showSearchFieldClearButton);

  return (
    <StyledToolbar
      aria-label={ariaLabel}
      ref={setRootRef}
      role="toolbar"
      shape={shape}
      showSearchField={isSearchFieldVisible}
      size={size}
      {...rest}
    >
      <IconButtonRow
        actions={rowActions}
        justifySelf="center"
        rovingFocus
        shape={actionShape}
        size={size}
        {...actionBorderProps}
      />
      {showSearchField && (
        <StyledToolbarSearchRow
          collapsed={isCollapsed}
          inert={isSearchFieldVisible ? undefined : true}
          visible={isSearchFieldVisible}
        >
          <StyledToolbarSearchClip visible={isSearchFieldVisible}>
            <SearchField
              aria-label={TOOLBAR_SEARCH_ARIA_LABEL}
              disabled={searchDisabled}
              iconFill={showSearchFieldIcon ? searchFieldIconFill : undefined}
              id={searchFieldId}
              placeholder={
                searchPlaceholder?.trim() !== '' ? searchPlaceholder : undefined
              }
              ref={searchInputRef}
              shape={searchShape ?? shape}
              showOutline={showSearchFieldOutline}
              size={fieldSize}
              tinted={tinted}
              value={query}
              onBlur={handleQueryBlur}
              onChange={handleQueryChange}
              onClear={handleClear}
              onFocus={handleQueryFocus}
              onKeyDown={handleQueryKeyDown}
              {...searchBorderProps}
              {...searchClearProps}
              {...searchIconProps}
            />
          </StyledToolbarSearchClip>
        </StyledToolbarSearchRow>
      )}
    </StyledToolbar>
  );
}

/* eslint-disable react-refresh/only-export-components -- размер поля поиска для витрины */
export { Toolbar, resolveToolbarFieldSize };
