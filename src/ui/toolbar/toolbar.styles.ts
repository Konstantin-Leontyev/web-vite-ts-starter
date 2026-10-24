/**
 * Файл: `src/ui/toolbar/toolbar.styles.ts`
 * Определяет внешний вид компонента Toolbar.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ToolbarStyleProps`
 * 2. Хранить внутренний отступ поверхности в `TOOLBAR_PADDING` и отступ рядов
 *    в `TOOLBAR_ROW_GAP`
 * 3. Предоставить функции `resolveToolbarActionRowInlineSizePx` и
 *    `resolveToolbarFieldSize`
 * 4. Предоставить styled-узлы `StyledToolbar`, `StyledToolbarSearchAction`,
 *    `StyledToolbarSearchRow` и `StyledToolbarSearchClip`
 *
 * Потребители:
 *  - `src/ui/toolbar/index.tsx` — собирает компонент Toolbar
 */

import styled from 'styled-components';

import {
  BORDER_PROP_NAMES,
  DEFAULT_SHOW_BORDER,
  DEFAULT_SHOW_SHADOW,
  getBorderStyles,
  type BorderProps,
} from '@ui/border';
import { getIconSize, type IconSizePreset } from '@ui/icon';
import { ICON_BUTTON_ROW_COLUMN_GAP } from '@ui/icon-button-row';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { MOTION_CONTROL_DURATION, getTransitionStyles } from '@ui/motion';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  resolveBlockRadius,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import {
  getSpacingValue,
  resolvePaddingEdge,
  type SpacingProps,
  type SpacingValue,
} from '@ui/spacing';
import {
  DEFAULT_SURFACE_BACKGROUND,
  getSurfaceBackgroundColor,
  type SurfaceBackgroundPreset,
} from '@ui/surface';
import { getTheme, type AppTheme } from '@ui/theme';

/**
 * ToolbarStyleProps — представляет пропсы стилизации Toolbar и layout-пропсы.
 *
 * @property background — заливка панели инструментов
 * @property shape — форма панели
 * @property showSearchField — включает вторую строку поля поиска в раскладке поверхности
 * @property size — размер окна действия
 */
export type ToolbarStyleProps = LayoutProps &
  BorderProps & {
    background?: SurfaceBackgroundPreset;
    shape?: ShapePreset;
    showSearchField?: boolean;
    size?: IconSizePreset;
  };

/**
 * TOOLBAR_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Toolbar.
 */
const TOOLBAR_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  ...BORDER_PROP_NAMES,
  'background',
  'shape',
  'showSearchField',
  'size',
]);

/**
 * TOOLBAR_PADDING — задаёт внутренний отступ поверхности панели инструментов.
 */
const TOOLBAR_PADDING: SpacingValue = 8;

/**
 * TOOLBAR_ROW_GAP — задаёт отступ между рядом действий и полем поиска.
 */
const TOOLBAR_ROW_GAP: SpacingValue = 8;

/**
 * resolveToolbarActionRowInlineSizePx — возвращает ширину ряда действий в px.
 * В ширину входят окна, промежутки между ними и боковые отступы панели.
 * Используется в `src/ui/toolbar/index.tsx` как порог схлопывания поля поиска.
 *
 * @param actionCount число действий вызывающего кода
 * @param collapsibleCount число сворачиваемых иконок
 * @param size размер окна действия
 * @param padding spacing-пропсы панели
 * @returns ширина ряда в px
 */
export function resolveToolbarActionRowInlineSizePx(
  actionCount: number,
  collapsibleCount: number,
  size: IconSizePreset,
  padding: SpacingProps
): number {
  const iconCount = actionCount + collapsibleCount;

  return (
    iconCount * getIconSize(size) +
    Math.max(iconCount - 1, 0) * ICON_BUTTON_ROW_COLUMN_GAP +
    resolvePaddingEdge(padding, 'inlineStart', TOOLBAR_PADDING) +
    resolvePaddingEdge(padding, 'inlineEnd', TOOLBAR_PADDING)
  );
}

/**
 * resolveToolbarFieldSize — возвращает размер поля поиска по размеру окон действий.
 * `tiny` у поля нет: ближайший размер ряда — `small`.
 *
 * @param size размер окна действия
 * @returns размер для пропа `size` поля поиска
 */
export function resolveToolbarFieldSize(size: IconSizePreset): SizePreset {
  return size === 'tiny' ? 'small' : size;
}

/**
 * resolveToolbarBlockRadius — возвращает скругление поверхности панели по `shape`
 * и `size`.
 * Для `pill` высота — окно действия и отступы `blockStart` и `blockEnd`.
 * При поле поиска к высоте добавляются само поле и `TOOLBAR_ROW_GAP`.
 * Без `padding*` оба отступа равны `TOOLBAR_PADDING`.
 *
 * @param shape форма панели
 * @param size размер окна действия
 * @param props spacing-пропсы панели
 * @param showSearchField включает поле поиска в высоту `pill`
 * @returns значение для CSS-свойства `border-radius`
 */
function resolveToolbarBlockRadius(
  shape: ShapePreset,
  size: IconSizePreset,
  props: SpacingProps,
  showSearchField: boolean
): string {
  const padding = `${getSpacingValue(
    resolvePaddingEdge(props, 'blockStart', TOOLBAR_PADDING)
  )} + ${getSpacingValue(resolvePaddingEdge(props, 'blockEnd', TOOLBAR_PADDING))}`;
  const searchRow = showSearchField
    ? ` + ${getMinBlockSize(resolveToolbarFieldSize(size))} + ${getSpacingValue(TOOLBAR_ROW_GAP)}`
    : '';
  const surfaceBlockSize = `calc(${getSpacingValue(getIconSize(size))}${searchRow} + ${padding})`;

  return resolveBlockRadius(shape, surfaceBlockSize);
}

/**
 * getToolbarStyles — возвращает CSS-правила для корня `StyledToolbar`: заливку,
 * рамку с тенью и скругление поверхности.
 *
 * @param props пропсы стилизации Toolbar и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getToolbarStyles(props: ToolbarStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    background = DEFAULT_SURFACE_BACKGROUND,
    borderTone,
    shape = DEFAULT_SHAPE_PRESET,
    showBorder = DEFAULT_SHOW_BORDER,
    showSearchField = true,
    showShadow = DEFAULT_SHOW_SHADOW,
    size = DEFAULT_SIZE_PRESET,
  } = props;

  return `
    background-color: ${getSurfaceBackgroundColor(theme, background)};
    ${getBorderStyles(theme, showBorder, showShadow, borderTone)}
    border-radius: ${resolveToolbarBlockRadius(shape, size, props, showSearchField)};
  `;
}

/**
 * StyledToolbar — задаёт корневой узел компонента Toolbar.
 * Базируется на `<div>` и поддерживает все пропсы из `ToolbarStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `row-gap` — зазор ряда всегда длина: `0`, когда строка скрыта, и отступ
 *    панели, когда открыта
 *  - `min-inline-size: max-content` — ширина панели не меньше ряда действий
 *  - `justify-self: center` — выравнивает панель по центру родителя по горизонтали
 *  - `min-block-size: 0` — сжимается по высоте во flex/grid-родителе
 *  - `padding` — внутренний отступ поверхности
 *  - `overflow: hidden` — обрезает содержимое по скруглению
 *
 * Генерация стилей:
 *  - `getTransitionStyles` — переход `row-gap`
 *  - `getToolbarStyles` — заливка, рамка с тенью и скругление поверхности
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledToolbar = styled.div.withConfig({
  shouldForwardProp: (prop) => !TOOLBAR_PROP_NAMES.has(prop),
})<ToolbarStyleProps>`
  display: grid;
  row-gap: ${(props) =>
    getSpacingValue(props.showSearchField !== false ? TOOLBAR_ROW_GAP : 0)};
  justify-self: center;
  min-inline-size: max-content;
  min-block-size: 0;
  padding: ${getSpacingValue(TOOLBAR_PADDING)};
  overflow: hidden;
  ${getTransitionStyles('row-gap', MOTION_CONTROL_DURATION)}
  ${(props) => getToolbarStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * StyledToolbarSearchAction — задаёт появление иконки поиска компонента Toolbar.
 * Базируется на `<span>`.
 *
 * Встроенные стили:
 *  - `transform: scale(1)` и `@starting-style` со значением `scale(0)` — иконка
 *    вырастает при входе в ряд
 *
 * Генерация стилей:
 *  - `getTransitionStyles` — переход `transform`
 */
export const StyledToolbarSearchAction = styled.span`
  display: grid;
  transform: scale(1);
  ${getTransitionStyles('transform', MOTION_CONTROL_DURATION)}

  @starting-style {
    transform: scale(0);
  }
`;

/**
 * ToolbarSearchRowStyleProps — представляет пропсы стилизации строки поля поиска.
 *
 * @property collapsed — включает нулевую ширину строки с минимумом на всю панель
 * @property visible — включает раскрытие строки
 */
type ToolbarSearchRowStyleProps = {
  collapsed: boolean;
  visible: boolean;
};

/**
 * TOOLBAR_SEARCH_ROW_PROP_NAMES — хранит имена пропсов стилизации строки поля поиска.
 */
const TOOLBAR_SEARCH_ROW_PROP_NAMES = new Set<string>(['collapsed', 'visible']);

/**
 * getToolbarSearchRowStyles — возвращает CSS-правила для узла `StyledToolbarSearchRow`:
 * ширину при схлопывании и раскрытие строки.
 *
 * Как работает:
 * 1. При `collapsed` ставит `inline-size: 0` и `min-inline-size: 100%`: строка
 *    не раздувает панель и занимает её ширину
 * 2. Ставит `grid-template-rows` в `1fr` или `0fr` по `visible`
 * 3. Без `visible` гасит строку через `opacity: 0`
 *
 * @param props пропсы строки поля поиска
 * @returns CSS-правила, каждое с новой строки
 */
function getToolbarSearchRowStyles(props: ToolbarSearchRowStyleProps): string {
  const styles: string[] = [];

  if (props.collapsed) {
    styles.push('inline-size: 0;');
    styles.push('min-inline-size: 100%;');
  }

  styles.push(`grid-template-rows: ${props.visible ? '1fr' : '0fr'};`);

  if (!props.visible) {
    styles.push('opacity: 0;');
  }

  return styles.join('\n');
}

/**
 * StyledToolbarSearchRow — задаёт строку поля поиска компонента Toolbar.
 * Базируется на `<div>` и принимает пропсы `collapsed` и `visible`.
 *
 * Встроенные стили:
 *  - `display: grid` — строка схлопывается через `grid-template-rows`
 *  - `min-block-size: 0` — строка может схлопнуться в ноль по высоте
 *
 * Генерация стилей:
 *  - `getToolbarSearchRowStyles` — ширина при схлопывании и раскрытие строки
 *  - `getTransitionStyles` — переход `grid-template-rows` и `opacity`
 */
export const StyledToolbarSearchRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !TOOLBAR_SEARCH_ROW_PROP_NAMES.has(prop),
})<ToolbarSearchRowStyleProps>`
  display: grid;
  min-block-size: 0;
  ${(props) => getToolbarSearchRowStyles(props)}
  ${getTransitionStyles('grid-template-rows, opacity', MOTION_CONTROL_DURATION)}
`;

/**
 * ToolbarSearchClipStyleProps — представляет пропсы стилизации обрезки поля поиска.
 *
 * @property visible — включает показ поля. Без него обрезка прячет содержимое
 */
type ToolbarSearchClipStyleProps = {
  visible: boolean;
};

/**
 * TOOLBAR_SEARCH_CLIP_PROP_NAMES — хранит имена пропсов стилизации обрезки поля поиска.
 */
const TOOLBAR_SEARCH_CLIP_PROP_NAMES = new Set<string>(['visible']);

/**
 * StyledToolbarSearchClip — задаёт обрезку поля поиска компонента Toolbar.
 * Базируется на `<div>` и принимает проп `visible`.
 *
 * Встроенные стили:
 *  - `min-block-size: 0` — обрезка сжимается вместе со строкой
 *  - `overflow: hidden` без `visible` — обрезает поле, пока строка схлопнута
 */
export const StyledToolbarSearchClip = styled.div.withConfig({
  shouldForwardProp: (prop) => !TOOLBAR_SEARCH_CLIP_PROP_NAMES.has(prop),
})<ToolbarSearchClipStyleProps>`
  min-block-size: 0;
  ${(props) => !props.visible && 'overflow: hidden;'}
`;
