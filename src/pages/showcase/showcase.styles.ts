/**
 * Файл: `src/pages/showcase/showcase.styles.ts`
 * Определяет layout страницы и styled-обёртки витрины дизайн-системы.
 *
 * Основные задачи:
 * 1. Предоставить styled-узел `StyledMain` для корневого landmark страницы
 * 2. Предоставить styled-узлы `StyledShowcaseWidgets` и `StyledShowcaseWidgetFullRow`
 *    для сетки виджетов
 * 3. Предоставить styled-узел `StyledSettingsForm` для формы настроек в Sidebar
 * 4. Предоставить styled-узел демо-превью `StyledRadioButtonDemo`
 * 5. Предоставить функции `resolveShowcaseWidgetMinInlineSize`
 *    и `resolveShowcasePanelBreakpoint`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — собирает layout витрины и оборачивает карточки
 *    виджетов
 *  - панели настроек витрины дизайн-системы — рендерят `StyledSettingsForm` в Sidebar
 */
import styled from 'styled-components';

import { HEADER_BLOCK_SIZE } from '@components/header';
import { CARD_PADDING } from '@ui/card';
import { type IconSizePreset } from '@ui/icon';
import { DEFAULT_SIZE_PRESET } from '@ui/presets';
import {
  DEFAULT_SCROLL_PORT_PADDING_INLINE_END,
  DEFAULT_SCROLL_PORT_PADDING_INLINE_START,
  SCROLLBAR_TRACK_WIDTH,
} from '@ui/scroll-port';
import { SIDEBAR_PANEL_WIDTH } from '@ui/sidebar';
import { getSpacingValue } from '@ui/spacing';
import { resolveToolbarActionRowInlineSizePx } from '@ui/toolbar';
import { VIEWPORT_EDGE_INSET } from '@ui/viewport';

/**
 * PLAYGROUND_MAX_BLOCK_SIZE — задаёт максимальную высоту страницы витрины.
 * Высота равна вьюпорту минус живая высота шапки из CSS-переменной
 * `--shell-header-block-size`, которую публикует шапка. При сворачивании шапки
 * в `autoHide` переменная уменьшается, и каркас занимает весь экран.
 * Единица `dvb` не зависит от grid-каркаса body, поэтому ScrollPort внутри
 * скроллит контент, не растягивая страницу. Каркасная альтернатива описана
 * в `@ui/sidebar`.
 * Используется в `StyledMain` как значение `max-block-size`.
 */
const PLAYGROUND_MAX_BLOCK_SIZE = `calc(100dvb - var(--shell-header-block-size, ${HEADER_BLOCK_SIZE}))`;

/**
 * SHOWCASE_WIDGET_FULL_ROW_BLOCK_SIZE — задаёт фиксированную высоту полноширинного
 * ряда виджетов, например Table. Менять вместе с плотностью демо-таблицы.
 */
const SHOWCASE_WIDGET_FULL_ROW_BLOCK_SIZE = '22rem';

/**
 * SHOWCASE_WIDGET_COLUMN_COUNT — задаёт максимальное число карточек в одном ряду.
 * `auto-fit` не ставит колонок больше этого числа.
 */
const SHOWCASE_WIDGET_COLUMN_COUNT = 4;

/**
 * SHOWCASE_TOOLBAR_ACTION_COUNT — задаёт число действий в ряду тулбара витрины.
 * Лупа в это число не входит: она уже ушла в строку поиска.
 * Используется в `resolveShowcaseWidgetMinInlineSize`.
 */
const SHOWCASE_TOOLBAR_ACTION_COUNT = 7;

/**
 * SHOWCASE_PANEL_BREAKPOINT_OFFSET — задаёт сдвиг порога на пиксель ниже суммы.
 * Запрос `@media` в Sidebar считает порог последней шириной нижней панели.
 * Используется в `resolveShowcasePanelBreakpoint`.
 */
const SHOWCASE_PANEL_BREAKPOINT_OFFSET = '1px';

/**
 * resolveShowcaseWidgetMinInlineSize — возвращает порог колонки сетки витрины.
 * Берёт большее из ряда тулбара текущего размера, того же ряда размера `normal`
 * и измеренной ширины оценки, затем прибавляет два отступа Card.
 *
 * @param toolbarSize размер окон тулбара
 * @param ratingInlineSizePx ширина оценки в px
 * @returns порог колонки сетки
 */
export function resolveShowcaseWidgetMinInlineSize(
  toolbarSize: IconSizePreset,
  ratingInlineSizePx: number
): string {
  const currentRowPx = resolveToolbarActionRowInlineSizePx(
    SHOWCASE_TOOLBAR_ACTION_COUNT,
    0,
    toolbarSize,
    {}
  );
  const normalRowPx = resolveToolbarActionRowInlineSizePx(
    SHOWCASE_TOOLBAR_ACTION_COUNT,
    0,
    DEFAULT_SIZE_PRESET,
    {}
  );
  const widgetInlineSizePx = Math.max(currentRowPx, normalRowPx, ratingInlineSizePx);

  return `calc(${widgetInlineSizePx}px + ${getSpacingValue(CARD_PADDING)} * 2)`;
}

/**
 * resolveShowcasePanelBreakpoint — возвращает порог смены раскладки Sidebar на витрине.
 * Сумма порога колонки, ширины панели и отступов десктопной раскладки,
 * минус правый отступ прокрутки, уменьшенный на половину `SCROLLBAR_TRACK_WIDTH`,
 * на пиксель меньше: при этой ширине экрана панель уже нижняя.
 *
 * @param columnMin порог колонки из `resolveShowcaseWidgetMinInlineSize`
 * @returns значение пропа `panelBreakpoint`
 */
export function resolveShowcasePanelBreakpoint(columnMin: string): string {
  const aroundCard = `${getSpacingValue(CARD_PADDING)} * 2 + ${getSpacingValue(DEFAULT_SCROLL_PORT_PADDING_INLINE_START)} + ${getSpacingValue(DEFAULT_SCROLL_PORT_PADDING_INLINE_END)}`;
  const inset = getSpacingValue(VIEWPORT_EDGE_INSET);
  const trackOverlap = `${getSpacingValue(DEFAULT_SCROLL_PORT_PADDING_INLINE_END)} - ${getSpacingValue(SCROLLBAR_TRACK_WIDTH)} / 2`;

  return `calc(${columnMin} + ${aroundCard} + ${inset} + ${inset} + ${SIDEBAR_PANEL_WIDTH} + ${inset} - (${trackOverlap}) - ${SHOWCASE_PANEL_BREAKPOINT_OFFSET})`;
}

/**
 * StyledMain — задаёт корневой landmark витрины дизайн-системы.
 * Базируется на `<main>`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `grid-template-rows` и `grid-template-columns: minmax(0, 1fr)` — занимает доступную
 *    высоту и ширину без переполнения
 *  - `max-block-size` из `PLAYGROUND_MAX_BLOCK_SIZE` — заданная высота для каркаса Sidebar:
 *    габариты задаёт страница, сам Sidebar пропсов размеров не имеет
 *  - `min-block-size: 0` — предотвращает переполнение во flex-контейнерах
 */
export const StyledMain = styled.main`
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  grid-template-columns: minmax(0, 1fr);
  min-block-size: 0;
  max-block-size: ${PLAYGROUND_MAX_BLOCK_SIZE};
`;

/**
 * StyledShowcaseWidgetFullRow — задаёт обёртку виджета на всю ширину сетки витрины
 * дизайн-системы.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `grid-column: 1 / -1` — карточка растягивается на все колонки сетки
 *  - `block-size` из `SHOWCASE_WIDGET_FULL_ROW_BLOCK_SIZE` — фиксированная высота ряда
 *    для широких виджетов, например Table
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 */
export const StyledShowcaseWidgetFullRow = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  grid-column: 1 / -1;
  min-inline-size: 0;
  block-size: ${SHOWCASE_WIDGET_FULL_ROW_BLOCK_SIZE};
  min-block-size: 0;
`;

/**
 * ShowcaseWidgetsStyleProps — представляет пропсы стилизации сетки витрины.
 *
 * @property minInlineSize — порог колонки на широком экране
 * @property panelBreakpoint — порог ширины экрана. При этой ширине и меньше колонка не шире контейнера
 */
type ShowcaseWidgetsStyleProps = {
  minInlineSize: string;
  panelBreakpoint: string;
};

/**
 * SHOWCASE_WIDGETS_PROP_NAMES — хранит имена пропсов стилизации сетки витрины.
 */
const SHOWCASE_WIDGETS_PROP_NAMES = new Set<string>([
  'minInlineSize',
  'panelBreakpoint',
]);

/**
 * resolveShowcaseWidgetsColumns — возвращает значение `grid-template-columns` сетки витрины.
 * Колонок не больше `SHOWCASE_WIDGET_COLUMN_COUNT`. На узком экране колонка не шире контейнера.
 *
 * @param minInlineSize порог колонки
 * @param capAtContainer ограничивает колонку шириной контейнера
 * @returns значение для CSS-свойства `grid-template-columns`
 */
function resolveShowcaseWidgetsColumns(
  minInlineSize: string,
  capAtContainer: boolean
): string {
  const floor = `max(${minInlineSize}, calc((100% - ${SHOWCASE_WIDGET_COLUMN_COUNT - 1} * ${getSpacingValue(8)}) / ${SHOWCASE_WIDGET_COLUMN_COUNT}))`;
  const track = capAtContainer ? `min(100%, ${floor})` : floor;

  return `repeat(auto-fit, minmax(${track}, 1fr))`;
}

/**
 * getShowcaseWidgetsStyles — возвращает CSS-правила для корня `StyledShowcaseWidgets`:
 * колонки сетки.
 * При ширине не больше `panelBreakpoint` колонка не шире контейнера. Шире `panelBreakpoint`
 * колонка не уже `minInlineSize`.
 *
 * @param props пропсы стилизации сетки
 * @returns CSS-правила, каждое с новой строки
 */
function getShowcaseWidgetsStyles(props: ShowcaseWidgetsStyleProps): string {
  return `
    grid-template-columns: ${resolveShowcaseWidgetsColumns(props.minInlineSize, true)};
    @media (width > ${props.panelBreakpoint}) {
      grid-template-columns: ${resolveShowcaseWidgetsColumns(props.minInlineSize, false)};
    }
  `;
}

/**
 * StyledShowcaseWidgets — задаёт сетку карточек виджетов витрины дизайн-системы.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `gap` — отступ между карточками
 *  - `align-items: start` — карточки выравниваются по верхнему краю
 *  - `min-inline-size: 0` — сетка сжимается в области контента
 *  - `aspect-ratio: 1 / 1` на дочерних узлах, кроме `StyledShowcaseWidgetFullRow` —
 *    квадратные карточки превью
 *
 * Генерация стилей:
 *  - `getShowcaseWidgetsStyles` — колонки сетки и порог `panelBreakpoint`
 */
export const StyledShowcaseWidgets = styled.div.withConfig({
  shouldForwardProp: (prop) => !SHOWCASE_WIDGETS_PROP_NAMES.has(prop),
})<ShowcaseWidgetsStyleProps>`
  display: grid;
  gap: ${getSpacingValue(8)};
  align-items: start;
  min-inline-size: 0;
  ${(props) => getShowcaseWidgetsStyles(props)}

  > :not(${StyledShowcaseWidgetFullRow}) {
    aspect-ratio: 1 / 1;
  }
`;

/**
 * StyledSettingsForm — задаёт форму настроек виджета в Sidebar витрины дизайн-системы.
 * Базируется на `<form>`.
 *
 * Встроенные стили:
 *  - `display: grid` — поля идут колонкой
 *  - `gap` — вертикальный отступ между полями
 */
export const StyledSettingsForm = styled.form`
  display: grid;
  gap: ${getSpacingValue(16)};
`;

/**
 * StyledRadioButtonDemo — задаёт обёртку демо RadioButton в карточке виджета.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: grid` — вертикальный стек кнопок
 *  - `gap` — отступ между кнопками
 *  - `place-content: center` — центрирует стек в ячейке карточки
 */
export const StyledRadioButtonDemo = styled.div`
  display: grid;
  gap: ${getSpacingValue(8)};
  place-content: center;
`;
