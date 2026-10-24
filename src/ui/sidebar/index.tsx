/**
 * Файл: `src/ui/sidebar/index.tsx`
 * Предоставляет компонент Sidebar для отображения страницы с выезжающей панелью.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы. Позиционирование и размеры каркас не принимает —
 *    высоту и место в потоке задаёт обёртка вызывающего кода
 *  - зазор между областью контента и панелью через проп `gap`
 *  - область страницы через `children`
 *  - ref области контента через проп `contentRef`
 *  - дополнительные кнопки в шапке панели через проп `headerActions`. Рендерятся перед
 *    кнопкой сворачивания
 *  - иконку кнопки сворачивания через проп `icon`
 *  - доступное имя кнопки сворачивания через проп `iconAriaLabel`
 *  - id панели через проп `id`
 *  - обработчик закрытия через проп `onClose`
 *  - открытое состояние панели через проп `open`
 *  - содержимое панели через проп `sidebarContent`
 *  - заливку панели через проп `background`
 *  - рамку панели через проп `showBorder`
 *  - тень панели через проп `showShadow`
 *  - тон рамки панели через проп `borderTone`. Вместе с `showBorder={false}` не собирается
 *  - рамку действий через проп `showActionBorder`
 *  - тень действий через проп `showActionShadow`
 *  - заголовок панели через проп `title`
 *  - уровень заголовка панели через проп `titleLevel`
 *  - подзаголовок панели через проп `subtitle`
 *  - тон заголовка через проп `titleTone`
 *  - размер заголовка через проп `titleSize`
 *  - курсив заголовка через проп `titleItalic`
 *  - выравнивание заголовка через проп `titleAlign`
 *  - тон подзаголовка через проп `subtitleTone`
 *  - размер подзаголовка через проп `subtitleSize`
 *  - курсив подзаголовка через проп `subtitleItalic`
 *  - выравнивание подзаголовка через проп `subtitleAlign`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Sidebar
 * 2. Типизировать пропсы через `SidebarProps`
 * 3. Выставлять `aria-controls`, `aria-expanded` и `aria-label` на кнопке сворачивания
 *    и `aria-labelledby` на слоте панели
 * 4. По нажатию сворачивания переносить фокус на кнопку вне панели с `aria-controls`
 *    на id панели и `aria-expanded`, пропуская кнопку сворачивания внутри.
 *    Перенос идёт до того, как родитель снимет раскрытость
 *
 * Потребители:
 *  - страницы приложения — показывают страницу с выезжающей панелью
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import {
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
  type Ref,
  type TransitionEvent,
} from 'react';

import { SidebarIcon } from '@icons';
import { type BorderProps, type ShowActionBorderProps } from '@ui/border';
import { Card } from '@ui/card';
import { type IconButtonRowAction } from '@ui/icon-button-row';
import { type TextNodeProps } from '@ui/text';
import { type DistributiveOmit } from '@ui/type-utils';

import {
  StyledSidebar,
  StyledSidebarContent,
  StyledSidebarSlot,
  StyledSidebarTrack,
  splitLayoutProps,
  type SidebarStyleProps,
} from './sidebar.styles';

/**
 * DEFAULT_SIDEBAR_HEADER_ACTIONS — задаёт ряд действий шапки по умолчанию.
 * Используется, когда вызывающий код не передал проп `headerActions`.
 */
const DEFAULT_SIDEBAR_HEADER_ACTIONS: IconButtonRowAction[] = [];

/**
 * DEFAULT_SIDEBAR_ICON — задаёт иконку кнопки сворачивания по умолчанию.
 * Используется, когда вызывающий код не передал проп `icon`.
 */
const DEFAULT_SIDEBAR_ICON = <SidebarIcon />;

/**
 * DEFAULT_SIDEBAR_ICON_ARIA_LABEL — задаёт доступное имя кнопки сворачивания по умолчанию.
 * Используется, когда вызывающий код не передал проп `iconAriaLabel`.
 */
const DEFAULT_SIDEBAR_ICON_ARIA_LABEL = 'Close panel';

/**
 * resolveExpandedPanelOpener — возвращает кнопку вне панели, которая держит её раскрытой.
 * Пропускает кнопку сворачивания внутри слота и кнопки, у которых `aria-expanded` не `true`.
 *
 * @param slot слот панели
 * @param panelId id панели для `aria-controls`
 * @returns кнопка вне слота с `aria-expanded` равным `true`, иначе `null`
 */
function resolveExpandedPanelOpener(
  slot: HTMLElement,
  panelId: string
): HTMLElement | null {
  for (const candidate of document.querySelectorAll<HTMLElement>(
    `[aria-controls="${CSS.escape(panelId)}"]`
  )) {
    if (slot.contains(candidate) || candidate.getAttribute('aria-expanded') !== 'true') {
      continue;
    }

    return candidate;
  }

  return null;
}

/**
 * isFocusInSlot — возвращает признак, что фокус внутри слота панели.
 *
 * @param slot слот панели или `null`
 * @returns `true`, когда активный элемент внутри слота
 */
function isFocusInSlot(slot: HTMLElement | null): boolean {
  const activeElement = document.activeElement;

  return slot !== null && activeElement instanceof Node && slot.contains(activeElement);
}

/**
 * CardForwardProps — представляет пропсы Card, доступные панели Sidebar.
 * Layout-пропсы зарезервированы за оболочкой Sidebar через `SidebarStyleProps`.
 * Ключи рамки, рамки действий и текста заголовка с подзаголовком вычтены и пересечены заново:
 * ветки не схлопнуты. Вызов с `showBorder={false}` и `borderTone` не собирается.
 */
type CardForwardProps = DistributiveOmit<
  ComponentProps<typeof Card>,
  | 'children'
  | 'headerActions'
  | 'id'
  | 'titleId'
  | keyof BorderProps
  | keyof ShowActionBorderProps
  | keyof SidebarStyleProps
  | keyof TextNodeProps<'subtitle'>
  | keyof TextNodeProps<'title'>
> &
  BorderProps &
  ShowActionBorderProps &
  TextNodeProps<'subtitle'> &
  TextNodeProps<'title'>;

/**
 * SidebarProps — представляет пропсы компонента Sidebar.
 *
 * @property children — содержимое области страницы слева от панели
 * @property contentRef — ref области контента
 * @property headerActions — дополнительные кнопки в шапке панели
 * @property icon — иконка кнопки сворачивания
 * @property iconAriaLabel — доступное имя кнопки сворачивания
 * @property id — id панели для связки с кнопкой сворачивания
 * @property onClose — обработчик закрытия панели
 * @property open — включает открытое состояние панели
 * @property sidebarContent — содержимое выезжающей панели
 */
type SidebarProps = SidebarStyleProps &
  CardForwardProps & {
    children: ReactNode;
    contentRef?: Ref<HTMLDivElement>;
    headerActions?: IconButtonRowAction[];
    icon?: ReactNode;
    iconAriaLabel?: string;
    id?: string;
    onClose: () => void;
    open: boolean;
    sidebarContent: ReactNode;
  };

/**
 * Sidebar — отображает страницу с выезжающей панелью.
 *
 * @example
 * <Sidebar open={open} onClose={closePanel} sidebarContent={<Settings />}>
 *   <PageContent />
 * </Sidebar>
 * <Sidebar
 *   id="panel"
 *   open={open}
 *   onClose={closePanel}
 *   gap={16}
 *   title="Settings"
 *   sidebarContent={<Settings />}
 * >
 *   <PageContent />
 * </Sidebar>
 */
export function Sidebar({
  children,
  contentRef,
  headerActions = DEFAULT_SIDEBAR_HEADER_ACTIONS,
  icon = DEFAULT_SIDEBAR_ICON,
  iconAriaLabel = DEFAULT_SIDEBAR_ICON_ARIA_LABEL,
  id,
  onClose,
  open,
  sidebarContent,
  ...forward
}: SidebarProps) {
  const { layoutProps, restProps } = splitLayoutProps(forward);
  const cardProps = restProps as CardForwardProps;
  const titleId = cardProps.title && id ? `${id}-title` : undefined;
  const openerRef = useRef<HTMLElement | null>(null);
  const slotRef = useRef<HTMLElement | null>(null);

  // isRendered — слот в DOM, открыт или доигрывает закрытие. isExpanded — визуально раскрыт.
  const [prevOpen, setPrevOpen] = useState(open);
  const [isRendered, setIsRendered] = useState(open);
  const [isExpanded, setIsExpanded] = useState(false);

  // Синхронизирует состояние во время рендера: при открытии добавляет слот в DOM, при закрытии сворачивает.
  if (open !== prevOpen) {
    setPrevOpen(open);

    if (open) {
      setIsRendered(true);
    } else {
      setIsExpanded(false);
    }
  }

  /**
   * После появления слота в DOM при `open` раскрывает панель на следующем кадре,
   * чтобы сыграла enter-анимация.
   */
  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    // Кадр задержки: сначала слот в DOM закрыт, затем раскрывает — иначе enter-анимация не играет.
    const frameId = requestAnimationFrame(() => {
      setIsExpanded(true);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [open]);

  /**
   * handleCloseClick — переносит фокус на раскрытую кнопку вне панели и затем вызывает `onClose`.
   */
  function handleCloseClick(): void {
    const slot = slotRef.current;
    const opener = slot !== null && id ? resolveExpandedPanelOpener(slot, id) : null;

    openerRef.current = opener;
    opener?.focus();
    onClose();
  }

  /**
   * handleTransitionEnd — убирает слот панели из DOM после завершения сворачивания.
   *
   * Как работает:
   * 1. Проверяет, что завершился переход `transform` и панель закрыта
   * 2. Если фокус всё ещё внутри, снова переносит его на кнопку открытия
   * 3. Не прячет слот, пока фокус внутри
   * 4. Убирает слот из DOM
   *
   * @param event событие завершения перехода на треке панели
   */
  function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>): void {
    if (event.propertyName !== 'transform' || open) {
      return;
    }

    const slot = slotRef.current;

    if (isFocusInSlot(slot)) {
      openerRef.current?.focus();
    }

    if (isFocusInSlot(slot)) {
      return;
    }

    openerRef.current = null;
    setIsRendered(false);
  }

  // Пользовательские действия первыми, кнопка сворачивания — последней, крайняя справа.
  const cardHeaderActions: IconButtonRowAction[] = [
    ...headerActions,
    {
      ariaControls: id,
      ariaExpanded: open,
      ariaLabel: iconAriaLabel,
      icon,
      onClick: handleCloseClick,
    },
  ];

  return (
    <StyledSidebar {...layoutProps}>
      <StyledSidebarContent ref={contentRef}>{children}</StyledSidebarContent>

      <StyledSidebarSlot
        aria-hidden={!isRendered}
        aria-labelledby={titleId}
        data-expanded={isExpanded ? 'true' : undefined}
        data-open={isRendered}
        id={id}
        ref={slotRef}
      >
        <StyledSidebarTrack
          data-open={isExpanded ? 'true' : undefined}
          onTransitionEnd={handleTransitionEnd}
        >
          <Card headerActions={cardHeaderActions} {...cardProps} titleId={titleId}>
            {sidebarContent}
          </Card>
        </StyledSidebarTrack>
      </StyledSidebarSlot>
    </StyledSidebar>
  );
}
