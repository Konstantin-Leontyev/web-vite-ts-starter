/**
 * Файл: `src/ui/anchored-panel/index.tsx`
 * Предоставляет компонент AnchoredPanel для отображения привязанной панели через нативный popover.
 *
 * Поддерживает:
 *  - открытие и закрытие панели через проп `open`
 *  - содержимое панели через проп `children`
 *  - якорь CSS-привязки через проп `anchorRef`
 *  - зоны, клик вне которых закрывает панель, через проп `dismissZoneRefs`
 *  - обработчик закрытия панели через проп `onDismiss`
 *  - независимое управление закрытием через проп `dismissActive`
 *  - возврат фокуса при закрытии через проп `returnFocusRef`
 *  - начальный фокус при открытии через проп `onOpenFocus`
 *  - перефокус при смене содержимого через проп `openFocusDeps`
 *  - ссылку на DOM-узел панели через проп `panelRef`
 *
 * Основные задачи:
 * 1. Экспортировать компонент AnchoredPanel
 * 2. Типизировать пропсы через `AnchoredPanelProps`
 * 3. Удерживать обход `Tab` внутри открытой панели — ловушка фокуса встроена
 *    и пропом не управляется
 * 4. Показывать панель через `POPOVER_MANUAL` и `showPopover` из `@ui/popover`
 *    до отрисовки. Панель остаётся в дереве вызывающего кода
 * 5. Реэкспортировать `getCssAnchorBindingStyles`, `getCssAnchorPlacementStyles`
 *    и `getAnchoredPanelStyles` из `src/ui/anchored-panel/anchored-panel.styles.ts`
 *    и `AnchoredPanelPositionTryStyle` из
 *    `src/ui/anchored-panel/position-try.ts`
 * 6. Привязывать ширину панели вида `icon` к родителю через
 *    `bindAnchoredPanelParentWidth`
 *
 * Потребители:
 *  - контролы, например DateRangeInput, Listbox и RangeInput —
 *    рендерят выпадающие панели с CSS-привязкой. Listbox вида `icon`
 *    вызывает `bindAnchoredPanelParentWidth`
 *  - `@ui/table` — рендерит панели add и edit с CSS-привязкой
 *  - `src/components/profile-menu/index.tsx` — рендерит меню профиля
 *  - `src/context/theme/index.tsx` — подключает `AnchoredPanelPositionTryStyle`
 */

import {
  cloneElement,
  useEffectEvent,
  useLayoutEffect,
  type ReactElement,
  type RefObject,
} from 'react';

import { useAnchoredDismiss } from '@hooks/use-anchored-dismiss';
import { useFocus } from '@hooks/use-focus';
import { POPOVER_MANUAL, showPopover } from '@ui/popover';
import { PANEL_VIEWPORT_EDGE_INSET } from '@ui/viewport';

import {
  getAnchoredPanelStyles,
  getCssAnchorBindingStyles,
  getCssAnchorPlacementStyles,
} from './anchored-panel.styles';
import {
  ANCHORED_PANEL_POSITION_TRY_ABOVE,
  ANCHORED_PANEL_POSITION_TRY_VIEWPORT,
  AnchoredPanelPositionTryStyle,
} from './position-try';

/**
 * ICON_PANEL_PARENT_ANCHOR — задаёт имя якоря родителя для ширины панели вида `icon`.
 * Используется в `bindAnchoredPanelParentWidth`.
 */
const ICON_PANEL_PARENT_ANCHOR = '--listbox-icon-parent';

/**
 * bindAnchoredPanelParentWidth — привязывает ширину и левый край панели к родителю.
 * Верх панели остаётся на неявном якоре кнопки. Левый край зажимается отступом
 * от края вьюпорта.
 *
 * @param panel узел панели
 * @param parent предок, шире кнопки
 * @returns снятие привязки
 */
function bindAnchoredPanelParentWidth(
  panel: HTMLElement,
  parent: HTMLElement
): () => void {
  const previousAnchorName = parent.style.getPropertyValue('anchor-name');
  const inset = PANEL_VIEWPORT_EDGE_INSET;

  parent.style.setProperty('anchor-name', ICON_PANEL_PARENT_ANCHOR);
  panel.style.setProperty(
    'inset-inline-start',
    `clamp(${inset}px, anchor(${ICON_PANEL_PARENT_ANCHOR} start), calc(100% - ${inset}px - anchor-size(${ICON_PANEL_PARENT_ANCHOR} width)))`
  );
  panel.style.setProperty(
    'inline-size',
    `anchor-size(${ICON_PANEL_PARENT_ANCHOR} width)`
  );
  panel.style.setProperty('max-inline-size', 'none');
  panel.style.setProperty(
    'position-try-fallbacks',
    `${ANCHORED_PANEL_POSITION_TRY_ABOVE}, ${ANCHORED_PANEL_POSITION_TRY_VIEWPORT}`
  );

  return () => {
    if (previousAnchorName) {
      parent.style.setProperty('anchor-name', previousAnchorName);
    } else {
      parent.style.removeProperty('anchor-name');
    }

    panel.style.removeProperty('inset-inline-start');
    panel.style.removeProperty('inline-size');
    panel.style.removeProperty('max-inline-size');
    panel.style.removeProperty('position-try-fallbacks');
  };
}

/**
 * DEFAULT_ANCHORED_PANEL_OPEN_FOCUS_DEPS — задаёт зависимости перефокуса по умолчанию.
 * Используется, когда вызывающий код не передал проп `openFocusDeps`.
 */
const DEFAULT_ANCHORED_PANEL_OPEN_FOCUS_DEPS: readonly unknown[] = [];

/**
 * AnchoredPanelProps — представляет пропсы компонента AnchoredPanel.
 *
 * @property anchorRef — ссылка на DOM-узел якоря для неявной CSS-привязки
 *   и закрытия, когда якорь уходит из полной видимости
 * @property children — единственный элемент панели. Допускает проп `popover`
 *   со значением `POPOVER_MANUAL`
 * @property dismissActive — включает закрытие по клику вне зон. Без значения
 *   совпадает с `open`
 * @property dismissZoneRefs — ссылки на зоны, клик вне которых вызывает `onDismiss`
 * @property onDismiss — обработчик закрытия панели
 * @property onOpenFocus — обработчик начального фокуса при открытии
 * @property open — включает видимость панели
 * @property openFocusDeps — зависимости для перефокуса при смене содержимого панели
 * @property panelRef — ссылка на DOM-узел панели
 * @property returnFocusRef — ссылка на элемент для возврата фокуса при закрытии
 */
type AnchoredPanelProps = {
  anchorRef: RefObject<HTMLElement | null>;
  children: ReactElement<{ popover?: typeof POPOVER_MANUAL }>;
  dismissActive?: boolean;
  dismissZoneRefs: RefObject<HTMLElement | null>[];
  onDismiss: () => void;
  onOpenFocus?: (panel: HTMLElement) => void;
  open: boolean;
  openFocusDeps?: readonly unknown[];
  panelRef: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

/**
 * AnchoredPanel — отображает привязанную панель.
 *
 * @example
 * <AnchoredPanel
 *   anchorRef={triggerRef}
 *   dismissZoneRefs={[triggerRef, panelRef]}
 *   open={open}
 *   panelRef={panelRef}
 *   returnFocusRef={triggerRef}
 *   onDismiss={close}
 * >
 *   <StyledPanel ref={panelRef}>...</StyledPanel>
 * </AnchoredPanel>
 */
export function AnchoredPanel({
  anchorRef,
  children,
  dismissActive,
  dismissZoneRefs,
  onDismiss,
  onOpenFocus,
  open,
  openFocusDeps = DEFAULT_ANCHORED_PANEL_OPEN_FOCUS_DEPS,
  panelRef,
  returnFocusRef,
}: AnchoredPanelProps) {
  const dismissEnabled = dismissActive ?? open;

  useAnchoredDismiss({
    active: dismissEnabled,
    anchorRef,
    onDismiss,
    zoneRefs: dismissZoneRefs,
  });

  useFocus({
    active: open,
    containerRef: panelRef,
    returnFocusRef,
  });

  /**
   * Показывает панель через `showPopover` до отрисовки.
   * Передаёт якорь из `anchorRef` как `source` неявной CSS-привязки.
   */
  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    const panel = panelRef.current;

    if (panel) {
      showPopover(panel, anchorRef.current);
    }
  }, [anchorRef, open, panelRef]);

  const onOpenFocusEvent = useEffectEvent((panel: HTMLElement) => {
    onOpenFocus?.(panel);
  });

  /**
   * Начальный фокус при открытии: вызывает `onOpenFocus` после кадра отрисовки,
   * когда DOM-узел панели уже доступен.
   *
   * Как работает:
   * 1. Пропускает планирование, если панель закрыта
   * 2. Планирует вызов `onOpenFocus` на следующий кадр отрисовки
   * 3. Передаёт в обработчик DOM-узел панели из `panelRef`, если узел есть
   * 4. `openFocusDeps` задаёт перезапуск при смене содержимого панели
   */
  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const panel = panelRef.current;

      if (panel) {
        onOpenFocusEvent(panel);
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
    // onOpenFocus — через useEffectEvent: смена ссылки на колбэк не перезапускает эффект.
    // openFocusDeps — перефокус при смене содержимого панели.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- зависимости задаёт вызывающий код через openFocusDeps
  }, [open, panelRef, ...openFocusDeps]);

  if (!open) {
    return null;
  }

  return cloneElement(children, {
    popover: POPOVER_MANUAL,
  });
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт генераторов стилей панели и AnchoredPanelPositionTryStyle */
export {
  AnchoredPanelPositionTryStyle,
  bindAnchoredPanelParentWidth,
  getAnchoredPanelStyles,
  getCssAnchorBindingStyles,
  getCssAnchorPlacementStyles,
};
