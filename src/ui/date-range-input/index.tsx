/**
 * Файл: `src/ui/date-range-input/index.tsx`
 * Предоставляет компонент DateRangeInput для отображения выбора диапазона дат.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - форму через проп `shape`
 *  - кнопка сброса внутри ряда всегда `square`. Публичного пропа формы сброса нет:
 *    иначе шов с соседней кнопкой поедет
 *  - тон рамки через проп `borderTone`
 *  - форму кнопок подвала через проп `buttonShape`. Без `buttonShape` совпадает
 *    с `shape`
 *  - форму подсветки дня через проп `dayShape`. Без `dayShape` совпадает с `shape`
 *  - недоступное состояние через проп `disabled`
 *  - конечный день диапазона через проп `endDay`
 *  - текст `title` конечного сегмента через проп `endLabel`. Видимым лейблом
 *    сегмента не является
 *  - верхнюю границу допустимых дней через проп `maxDay`
 *  - нижнюю границу допустимых дней через проп `minDay`
 *  - обработчик сброса диапазона через проп `onClear`. Без обработчика кнопка
 *    сброса не показывается
 *  - доступное имя кнопки сброса через проп `clearAriaLabel`. Без пропа —
 *    `Clear date range`. Пустая строка остаётся этой фразой
 *  - обработчик изменения конечного дня через проп `onEndDayChange`
 *  - обработчик изменения начального дня через проп `onStartDayChange`
 *  - начальный день диапазона через проп `startDay`
 *  - текст `title` начального сегмента через проп `startLabel`. Видимым лейблом
 *    сегмента не является
 *  - видимый текст кнопки подтверждения через проп `commitLabel`. Без пропа — `Set`.
 *    Пустая строка прячет текст, доступное имя остаётся этой фразой
 *  - видимый текст кнопки сброса черновика через проп `resetLabel`. Без пропа — `Reset`.
 *    Пустая строка прячет текст, доступное имя остаётся этой фразой
 *  - видимый текст кнопки закрытия панели через проп `dismissLabel`. Без пропа — `Close`.
 *    Пустая строка прячет текст, доступное имя остаётся этой фразой
 *  - доступное имя панели через проп `panelAriaLabel`. Без пропа —
 *    `Date range calendar`. Пустая строка остаётся этой фразой
 *  - доступное имя кнопки «год назад» через проп `previousYearAriaLabel`. Без пропа —
 *    `Previous year`. Пустая строка остаётся этой фразой
 *  - доступное имя кнопки «месяц назад» через проп `previousMonthAriaLabel`. Без пропа —
 *    `Previous month`. Пустая строка остаётся этой фразой
 *  - доступное имя кнопки «месяц вперёд» через проп `nextMonthAriaLabel`. Без пропа —
 *    `Next month`. Пустая строка остаётся этой фразой
 *  - доступное имя кнопки «год вперёд» через проп `nextYearAriaLabel`. Без пропа —
 *    `Next year`. Пустая строка остаётся этой фразой
 *  - локаль оформления даты через проп `locale`. Без пропа панель берёт `en-US`.
 *    Пустая строка, пробелы и неразбираемая метка остаются этой локалью
 *  - подписи дней недели через проп `weekdayLabels`. Без пропа подписи берутся
 *    из локали: у `en-US` это `Mon` … `Sun`. Переданные подписи сильнее локали.
 *    Пустая строка дня прячет видимую подпись, доступное имя остаётся подписью
 *    этого дня в локали
 *  - иконка календаря всегда в позиции `start`. Публичного пропа позиции нет
 *  - подпись над рядом через проп `label`
 *  - черновик диапазона в открытой панели: клики по дням не пишут наружу до
 *    подтверждения. Пробел на дне тоже только пишет черновик. `Enter` на дне
 *    обновляет черновик и подтверждает, как `Set`.
 *    `Enter` на `Close`, `Escape` и клик снаружи закрывают без подтверждения.
 *    `Reset` и `Enter` на нём чистят черновик без закрытия
 *
 * Основные задачи:
 * 1. Экспортировать компонент DateRangeInput
 * 2. Типизировать пропсы через `DateRangeInputProps`
 * 3. Выставлять `role="group"` и `aria-labelledby` при передаче `label`, а также
 *    `aria`-атрибуты сегментов и панели календаря.
 *    Фокус панели — на выбранном дне, иначе на сегодняшнем, иначе на первом доступном.
 *    Подвал панели — одна Tab-остановка со стрелками между кнопками
 * 4. Реэкспортировать `DEFAULT_CALENDAR_LOCALE`, `DEFAULT_CALENDAR_WEEKDAY_LABELS`,
 *    `resolveCalendarLocale`, `resolveCalendarWeekdayLabels`, `todayUtc`
 *    и тип `CalendarWeekdayLabels` из `src/ui/date-range-input/calendar-panel`,
 *    а также дефолты `DEFAULT_DATE_RANGE_INPUT_COMMIT_LABEL`,
 *    `DEFAULT_DATE_RANGE_INPUT_DISMISS_LABEL` и `DEFAULT_DATE_RANGE_INPUT_RESET_LABEL`
 *
 * Потребители:
 *  - страницы приложения — выбирают диапазон дат
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import {
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent,
} from 'react';

import { useAnchoredOpen } from '@hooks/use-anchored-open';
import { CalendarIcon, CloseIcon } from '@icons';
import { AnchoredPanel } from '@ui/anchored-panel';
import { FieldLabel } from '@ui/field-label';
import { Icon } from '@ui/icon';
import { DEFAULT_SHAPE_PRESET, getTextSize, type ShapePreset } from '@ui/presets';
import {
  SEGMENT_BUTTON_PARTS_FLUSH_SHAPE,
  SegmentButtonParts,
  SegmentButtonPartsDivider,
} from '@ui/segment-button-parts';

import {
  CalendarPanel,
  DATE_PLACEHOLDER,
  formatIsoDayCompact,
  isIsoDayAfter,
  monthViewFromIsoDayOrToday,
  type CalendarWeekdayLabels,
  type MonthView,
} from './calendar-panel';
import {
  StyledDateRangeInputPanel,
  StyledDateRangeInputRoot,
  StyledDateRangeInputTriggerRow,
  splitLayoutProps,
  type DateRangeInputStyleProps,
} from './date-range-input.styles';

/**
 * DEFAULT_DATE_RANGE_INPUT_DISABLED — задаёт недоступное состояние по умолчанию.
 * Используется, когда вызывающий код не передал проп `disabled`.
 */
const DEFAULT_DATE_RANGE_INPUT_DISABLED = false;

/**
 * DEFAULT_DATE_RANGE_INPUT_END_DAY — задаёт конечный день диапазона по умолчанию.
 * Используется, когда вызывающий код не передал проп `endDay`.
 */
const DEFAULT_DATE_RANGE_INPUT_END_DAY = '';

/**
 * DEFAULT_DATE_RANGE_INPUT_END_LABEL — задаёт текст `title` конечного сегмента по умолчанию.
 * Используется, когда вызывающий код не передал проп `endLabel`.
 */
const DEFAULT_DATE_RANGE_INPUT_END_LABEL = 'End date';

/**
 * DEFAULT_DATE_RANGE_INPUT_START_DAY — задаёт начальный день диапазона по умолчанию.
 * Используется, когда вызывающий код не передал проп `startDay`.
 */
const DEFAULT_DATE_RANGE_INPUT_START_DAY = '';

/**
 * DEFAULT_DATE_RANGE_INPUT_START_LABEL — задаёт текст `title` начального сегмента по умолчанию.
 * Используется, когда вызывающий код не передал проп `startLabel`.
 */
const DEFAULT_DATE_RANGE_INPUT_START_LABEL = 'Start date';

/**
 * DEFAULT_DATE_RANGE_INPUT_COMMIT_LABEL — задаёт видимый текст кнопки подтверждения по умолчанию.
 * Используется, когда вызывающий код не передал проп `commitLabel`.
 */
const DEFAULT_DATE_RANGE_INPUT_COMMIT_LABEL = 'Set';

/**
 * DEFAULT_DATE_RANGE_INPUT_RESET_LABEL — задаёт видимый текст кнопки сброса черновика по умолчанию.
 * Используется, когда вызывающий код не передал проп `resetLabel`.
 */
const DEFAULT_DATE_RANGE_INPUT_RESET_LABEL = 'Reset';

/**
 * DEFAULT_DATE_RANGE_INPUT_DISMISS_LABEL — задаёт видимый текст кнопки закрытия панели по умолчанию.
 * Используется, когда вызывающий код не передал проп `dismissLabel`.
 */
const DEFAULT_DATE_RANGE_INPUT_DISMISS_LABEL = 'Close';

/**
 * DEFAULT_DATE_RANGE_INPUT_PANEL_ARIA_LABEL — задаёт доступное имя диалога панели по умолчанию.
 * Используется, когда вызывающий код не передал проп `panelAriaLabel`.
 */
const DEFAULT_DATE_RANGE_INPUT_PANEL_ARIA_LABEL = 'Date range calendar';

/**
 * DEFAULT_DATE_RANGE_INPUT_CLEAR_ARIA_LABEL — задаёт доступное имя кнопки сброса диапазона по умолчанию.
 * Используется, когда вызывающий код не передал проп `clearAriaLabel`.
 */
const DEFAULT_DATE_RANGE_INPUT_CLEAR_ARIA_LABEL = 'Clear date range';

/**
 * DateRangeInputClearProps — представляет пропсы кнопки сброса DateRangeInput.
 * Имя сброса допустимо только вместе с обработчиком сброса.
 *
 * @property clearAriaLabel — доступное имя кнопки сброса. Без пропа — `Clear date range`.
 *   Пустая строка остаётся этой фразой
 * @property onClear — обработчик сброса диапазона. Без обработчика кнопка сброса
 *   не показывается
 */
type DateRangeInputClearProps =
  | {
      clearAriaLabel?: never;
      onClear?: never;
    }
  | {
      clearAriaLabel?: string;
      onClear: () => void;
    };

/**
 * DateRangeInputProps — представляет пропсы компонента DateRangeInput.
 *
 * @property buttonShape — форма кнопок подвала панели. Без пропа совпадает с `shape`
 * @property commitLabel — видимый текст кнопки подтверждения. Без пропа — `Set`.
 *   Пустая строка прячет текст, доступное имя остаётся этой фразой
 * @property dayShape — форма подсветки дня в панели. Без пропа совпадает с `shape`
 * @property disabled — включает недоступное состояние
 * @property dismissLabel — видимый текст кнопки закрытия панели. Без пропа — `Close`.
 *   Пустая строка прячет текст, доступное имя остаётся этой фразой
 * @property endDay — конечный день диапазона в формате ISO
 * @property endLabel — текст `title` конечного сегмента. Видимым лейблом сегмента не является
 * @property label — подпись над рядом сегментов
 * @property locale — локаль оформления даты. Без пропа панель берёт `en-US`.
 *   Пустая строка, пробелы и неразбираемая метка остаются этой локалью
 * @property maxDay — верхняя граница допустимых дней в формате ISO
 * @property minDay — нижняя граница допустимых дней в формате ISO
 * @property nextMonthAriaLabel — доступное имя кнопки «месяц вперёд». Без пропа —
 *   `Next month`. Пустая строка остаётся этой фразой
 * @property nextYearAriaLabel — доступное имя кнопки «год вперёд». Без пропа —
 *   `Next year`. Пустая строка остаётся этой фразой
 * @property onEndDayChange — обработчик изменения конечного дня
 * @property onStartDayChange — обработчик изменения начального дня
 * @property panelAriaLabel — доступное имя диалога панели. Без пропа —
 *   `Date range calendar`. Пустая строка остаётся этой фразой
 * @property previousMonthAriaLabel — доступное имя кнопки «месяц назад». Без пропа —
 *   `Previous month`. Пустая строка остаётся этой фразой
 * @property previousYearAriaLabel — доступное имя кнопки «год назад». Без пропа —
 *   `Previous year`. Пустая строка остаётся этой фразой
 * @property resetLabel — видимый текст кнопки сброса черновика. Без пропа — `Reset`.
 *   Пустая строка прячет текст, доступное имя остаётся этой фразой
 * @property startDay — начальный день диапазона в формате ISO
 * @property startLabel — текст `title` начального сегмента. Видимым лейблом сегмента не является
 * @property weekdayLabels — подписи дней недели с понедельника по воскресенье.
 *   Без пропа подписи берутся из локали. Переданные подписи сильнее.
 *   Пустая строка дня прячет видимую подпись, доступное имя остаётся подписью
 *   этого дня в локали
 */
type DateRangeInputProps = DateRangeInputStyleProps &
  DateRangeInputClearProps &
  Omit<
    ComponentPropsWithRef<'div'>,
    | 'className'
    | 'endDay'
    | 'onChange'
    | 'startDay'
    | 'style'
    | keyof DateRangeInputStyleProps
  > & {
    buttonShape?: ShapePreset;
    commitLabel?: string;
    dayShape?: ShapePreset;
    disabled?: boolean;
    dismissLabel?: string;
    endDay?: string;
    endLabel?: string;
    label?: string;
    locale?: string;
    maxDay?: string;
    minDay?: string;
    nextMonthAriaLabel?: string;
    nextYearAriaLabel?: string;
    onEndDayChange?: (endDay: string) => void;
    onStartDayChange?: (startDay: string) => void;
    panelAriaLabel?: string;
    previousMonthAriaLabel?: string;
    previousYearAriaLabel?: string;
    resetLabel?: string;
    startDay?: string;
    startLabel?: string;
    weekdayLabels?: CalendarWeekdayLabels;
  };

/**
 * formatSegmentText — возвращает компактный текст дня или плейсхолдер пустого значения.
 *
 * @param isoDay день в формате ISO или пустая строка
 * @returns компактная дата или `DATE_PLACEHOLDER`
 */
function formatSegmentText(isoDay: string): string {
  return isoDay !== '' ? formatIsoDayCompact(isoDay) : DATE_PLACEHOLDER;
}

/**
 * minIsoDay — возвращает более ранний из двух ISO-дней.
 *
 * @param left первый день
 * @param right второй день
 * @returns более ранний день
 */
function minIsoDay(left: string, right: string): string {
  return isIsoDayAfter(left, right) ? right : left;
}

/**
 * maxIsoDay — возвращает более поздний из двух ISO-дней.
 *
 * @param left первый день
 * @param right второй день
 * @returns более поздний день
 */
function maxIsoDay(left: string, right: string): string {
  return isIsoDayAfter(left, right) ? left : right;
}

/**
 * isoDayUtcMs — возвращает UTC-миллисекунды полуночи ISO-дня.
 *
 * @param isoDay день в формате ISO
 * @returns миллисекунды UTC
 */
function isoDayUtcMs(isoDay: string): number {
  return Date.parse(`${isoDay}T00:00:00.000Z`);
}

/**
 * moveNearestRangeEdge — сдвигает ближайший край диапазона к выбранному дню.
 * При равной дистанции предпочитает начальный край. После сдвига края
 * упорядочиваются через `min`/`max`.
 *
 * @param startDay текущий начальный день
 * @param endDay текущий конечный день
 * @param isoDay выбранный день
 * @returns новая пара краёв
 */
function moveNearestRangeEdge(
  startDay: string,
  endDay: string,
  isoDay: string
): { end: string; start: string } {
  const rangeStart = minIsoDay(startDay, endDay);
  const rangeEnd = maxIsoDay(startDay, endDay);
  const clickMs = isoDayUtcMs(isoDay);
  const distStart = Math.abs(clickMs - isoDayUtcMs(rangeStart));
  const distEnd = Math.abs(clickMs - isoDayUtcMs(rangeEnd));

  if (distStart <= distEnd) {
    return {
      end: maxIsoDay(isoDay, rangeEnd),
      start: minIsoDay(isoDay, rangeEnd),
    };
  }

  return {
    end: maxIsoDay(rangeStart, isoDay),
    start: minIsoDay(rangeStart, isoDay),
  };
}

/**
 * resolveDraftRange — возвращает края черновика после выбора дня, без отдельных фаз начала и конца.
 *
 * Как работает:
 * 1. При пустом или неполном черновике ставит оба края на выбранный день
 * 2. При однодневном собирает пару из более раннего и более позднего дня. Тот же
 *    день остаётся однодневным
 * 3. При полном диапазоне сдвигает ближайший край к выбранному дню наружу и внутрь
 *
 * @param startDay текущий начальный день черновика
 * @param endDay текущий конечный день черновика
 * @param isoDay выбранный день
 * @returns новая пара краёв
 */
function resolveDraftRange(
  startDay: string,
  endDay: string,
  isoDay: string
): { end: string; start: string } {
  if (startDay === '' || endDay === '') {
    return { end: isoDay, start: isoDay };
  }

  if (startDay === endDay) {
    return {
      end: maxIsoDay(startDay, isoDay),
      start: minIsoDay(startDay, isoDay),
    };
  }

  return moveNearestRangeEdge(startDay, endDay, isoDay);
}

/**
 * resolveFooterLabel — возвращает видимый текст кнопки подвала и имя без текста.
 * Пустая строка прячет текст. Доступное имя тогда — умолчание кнопки.
 *
 * @param value переданный текст
 * @param fallback умолчание кнопки
 * @returns подпись и доступное имя пустой кнопки
 */
function resolveFooterLabel(
  value: string,
  fallback: string
): { ariaLabel?: string; label: string } {
  if (value.trim() === '') {
    return { ariaLabel: fallback, label: '' };
  }

  return { label: value };
}

/**
 * DateRangeInput — отображает поле выбора диапазона дат с панелью календаря.
 *
 * @example
 * <DateRangeInput
 *   startDay={from}
 *   endDay={to}
 *   onStartDayChange={setFrom}
 *   onEndDayChange={setTo}
 *   onClear={clearRange}
 * />
 */
export function DateRangeInput({
  borderTone,
  buttonShape: buttonShapeProp,
  clearAriaLabel,
  commitLabel = DEFAULT_DATE_RANGE_INPUT_COMMIT_LABEL,
  dayShape: dayShapeProp,
  disabled = DEFAULT_DATE_RANGE_INPUT_DISABLED,
  dismissLabel = DEFAULT_DATE_RANGE_INPUT_DISMISS_LABEL,
  endDay = DEFAULT_DATE_RANGE_INPUT_END_DAY,
  endLabel = DEFAULT_DATE_RANGE_INPUT_END_LABEL,
  label,
  locale,
  maxDay,
  minDay,
  nextMonthAriaLabel,
  nextYearAriaLabel,
  onClear,
  onEndDayChange,
  onStartDayChange,
  panelAriaLabel,
  previousMonthAriaLabel,
  previousYearAriaLabel,
  resetLabel = DEFAULT_DATE_RANGE_INPUT_RESET_LABEL,
  shape,
  size,
  startDay = DEFAULT_DATE_RANGE_INPUT_START_DAY,
  startLabel = DEFAULT_DATE_RANGE_INPUT_START_LABEL,
  weekdayLabels,
  ...rest
}: DateRangeInputProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const { handleClose, handleOpen, isOpen, panelRef } =
    useAnchoredOpen<HTMLDivElement>();
  const [draftStartDay, setDraftStartDay] = useState(startDay);
  const [draftEndDay, setDraftEndDay] = useState(endDay);
  const [viewMonth, setViewMonth] = useState<MonthView>(() =>
    monthViewFromIsoDayOrToday(startDay, maxDay)
  );
  const [footerTabStop, setFooterTabStop] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRowRef = useRef<HTMLDivElement>(null);
  const startTriggerRef = useRef<HTMLButtonElement>(null);
  const endTriggerRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement>(null);
  const selectedDayRef = useRef<HTMLButtonElement>(null);
  const todayDayRef = useRef<HTMLButtonElement>(null);
  const firstAvailableDayRef = useRef<HTMLButtonElement>(null);
  const commitButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const dismissButtonRef = useRef<HTMLButtonElement>(null);
  const labelId = useId();
  const panelId = useId();
  const buttonShape = buttonShapeProp ?? shape ?? DEFAULT_SHAPE_PRESET;
  const dayShape = dayShapeProp ?? shape ?? DEFAULT_SHAPE_PRESET;
  const surfaceProps = { borderTone, shape, size };
  const calendarIcon = <CalendarIcon />;
  const isActive = startDay !== '' || endDay !== '';
  const showClear = isActive && onClear !== undefined && !disabled;
  const textSizePreset = getTextSize(size);

  function handleOpenFromSegment(sourceDay: string): void {
    if (disabled) {
      return;
    }

    setDraftStartDay(startDay);
    setDraftEndDay(endDay);
    setViewMonth(monthViewFromIsoDayOrToday(sourceDay, maxDay));
    returnFocusRef.current = triggerRowRef.current;
    handleOpen();
  }

  /**
   * handleSelectDay — пишет черновик диапазона по клику и не отдаёт его наружу.
   *
   * @param isoDay выбранный день в формате ISO
   */
  function handleSelectDay(isoDay: string): void {
    const next = resolveDraftRange(draftStartDay, draftEndDay, isoDay);

    setDraftStartDay(next.start);
    setDraftEndDay(next.end);
  }

  /**
   * applyDraft — записывает края черновика наружу и закрывает панель.
   *
   * @param start начальный день
   * @param end конечный день
   */
  function applyDraft(start: string, end: string): void {
    onStartDayChange?.(start);
    onEndDayChange?.(end);
    returnFocusRef.current = triggerRowRef.current;
    handleClose();
  }

  function handleCommit(): void {
    applyDraft(draftStartDay, draftEndDay);
  }

  /**
   * handleCommitDay — записывает черновик указанного дня и подтверждает диапазон.
   *
   * @param isoDay подтверждаемый день
   */
  function handleCommitDay(isoDay: string): void {
    const next = resolveDraftRange(draftStartDay, draftEndDay, isoDay);

    setDraftStartDay(next.start);
    setDraftEndDay(next.end);
    applyDraft(next.start, next.end);
  }

  function handlePanelReset(): void {
    setDraftStartDay('');
    setDraftEndDay('');
    setViewMonth(monthViewFromIsoDayOrToday('', maxDay));
  }

  function handlePanelDismiss(): void {
    returnFocusRef.current = triggerRowRef.current;
    handleClose();
  }

  function handleClear(event: { stopPropagation: () => void }): void {
    event.stopPropagation();

    if (disabled) {
      return;
    }

    onClear?.();
    returnFocusRef.current = triggerRowRef.current;
    handleClose();
  }

  function handleOpenFocus(): void {
    (
      selectedDayRef.current ??
      todayDayRef.current ??
      firstAvailableDayRef.current
    )?.focus();
  }

  function handleSegmentKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (event.key !== 'ArrowDown') {
      return;
    }

    event.preventDefault();

    if (event.currentTarget === startTriggerRef.current) {
      handleOpenStart();
      return;
    }

    handleOpenEnd();
  }

  function handleFooterKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ): void {
    const footerRefs = [commitButtonRef, resetButtonRef, dismissButtonRef];
    const isRtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const previousKey = isRtl ? 'ArrowRight' : 'ArrowLeft';
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowUp':
      case previousKey: {
        nextIndex = (index + footerRefs.length - 1) % footerRefs.length;
        break;
      }
      case 'ArrowDown':
      case nextKey: {
        nextIndex = (index + 1) % footerRefs.length;
        break;
      }
      case 'End': {
        nextIndex = footerRefs.length - 1;
        break;
      }
      case 'Home': {
        nextIndex = 0;
        break;
      }
      default: {
        return;
      }
    }

    event.preventDefault();

    if (nextIndex === index) {
      return;
    }

    setFooterTabStop(nextIndex);
    footerRefs[nextIndex]?.current?.focus();
  }

  function handleOpenStart(): void {
    handleOpenFromSegment(startDay);
  }

  function handleOpenEnd(): void {
    handleOpenFromSegment(endDay);
  }

  const leftSegment = {
    active: isOpen,
    ariaControls: panelId,
    ariaExpanded: isOpen,
    ariaHaspopup: 'dialog' as const,
    disabled,
    icon: calendarIcon,
    iconPosition: 'start' as const,
    ref: startTriggerRef,
    label: formatSegmentText(startDay),
    textTone: startDay === '' ? ('muted' as const) : undefined,
    title: startLabel,
    onClick: handleOpenStart,
    onKeyDown: handleSegmentKeyDown,
  };

  const rightSegment = {
    active: isOpen,
    ariaControls: panelId,
    ariaExpanded: isOpen,
    ariaHaspopup: 'dialog' as const,
    disabled,
    icon: calendarIcon,
    iconPosition: 'start' as const,
    ref: endTriggerRef,
    label: formatSegmentText(endDay),
    textTone: endDay === '' ? ('muted' as const) : undefined,
    title: endLabel,
    onClick: handleOpenEnd,
    onKeyDown: handleSegmentKeyDown,
  };

  const labelledBy = label ? labelId : undefined;

  return (
    <StyledDateRangeInputRoot
      aria-labelledby={labelledBy}
      ref={rootRef}
      role={labelledBy ? 'group' : undefined}
      {...layoutProps}
      {...restProps}
    >
      <FieldLabel id={labelId}>{label}</FieldLabel>
      <StyledDateRangeInputTriggerRow
        data-has-clear={showClear ? true : undefined}
        data-open={isOpen ? 'true' : undefined}
        ref={triggerRowRef}
        tabIndex={-1}
        {...surfaceProps}
      >
        <SegmentButtonParts
          left={leftSegment}
          right={rightSegment}
          // Прямые углы: скругление даёт обрезка ряда-триггера, не сегменты.
          shape={SEGMENT_BUTTON_PARTS_FLUSH_SHAPE}
          size={size}
          textSize={textSizePreset}
        />

        {showClear && (
          <>
            <SegmentButtonPartsDivider aria-hidden="true" size={size} />
            {/* Секция ряда, не слот сброса: наведение и нажатие красит сама кнопка. */}
            <Icon
              aria-label={
                clearAriaLabel !== undefined && clearAriaLabel.trim() !== ''
                  ? clearAriaLabel
                  : DEFAULT_DATE_RANGE_INPUT_CLEAR_ARIA_LABEL
              }
              as="button"
              disabled={disabled}
              shape="square"
              showBorder={false}
              size={size}
              onClick={handleClear}
            >
              <CloseIcon />
            </Icon>
          </>
        )}
      </StyledDateRangeInputTriggerRow>

      <AnchoredPanel
        anchorRef={triggerRowRef}
        dismissZoneRefs={[rootRef, panelRef]}
        open={isOpen}
        panelRef={panelRef}
        returnFocusRef={returnFocusRef}
        onDismiss={handlePanelDismiss}
        onOpenFocus={handleOpenFocus}
      >
        <StyledDateRangeInputPanel
          aria-label={
            panelAriaLabel !== undefined && panelAriaLabel.trim() !== ''
              ? panelAriaLabel
              : DEFAULT_DATE_RANGE_INPUT_PANEL_ARIA_LABEL
          }
          aria-modal={true}
          id={panelId}
          ref={panelRef}
          role="dialog"
          {...surfaceProps}
        >
          <CalendarPanel
            dayShape={dayShape}
            firstAvailableDayRef={firstAvailableDayRef}
            locale={locale}
            maxDay={maxDay}
            minDay={minDay}
            nextMonthAriaLabel={nextMonthAriaLabel}
            nextYearAriaLabel={nextYearAriaLabel}
            previousMonthAriaLabel={previousMonthAriaLabel}
            previousYearAriaLabel={previousYearAriaLabel}
            rangeEnd={draftEndDay}
            rangeStart={draftStartDay}
            selectedDayRef={selectedDayRef}
            shape={shape}
            size={size}
            todayDayRef={todayDayRef}
            viewMonth={viewMonth}
            weekdayLabels={weekdayLabels}
            onCommitDay={handleCommitDay}
            onSelectDay={handleSelectDay}
            onViewMonthChange={setViewMonth}
          />
          <SegmentButtonParts
            center={{
              ...resolveFooterLabel(resetLabel, DEFAULT_DATE_RANGE_INPUT_RESET_LABEL),
              ref: resetButtonRef,
              tabIndex: footerTabStop === 1 ? 0 : -1,
              textTone: 'danger',
              onClick: handlePanelReset,
              onFocus: () => setFooterTabStop(1),
              onKeyDown: (event) => handleFooterKeyDown(event, 1),
            }}
            left={{
              ...resolveFooterLabel(commitLabel, DEFAULT_DATE_RANGE_INPUT_COMMIT_LABEL),
              ref: commitButtonRef,
              tabIndex: footerTabStop === 0 ? 0 : -1,
              textTone: 'success',
              onClick: handleCommit,
              onFocus: () => setFooterTabStop(0),
              onKeyDown: (event) => handleFooterKeyDown(event, 0),
            }}
            right={{
              ...resolveFooterLabel(
                dismissLabel,
                DEFAULT_DATE_RANGE_INPUT_DISMISS_LABEL
              ),
              ref: dismissButtonRef,
              tabIndex: footerTabStop === 2 ? 0 : -1,
              onClick: handlePanelDismiss,
              onFocus: () => setFooterTabStop(2),
              onKeyDown: (event) => handleFooterKeyDown(event, 2),
            }}
            shape={buttonShape}
            size={size}
            textSize={textSizePreset}
          />
        </StyledDateRangeInputPanel>
      </AnchoredPanel>
    </StyledDateRangeInputRoot>
  );
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт утилит календаря и дефолтов текста */
export {
  DEFAULT_CALENDAR_LOCALE,
  DEFAULT_CALENDAR_WEEKDAY_LABELS,
  resolveCalendarLocale,
  resolveCalendarWeekdayLabels,
  todayUtc,
  type CalendarWeekdayLabels,
} from './calendar-panel';
export {
  DEFAULT_DATE_RANGE_INPUT_COMMIT_LABEL,
  DEFAULT_DATE_RANGE_INPUT_DISMISS_LABEL,
  DEFAULT_DATE_RANGE_INPUT_RESET_LABEL,
};
