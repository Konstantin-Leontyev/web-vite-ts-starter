/**
 * Файл: `src/ui/sidebar/sidebar.styles.ts`
 * Определяет внешний вид компонента Sidebar.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `SidebarStyleProps`
 * 2. Хранить ширину панели в `SIDEBAR_PANEL_WIDTH` и потолок узкого экрана в
 *    `SIDEBAR_PANEL_MAX_BLOCK_SIZE`
 * 3. Предоставить styled-узлы `StyledSidebar`, `StyledSidebarContent`, `StyledSidebarSlot`
 *    и `StyledSidebarTrack`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/sidebar/index.tsx` — собирает компонент Sidebar и реэкспортирует публичное API
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { MOTION_SHELL_DURATION, getTransitionStyles } from '@ui/motion';
import { POSITIONING_PROPERTY_NAMES } from '@ui/positioning';
import { SIZING_PROPERTY_NAMES } from '@ui/sizing';
import {
  PADDING_PROPERTY_NAMES,
  getSpacingValue,
  resolvePaddingEdge,
} from '@ui/spacing';
import { VIEWPORT_EDGE_INSET } from '@ui/viewport';

export { splitLayoutProps } from '@ui/layout';

/**
 * SIDEBAR_PANEL_WIDTH — задаёт ширину выезжающей панели.
 * Используется в `StyledSidebarTrack`, при расчёте ширины `StyledSidebarSlot`
 * и в `resolveShowcasePanelBreakpoint` из `src/pages/showcase/showcase.styles.ts`.
 */
export const SIDEBAR_PANEL_WIDTH = '20rem';

/**
 * SIDEBAR_PANEL_MAX_BLOCK_SIZE — задаёт потолок высоты панели на узком экране.
 * Используется в `getSidebarStyles`.
 */
const SIDEBAR_PANEL_MAX_BLOCK_SIZE = 'min(480px, 60dvb)';

/**
 * StyledSidebarContent — задаёт область контента компонента Sidebar.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: flex` — вертикальный скролл-контейнер произвольного содержимого.
 *    Flex вместо grid: поток произвольного контента, а не фиксированная раскладка
 *  - `flex-direction: column` — колонка содержимого
 *  - `min-inline-size: 0` — позволяет сжиматься по строчной оси в grid-каркасе
 *  - `min-block-size: 0` — позволяет сжиматься по блочной оси в grid-каркасе
 *  - `overflow-y: auto` — внутренний скролл области контента без утягивания панели.
 *    Работает только при заданной высоте у предков: без неё трек `minmax(0, 1fr)`
 *    раздувается под контент, и скроллится вся страница. Каркасный фикс задаётся
 *    в `@ui/reset` и на страницах с корневым `<main>`, либо локально через
 *    `max-block-size` в dvb, как на странице витрины
 */
export const StyledSidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
  min-block-size: 0;
  overflow-y: auto;
`;

/**
 * StyledSidebarSlot — задаёт слот-колонку выезжающей панели компонента Sidebar.
 * Базируется на `<aside>`.
 *
 * Встроенные стили:
 *  - `inline-size: 0` — колонка свёрнута, пока панель не раскрыта
 *  - `overflow: hidden` — обрезает трек при анимации ширины
 *  - `display: none` при `data-open='false'` — скрывает слот, пока панель не в DOM
 *
 * Генерация стилей:
 *  - `getTransitionStyles` — переход по `inline-size`
 */
export const StyledSidebarSlot = styled.aside`
  inline-size: 0;
  min-inline-size: 0;
  min-block-size: 0;
  overflow: hidden;
  ${getTransitionStyles('inline-size', MOTION_SHELL_DURATION)}

  &[data-open='false'] {
    display: none;
  }
`;

/**
 * StyledSidebarTrack — задаёт трек выезжающей панели компонента Sidebar.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: flex` — прижимает панель к краю выезда. Flex вместо grid: иначе
 *    ломается выезд нижнего листа на узком экране
 *  - `justify-content: flex-end` — панель у края выезда
 *  - `inline-size` из `SIDEBAR_PANEL_WIDTH` — фиксированная ширина трека
 *  - `transform: translateX(100%)` — стартовое положение за правым краем
 *  - `transform: translateX(0)` при `data-open='true'` — панель на месте
 *  - `inline-size: 100%` на первом ребёнке — Card заполняет трек
 *  - `min-inline-size: 0` на первом ребёнке — Card сжимается по строчной оси
 *    ниже min-content и не распирает трек
 *  - `min-block-size: 0` на первом ребёнке — Card сжимается по блочной оси
 *
 * Генерация стилей:
 *  - `getTransitionStyles` — переход по `transform`
 */
export const StyledSidebarTrack = styled.div`
  display: flex;
  justify-content: flex-end;
  inline-size: ${SIDEBAR_PANEL_WIDTH};
  block-size: 100%;
  min-block-size: 0;
  transform: translateX(100%);
  ${getTransitionStyles('transform', MOTION_SHELL_DURATION)}

  &[data-open='true'] {
    transform: translateX(0);
  }

  > :first-child {
    inline-size: 100%;
    min-inline-size: 0;
    min-block-size: 0;
  }
`;

/**
 * SidebarStyleProps — представляет пропсы стилизации Sidebar и layout-пропсы.
 *
 * @property panelBreakpoint — порог ширины экрана. При этой ширине и меньше панель выезжает снизу.
 *   Без пропа — `SIDEBAR_PANEL_BREAKPOINT`
 */
export type SidebarStyleProps = LayoutProps & {
  panelBreakpoint?: string;
};

/**
 * SIDEBAR_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Sidebar.
 */
const SIDEBAR_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES, 'panelBreakpoint']);

/**
 * SIDEBAR_PANEL_BREAKPOINT — задаёт запасной порог широкого экрана для раскладки Sidebar.
 * Используется в `getSidebarStyles`, когда проп `panelBreakpoint` не передан.
 */
const SIDEBAR_PANEL_BREAKPOINT = '640px';

/**
 * omitSidebarShellLayoutProps — убирает маршрутизируемые `padding*` через
 * `PADDING_PROPERTY_NAMES`, а также sizing и positioning, включая `gap`: их каркас
 * Sidebar не применяет на корень по исключению оболочки, `gap` уходит в зоны через
 * `getSidebarStyles`.
 *
 * @param props layout-пропсы Sidebar
 * @returns layout-пропсы корня для `getLayoutStyles`: внешние отступы
 */
function omitSidebarShellLayoutProps(props: LayoutProps): LayoutProps {
  const rootLayoutProps: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (
      PADDING_PROPERTY_NAMES.has(key) ||
      POSITIONING_PROPERTY_NAMES.has(key) ||
      SIZING_PROPERTY_NAMES.has(key)
    ) {
      continue;
    }

    rootLayoutProps[key] = value;
  }

  return rootLayoutProps as LayoutProps;
}

/**
 * getSidebarStyles — возвращает CSS-правила для корня `StyledSidebar`: отступы зон
 * каркаса, зазор при открытой панели, ширину слота на широком экране
 * и нижнюю полосу панели на узком.
 *
 * Как работает:
 * 1. Берёт порог ширины экрана из пропа `panelBreakpoint`
 * 2. Для каждого края оболочки берёт отступ через `resolvePaddingEdge`
 *    с запасным значением `VIEWPORT_EDGE_INSET` и переводит метку шкалы в CSS-длину
 * 3. Пишет отступы в `StyledSidebarContent` и `StyledSidebarSlot` по состоянию
 *    панели и ширине вьюпорта
 * 4. Когда ширина больше `panelBreakpoint` и панель открыта, задаёт зазор между зонами
 *    и ширину слота как ширину панели плюс отступ inline-end
 * 5. При ширине не больше `panelBreakpoint` и открытой панели ставит слот
 *    второй строкой сетки под областью контента. Между ними тот же зазор,
 *    что по краям страницы. Прокрутка остаётся над панелью.
 *    Нижний отступ оболочки — под панелью, панель его не закрывает.
 *    Трек выезжает снизу и не выше `SIDEBAR_PANEL_MAX_BLOCK_SIZE`
 *
 * @param props пропсы стилизации Sidebar
 * @returns CSS-правила, каждое с новой строки
 */
function getSidebarStyles(props: SidebarStyleProps): string {
  const { panelBreakpoint = SIDEBAR_PANEL_BREAKPOINT } = props;
  const paddingBlockStart = getSpacingValue(
    resolvePaddingEdge(props, 'blockStart', VIEWPORT_EDGE_INSET)
  );
  const paddingBlockEnd = getSpacingValue(
    resolvePaddingEdge(props, 'blockEnd', VIEWPORT_EDGE_INSET)
  );
  const paddingInlineStart = getSpacingValue(
    resolvePaddingEdge(props, 'inlineStart', VIEWPORT_EDGE_INSET)
  );
  const paddingInlineEnd = getSpacingValue(
    resolvePaddingEdge(props, 'inlineEnd', VIEWPORT_EDGE_INSET)
  );

  return `
    ${StyledSidebarContent} {
      padding-block-start: ${paddingBlockStart};
      padding-block-end: ${paddingBlockEnd};
      padding-inline-start: ${paddingInlineStart};
    }
    @media (width > ${panelBreakpoint}) {
      grid-template-columns: 1fr auto;
      &:not(:has(${StyledSidebarSlot}[data-open='true'])) ${StyledSidebarContent} {
        padding-inline-end: ${paddingInlineEnd};
      }
      &:has(${StyledSidebarSlot}[data-open='true']) {
        gap: ${getSpacingValue(props.gap ?? VIEWPORT_EDGE_INSET)};
      }
      ${StyledSidebarSlot}[data-open='true'][data-expanded='true'] {
        inline-size: calc(${SIDEBAR_PANEL_WIDTH} + ${paddingInlineEnd});
        padding-block-start: ${paddingBlockStart};
        padding-block-end: ${paddingBlockEnd};
        padding-inline-end: ${paddingInlineEnd};
      }
    }
    @media (width <= ${panelBreakpoint}) {
      &:has(${StyledSidebarSlot}[data-open='true']) {
        grid-template-rows: minmax(0, 1fr) auto;
        gap: ${getSpacingValue(props.gap ?? VIEWPORT_EDGE_INSET)};
      }
      &:has(${StyledSidebarSlot}[data-open='true']) ${StyledSidebarContent} {
        padding-block-end: 0;
      }
      ${StyledSidebarContent} {
        padding-inline-end: ${paddingInlineEnd};
      }
      ${StyledSidebarSlot}[data-open='true'] {
        inline-size: auto;
        padding-block-end: ${paddingBlockEnd};
        padding-inline: ${paddingInlineStart} ${paddingInlineEnd};
      }
      ${StyledSidebarTrack} {
        inline-size: 100%;
        block-size: auto;
        max-block-size: ${SIDEBAR_PANEL_MAX_BLOCK_SIZE};
        align-items: flex-end;
        transform: translateY(100%);
      }
      ${StyledSidebarTrack}[data-open='true'] {
        transform: translateY(0);
      }
      ${StyledSidebarTrack} > :first-child {
        max-block-size: ${SIDEBAR_PANEL_MAX_BLOCK_SIZE};
      }
    }
  `;
}

/**
 * StyledSidebar — задаёт корневой узел компонента Sidebar.
 * Базируется на `<div>` и поддерживает layout-пропсы из `SidebarStyleProps`
 * без маршрутизируемых `padding*`, sizing и positioning.
 *
 * Встроенные стили:
 *  - `display: grid` — каркас из области контента и слота панели
 *  - `block-size: 100%` — заполняет родителя. Заданную высоту обеспечивает обёртка
 *    вызывающего кода
 *  - `overflow: hidden` — обрезает выезд панели по границе каркаса
 *
 * Генерация стилей:
 *  - `getSidebarStyles` — маршрутизация `padding*` и `gap` по зонам и состояниям,
 *    `grid-template-columns: 1fr auto` при ширине больше `panelBreakpoint`
 *  - `getLayoutStyles` — внешние отступы корня
 */
export const StyledSidebar = styled.div.withConfig({
  shouldForwardProp: (prop) => !SIDEBAR_PROP_NAMES.has(prop),
})<SidebarStyleProps>`
  position: relative;
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  grid-template-columns: 1fr;
  min-inline-size: 0;
  block-size: 100%;
  min-block-size: 0;
  overflow: hidden;

  ${(props) => getSidebarStyles(props)}
  ${(props) => getLayoutStyles(omitSidebarShellLayoutProps(props))}
`;
