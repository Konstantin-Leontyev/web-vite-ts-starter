/**
 * Файл: `src/ui/open-control/open-control.styles.ts`
 * Содержит общий хром open-контролов: корень, ряд-триггер, кнопку-триггер
 * с каналом шеврона, поверхность выбираемой строки, обвязку панели,
 * скролл списка опций и именованные константы панели.
 *
 * Основные задачи:
 * 1. Типизировать пропсы поверхности через `OpenControlSurfaceStyleProps`
 * 2. Задать константы панели и шкалы: `OPEN_CONTROL_SELECTABLE_INSET`,
 *    `OPEN_CONTROL_ROW_GAP` и `OPEN_CONTROL_OPTIONS_LIST_INLINE_PADDING`
 * 3. Предоставить `getOpenControlRootStyles`,
 *    `getOpenControlOptionsListInlinePadding`,
 *    `getOpenControlTriggerRowStyles`, `getOpenControlTriggerStyles`,
 *    `getOpenControlSelectableRowSurfaceStyles`,
 *    `getOpenControlActiveRowHighlightStyles`, `getOpenControlPanelStyles`,
 *    `getOpenControlStackedPanelStyles`,
 *    `getOpenControlOptionsListScrollStyles` и
 *    `resolveEnabledOpenControlIndex`
 *
 * Потребители:
 *  - `src/ui/open-control/index.tsx` — реэкспортирует хелперы хрома в `@ui/open-control`
 *  - `src/ui/listbox/listbox.styles.ts` — подставляет корень, ряд и кнопку-триггер,
 *    панель, скролл списка, поверхность опции и подсветку активной строки
 *  - `src/ui/listbox/index.tsx` — ищет ближайшую доступную строку
 *  - `src/ui/range-input/range-input.styles.ts` — подставляет корень, ряд и
 *    кнопку-триггер и поверхность пресета
 *  - `src/ui/date-range-input/date-range-input.styles.ts` — подставляет корень,
 *    ряд-триггер и стековую панель
 */

import { getAnchoredPanelStyles } from '@ui/anchored-panel';
import { getBorderStyles, resolveBoxShadow } from '@ui/border';
import { getIconPositionStyles, resolveIconStateBackground } from '@ui/icon';
import { MOTION_CONTROL_DURATION, getTransitionStyles } from '@ui/motion';
import { getOutlineStyles } from '@ui/outline';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  resolveBlockRadius,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getSurfaceBackgroundColor } from '@ui/surface';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, resolvePressedBackground, type TonePreset } from '@ui/tones';

/**
 * OpenControlTriggerRowClearLayout — представляет вариант колонок clear в ряде-триггере.
 * `both-branches` — слот сброса в конце ряда и ветка `[data-slot='clear']:first-child`.
 * `trailing-only` — только слот сброса в конце ряда, без ветки `:first-child`.
 */
type OpenControlTriggerRowClearLayout = 'both-branches' | 'trailing-only';

/**
 * OpenControlSurfaceStyleProps — представляет пропсы стилизации поверхности open-control.
 *
 * @property borderTone — тон рамки ряда-триггера
 * @property shape — форма поверхности
 * @property size — размер компонента
 */
export type OpenControlSurfaceStyleProps = {
  borderTone?: TonePreset;
  shape?: ShapePreset;
  size?: SizePreset;
};

/**
 * OpenControlSelectableHighlight — представляет режим подсветки подложки
 * выбираемой строки: акцентный `primary` или вуаль `veil`.
 */
type OpenControlSelectableHighlight = 'primary' | 'veil';

/**
 * OpenControlSelectableRowSurfaceOptions — представляет настройки поверхности
 * выбираемой строки open-control.
 *
 * @property display — режим раскладки строки
 * @property gap — зазор между слотами строки
 * @property highlight — режим цвета подложки наведения
 * @property highlightWhen — селектор записи цвета в `::before`. Без значения —
 *   наведение и `:focus-visible`
 */
type OpenControlSelectableRowSurfaceOptions = {
  display: 'flex' | 'grid';
  gap?: SpacingValue;
  highlight: OpenControlSelectableHighlight;
  highlightWhen?: string;
};

/**
 * OPEN_CONTROL_PANEL_MAX_OPTION_ROWS — задаёт максимум видимых строк опций в панели.
 * Используется в `getOpenControlOptionsListScrollStyles` для `max-block-size`.
 */
const OPEN_CONTROL_PANEL_MAX_OPTION_ROWS = 6;

/**
 * OPEN_CONTROL_SELECTABLE_INSET — задаёт отступ подложки выбираемой строки от края.
 * Используется в `getOpenControlSelectableRowSurfaceStyles` и как
 * `padding-block-end` списка Listbox.
 */
export const OPEN_CONTROL_SELECTABLE_INSET: SpacingValue = 4;

/**
 * OPEN_CONTROL_OPTIONS_LIST_INLINE_PADDING — задаёт боковой отступ списка опций.
 * Используется в `getOpenControlOptionsListInlinePadding`.
 */
const OPEN_CONTROL_OPTIONS_LIST_INLINE_PADDING = 8 satisfies SpacingValue;

/**
 * getOpenControlOptionsListInlinePadding — возвращает ключ шкалы бокового отступа
 * списка опций.
 *
 * @returns ключ шкалы для `padding-inline` списка и отступа слота поиска
 *   по всем сторонам
 */
export function getOpenControlOptionsListInlinePadding(): SpacingValue {
  return OPEN_CONTROL_OPTIONS_LIST_INLINE_PADDING;
}

/**
 * OPEN_CONTROL_ROW_GAP — задаёт зазор между элементами ряда open-control.
 * Используется в `getOpenControlStackedPanelStyles`, стилях опций Listbox и
 * секциях панели RangeInput.
 */
export const OPEN_CONTROL_ROW_GAP: SpacingValue = 12;

/**
 * OPEN_CONTROL_PANEL_PADDING — задаёт внутренний отступ стековой панели open-control.
 * Используется в `getOpenControlStackedPanelStyles`.
 */
const OPEN_CONTROL_PANEL_PADDING: SpacingValue = 16;

/**
 * DEFAULT_SELECTABLE_HIGHLIGHT_WHEN — задаёт селектор подсветки подложки по умолчанию.
 * Используется, когда вызывающий код не передал `highlightWhen`.
 */
const DEFAULT_SELECTABLE_HIGHLIGHT_WHEN = `&:not(:disabled):hover::before,
    &:focus-visible::before`;

/**
 * resolveEnabledOpenControlIndex — возвращает индекс ближайшей доступной строки
 * от позиции `from` в направлении `step`.
 *
 * @param items перечень строк с опциональным `disabled`
 * @param from индекс, с которого начинается поиск
 * @param step направление обхода
 * @returns индекс доступной строки или `-1`, если доступной строки нет
 */
export function resolveEnabledOpenControlIndex<T extends { disabled?: boolean }>(
  items: readonly T[],
  from: number,
  step: -1 | 1
): number {
  for (let cursor = from; cursor >= 0 && cursor < items.length; cursor += step) {
    if (!items[cursor]?.disabled) {
      return cursor;
    }
  }

  return -1;
}

/**
 * resolveOpenControlBlockRadius — возвращает значение для CSS-свойства
 * `border-radius` поверхности open-control по `shape` и `size`.
 * Используется в `getOpenControlTriggerRowStyles`,
 * `getOpenControlSelectableRowSurfaceStyles`, `getOpenControlPanelStyles` и
 * `getOpenControlStackedPanelStyles`.
 *
 * @param shape форма поверхности
 * @param size размер компонента
 * @returns значение для CSS-свойства `border-radius`
 */
function resolveOpenControlBlockRadius(shape: ShapePreset, size: SizePreset): string {
  return resolveBlockRadius(shape, getMinBlockSize(size));
}

/**
 * getOpenControlRootStyles — возвращает CSS-правила корня open-control:
 * раскладку, зазор и ширину.
 * `null` не пишет `inline-size`: ширину задаёт сетка родителя. Вид `icon`
 * Listbox так и делает, чтобы `place-items` вызывающего кода центрировал
 * кнопку в растянутой ячейке, а ряд с `justify-items: start` сжимал корень
 * по содержимому.
 *
 * @param inlineSize ширина корня. Без аргумента — `100%`. `null` — не задавать
 * @returns CSS-правила, каждое с новой строки
 */
export function getOpenControlRootStyles(inlineSize: null | string = '100%'): string {
  const styles = [
    'display: grid;',
    `gap: ${getSpacingValue(8)};`,
    'min-inline-size: 0;',
  ];

  if (inlineSize !== null) {
    styles.push(`inline-size: ${inlineSize};`);
  }

  return styles.join('\n');
}

/**
 * getOpenControlTriggerRowStyles — возвращает CSS-правила ряда-триггера open-control:
 * габариты, заливку, рамку с тенью и `outline` фокуса.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолты `shape`, `size` и `iconTone`
 * 2. Собирает сетку ряда: колонки под слот сброса в конце ряда и при `clearLayout`
 *    `both-branches` докладывает ветку `[data-slot='clear']:first-child`
 * 3. Задаёт габариты, заливку `surface` через `getSurfaceBackgroundColor`,
 *    скругление через `resolveOpenControlBlockRadius`, рамку с тенью через
 *    `getBorderStyles` и фокус-контур на `&:has(:focus-visible)` через
 *    `getOutlineStyles`
 * 4. При `data-open='true'` скрывает ряд через `visibility: hidden`, чтобы панель
 *    наследовала ширину якоря без двойного отображения триггера
 * 5. При `writeClearPressed` на `&:has(> button:not(:disabled):active)` пишет
 *    `--clear-pressed-background` и `--clear-pressed-shadow`. Канал читает
 *    крестик слота Listbox и RangeInput: нажатие на поле вдавливает крестик.
 *    DateRangeInput параметр не включает: крестик там секция ряда, каналы
 *    не читает, вдавленность даёт сама кнопка
 *
 * @param props пропсы поверхности и тема
 * @param clearLayout вариант колонок clear, по умолчанию `both-branches`
 * @param writeClearPressed писать каналы вдавленности крестика. По умолчанию `true`
 * @returns CSS-правила, каждое с новой строки
 */
export function getOpenControlTriggerRowStyles(
  props: OpenControlSurfaceStyleProps & { iconTone?: TonePreset; theme: AppTheme },
  clearLayout: OpenControlTriggerRowClearLayout = 'both-branches',
  writeClearPressed: boolean = true
): string {
  const theme = getTheme(props);
  const {
    borderTone,
    iconTone = DEFAULT_TONE,
    shape = DEFAULT_SHAPE_PRESET,
    size = DEFAULT_SIZE_PRESET,
  } = props;
  const styles = [
    'display: grid;',
    'grid-template-columns: minmax(0, 1fr);',
    '&[data-has-clear] { grid-template-columns: minmax(0, 1fr) auto; }',
  ];

  if (clearLayout === 'both-branches') {
    styles.push(`&[data-has-clear]:has(> [data-slot='clear']:first-child) {
      grid-template-columns: auto minmax(0, 1fr);
    }`);
  }

  styles.push(
    'inline-size: 100%;',
    `min-block-size: ${getMinBlockSize(size)};`,
    'overflow: hidden;',
    `background-color: ${getSurfaceBackgroundColor(theme, 'surface')};`,
    `border-radius: ${resolveOpenControlBlockRadius(shape, size)};`,
    getBorderStyles(theme, undefined, undefined, borderTone),
    "&[data-open='true'] { visibility: hidden; }",
    `&:has(:focus-visible) {
      ${getOutlineStyles(theme.colors.focusOutline)}
    }`
  );

  if (writeClearPressed) {
    styles.push(`&:has(> button:not(:disabled):active) {
      --clear-pressed-background: ${resolvePressedBackground(theme, iconTone)};
      --clear-pressed-shadow: ${resolveBoxShadow(
        getBorderStyles(theme, true, false, DEFAULT_TONE, true, iconTone)
      )};
    }`);
  }

  return styles.join('\n');
}

/**
 * getOpenControlTriggerStyles — возвращает CSS-правила кнопки-триггера open-control:
 * раскладку позиции иконки и каналы `--icon-state-background` и `--icon-state-shadow`.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолт `iconTone`
 * 2. Считает заливку канала через `resolveIconStateBackground`
 * 3. Собирает сетку, раскладку позиции через `getIconPositionStyles`,
 *    выравнивание текста и запись канала на `:not(:disabled):hover` и
 *    `:focus-visible`. На фокусе снимает `outline`
 * 4. На `:not(:disabled):active` пишет в `--icon-state-background` заливку
 *    нажатия через `resolvePressedBackground` и в `--icon-state-shadow` рамку
 *    с тенью нажатия через `getBorderStyles` и `resolvePressedShadow`. Наведение канал
 *    не делит с нажатием. Недоступная кнопка селектор не берёт. Вдавленность
 *    читает шеврон, ряд-триггер её не получает
 *
 * @param props тон секции иконки и тема
 * @param textAlign выравнивание текста триггера, по умолчанию `start`
 * @returns CSS-правила, каждое с новой строки
 */
export function getOpenControlTriggerStyles(
  props: { iconTone?: TonePreset; theme: AppTheme },
  textAlign: 'center' | 'start' = 'start'
): string {
  const theme = getTheme(props);
  const { iconTone = DEFAULT_TONE } = props;
  const stateBackground = resolveIconStateBackground(theme, iconTone);
  const pressedBackground = resolvePressedBackground(theme, iconTone);
  const pressedShadow = resolveBoxShadow(
    getBorderStyles(theme, true, false, DEFAULT_TONE, true, iconTone)
  );

  return `
    display: grid;
    ${getIconPositionStyles()}
    align-items: center;
    min-inline-size: 0;
    text-align: ${textAlign};
    &:not(:disabled):hover {
      --icon-state-background: ${stateBackground};
    }
    &:focus-visible {
      outline: none;
      --icon-state-background: ${stateBackground};
    }
    &:not(:disabled):active {
      --icon-state-background: ${pressedBackground};
      --icon-state-shadow: ${pressedShadow};
    }
  `;
}

/**
 * getOpenControlSelectableRowSurfaceStyles — возвращает CSS-правила поверхности
 * выбираемой строки open-control: раскладку, габариты, заливку и подложку
 * наведения через `::before`.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолты `shape` и `size`
 * 2. Считает отступ подложки, скругление через `resolveOpenControlBlockRadius`
 *    и цвет подсветки по `highlight`
 * 3. Собирает раскладку, габариты и заливку `surface` через
 *    `getSurfaceBackgroundColor`
 * 4. Кладёт абсолютный `::before` с отступом от края, скруглением и переходом
 *    `background-color`
 * 5. Красит подложку по селектору `highlightWhen` или дефолтному наведению и фокусу
 *
 * @param props пропсы поверхности и тема
 * @param options раскладка, зазор, режим и селектор подсветки
 * @returns CSS-правила, каждое с новой строки
 */
export function getOpenControlSelectableRowSurfaceStyles(
  props: OpenControlSurfaceStyleProps & { theme: AppTheme },
  options: OpenControlSelectableRowSurfaceOptions
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, size = DEFAULT_SIZE_PRESET } = props;
  const inset = getSpacingValue(OPEN_CONTROL_SELECTABLE_INSET);
  const borderRadius = resolveOpenControlBlockRadius(shape, size);
  const highlightColor =
    options.highlight === 'primary' ? theme.colors.primary : theme.colors.veil;
  const highlightWhen = options.highlightWhen ?? DEFAULT_SELECTABLE_HIGHLIGHT_WHEN;
  const styles = ['position: relative;', 'z-index: 0;', `display: ${options.display};`];

  if (options.gap !== undefined) {
    styles.push(`gap: ${getSpacingValue(options.gap)};`);
  }

  styles.push(
    'align-items: center;',
    'inline-size: 100%;',
    `min-block-size: ${getMinBlockSize(size)};`,
    'text-align: start;',
    `background-color: ${getSurfaceBackgroundColor(theme, 'surface')};`,
    `&::before {
      position: absolute;
      inset: ${inset};
      z-index: -1;
      pointer-events: none;
      content: '';
      border-radius: calc(${borderRadius} - ${inset});
      ${getTransitionStyles('background-color', MOTION_CONTROL_DURATION)}
    }`,
    '&:focus { outline: none; }',
    `${highlightWhen} {
      background-color: ${highlightColor};
    }`
  );

  return styles.join('\n');
}

/**
 * getOpenControlActiveRowHighlightStyles — возвращает CSS-правила подсветки
 * активной строки open-control: цвет текста на `[data-active='true']`.
 * Галочка этот цвет наследует: свой `color` она пишет только вне активной строки.
 *
 * @param theme текущая тема
 * @returns CSS-правила, каждое с новой строки
 */
export function getOpenControlActiveRowHighlightStyles(theme: AppTheme): string {
  return `
    &[data-active='true'] {
      color: ${theme.colors.inverse};
    }
  `;
}

/**
 * getOpenControlPanelStyles — возвращает CSS-правила хрома панели
 * open-control: позицию, сброс UA-стилей `[popover]`, заливку, рамку с тенью,
 * скругление и `outline`.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолты `shape` и `size`
 * 2. Считает скругление через `resolveOpenControlBlockRadius`
 * 3. Подставляет хром панели через `getAnchoredPanelStyles`
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
export function getOpenControlPanelStyles(
  props: OpenControlSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, size = DEFAULT_SIZE_PRESET } = props;

  return getAnchoredPanelStyles({
    borderRadius: resolveOpenControlBlockRadius(shape, size),
    theme,
  });
}

/**
 * getOpenControlStackedPanelStyles — возвращает CSS-правила стековой
 * панели open-control: сетку, зазор ряда, хром панели и отступ
 * `OPEN_CONTROL_PANEL_PADDING`.
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
export function getOpenControlStackedPanelStyles(
  props: OpenControlSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, size = DEFAULT_SIZE_PRESET } = props;

  return `
    display: grid;
    gap: ${getSpacingValue(OPEN_CONTROL_ROW_GAP)};
    ${getAnchoredPanelStyles({
      borderRadius: resolveOpenControlBlockRadius(shape, size),
      padding: getSpacingValue(OPEN_CONTROL_PANEL_PADDING),
      theme,
    })}
  `;
}

/**
 * getOpenControlOptionsListScrollStyles — возвращает CSS-правила скролла списка
 * опций open-control: боковой отступ, ограничение высоты по
 * `OPEN_CONTROL_PANEL_MAX_OPTION_ROWS` и `overflow: hidden auto`.
 * Отступ один на обе стороны: выделение не заходит под бегунок и не липнет
 * к левому краю, со скроллом и без него.
 *
 * @param size размер компонента
 * @returns CSS-правила, каждое с новой строки
 */
export function getOpenControlOptionsListScrollStyles(size: SizePreset): string {
  return `
    padding-inline: ${getSpacingValue(getOpenControlOptionsListInlinePadding())};
    max-block-size: calc(${getMinBlockSize(size)} * ${OPEN_CONTROL_PANEL_MAX_OPTION_ROWS});
    overflow: hidden auto;
  `;
}
