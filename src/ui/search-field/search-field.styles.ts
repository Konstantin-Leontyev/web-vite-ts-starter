/**
 * Файл: `src/ui/search-field/search-field.styles.ts`
 * Определяет внешний вид компонента SearchField.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `SearchFieldStyleProps`, `SearchFieldRowStyleProps`
 *    и `SearchFieldControlStyleProps`
 * 2. Предоставить styled-узлы `StyledSearchFieldRoot`, `StyledSearchFieldRow`
 *    и `StyledSearchFieldControl`
 * 3. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/search-field/index.tsx` — собирает компонент SearchField
 */

import styled from 'styled-components';

import {
  BORDER_PROP_NAMES,
  DEFAULT_SHOW_BORDER,
  DEFAULT_SHOW_SHADOW,
  getBorderStyles,
  type BorderProps,
} from '@ui/border';
import { getControlRootStyles } from '@ui/control-root';
import { getIconPositionStyles, resolveIconStateBackground } from '@ui/icon';
import { LAYOUT_PROP_NAMES, type LayoutProps } from '@ui/layout';
import { getNativeFieldStyles } from '@ui/native-field';
import { getOutlineStyles } from '@ui/outline';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  resolveBlockRadius,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSurfaceBackgroundColor } from '@ui/surface';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, resolvePressedBackground, type TonePreset } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * SearchFieldStyleProps — представляет пропсы стилизации SearchField и layout-пропсы.
 *
 * @property shape — форма строки-поля
 * @property showOutline — включает обводку фокуса. Без пропа обводка есть и без
 *   рамки. `false` гасит её
 * @property size — размер контрола
 * @property tinted — включает мягкую заливку
 */
export type SearchFieldStyleProps = LayoutProps &
  BorderProps & {
    shape?: ShapePreset;
    showOutline?: boolean;
    size?: SizePreset;
    tinted?: boolean;
  };

/**
 * StyledSearchFieldRoot — задаёт корневой узел компонента SearchField.
 * Базируется на `<div>` и поддерживает все пропсы из `LayoutProps`.
 *
 * Генерация стилей:
 *  - `getControlRootStyles` — колонка подписи и ряда поля, layout-пропсы
 */
export const StyledSearchFieldRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  ${(props) => getControlRootStyles(props)}
`;

/**
 * SearchFieldRowStyleProps — представляет пропсы стилизации ряда поля поиска.
 *
 * @property iconTone — тон секции иконки
 */
type SearchFieldRowStyleProps = Pick<
  SearchFieldStyleProps,
  | 'borderTone'
  | 'shape'
  | 'showBorder'
  | 'showOutline'
  | 'showShadow'
  | 'size'
  | 'tinted'
> & {
  iconTone?: TonePreset;
};

/**
 * SEARCH_FIELD_ROW_PROP_NAMES — объединяет имена пропсов рамки и пропсов стилизации
 * ряда SearchField.
 */
const SEARCH_FIELD_ROW_PROP_NAMES = new Set<string>([
  ...BORDER_PROP_NAMES,
  'iconTone',
  'shape',
  'size',
  'showOutline',
  'tinted',
]);

/**
 * DEFAULT_SEARCH_FIELD_TINTED — задаёт режим мягкой заливки по умолчанию.
 * Используется, когда вызывающий код не передал проп `tinted`.
 */
const DEFAULT_SEARCH_FIELD_TINTED = false;

/**
 * DEFAULT_SEARCH_FIELD_SHOW_OUTLINE — задаёт режим обводки фокуса по умолчанию.
 * Используется, когда вызывающий код не передал проп `showOutline`.
 */
const DEFAULT_SEARCH_FIELD_SHOW_OUTLINE = true;

/**
 * getSearchFieldRowStyles — возвращает CSS-правила для узла `StyledSearchFieldRow`:
 * сетку секции иконки, поля и сброса, высоту ряда, рамку с тенью, фон, фокус
 * и канал состояний секции иконки. Статику секции красит внутренний Icon своими
 * пропсами с `showBorder={false}`. Собственную запись канала выключает через
 * `showHover={false}` и через `interactive` читает `--icon-state-background`.
 * Кнопка сброса с `showHover={false}` не пишет канал наведения.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолты `shape`, `showBorder`, `showOutline`,
 *    `showShadow`, `size`, `tinted` и `iconTone`
 * 2. Собирает бокс ряда: `display: grid`, раскладку позиции через
 *    `getIconPositionStyles`, `align-items: center`, ширину, `min-block-size`
 *    через `getMinBlockSize`, `overflow: hidden` и `border-radius` через
 *    `resolveBlockRadius`. `padding-block` не пишется: высоту ряда держит
 *    `min-block-size`
 * 3. Красит фон. При `tinted` — та же заливка, что у нейтральной иконки
 *    на наведении, через `resolveIconStateBackground`. Иначе через
 *    `getSurfaceBackgroundColor`: при рамке — `surface`, без рамки —
 *    `transparent`. Кладёт рамку с тенью через `getBorderStyles`
 * 4. При `data-has-clear` и секции иконки переключает колонки на три трека
 *    в двух вариантах по позиции иконки: поле растягивается, секции — `auto`.
 *    Базу без крестика и без иконки оставляет `getIconPositionStyles`.
 *    `block-size: 100%` по высоте ряда держат секция иконки из хелпера и поле
 *    из `getNativeFieldStyles`. Кнопка сброса не растягивается
 * 5. Без `tinted` на `:hover` ряда при отсутствии `data-disabled` на корне пишет
 *    в канал подсветку наведения через `resolveIconStateBackground`. При
 *    `tinted` наведение лупу не красит. Пока каретка в поле,
 *    `:has(input:focus)` пишет в тот же канал заливку нажатия и кладёт на лупу
 *    внутреннюю тень через `resolvePressedShadow`. Это не зависит от рамки.
 *    Недоступное поле канал не пишет
 * 6. При `showOutline` на `&:has(:focus-visible)` кладёт `outline`
 *    через `getOutlineStyles`. Обводка есть и без рамки. При
 *    `showOutline={false}` обводки нет. Пока фокус на тихом сбросе
 *    `[data-quiet]`, обводку ряда гасит: её рисует сам крестик
 *
 * @param props пропсы стилизации ряда и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getSearchFieldRowStyles(
  props: SearchFieldRowStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    borderTone,
    iconTone = DEFAULT_TONE,
    shape = DEFAULT_SHAPE_PRESET,
    showBorder = DEFAULT_SHOW_BORDER,
    showOutline = DEFAULT_SEARCH_FIELD_SHOW_OUTLINE,
    showShadow = DEFAULT_SHOW_SHADOW,
    size = DEFAULT_SIZE_PRESET,
    tinted = DEFAULT_SEARCH_FIELD_TINTED,
  } = props;
  const minBlockSize = getMinBlockSize(size);
  const stateBackground = resolveIconStateBackground(theme, iconTone);

  const pressedBackground = resolvePressedBackground(theme, iconTone);
  const pressedShadow = getBorderStyles(
    theme,
    false,
    false,
    DEFAULT_TONE,
    true,
    iconTone
  );

  const styles = [
    'display: grid;',
    getIconPositionStyles(),
    'align-items: center;',
    'inline-size: 100%;',
    'min-inline-size: 0;',
    `min-block-size: ${minBlockSize};`,
    'overflow: hidden;',
    `border-radius: ${resolveBlockRadius(shape, minBlockSize)};`,
    `background-color: ${
      tinted
        ? resolveIconStateBackground(theme, DEFAULT_TONE)
        : getSurfaceBackgroundColor(theme, showBorder ? 'surface' : 'transparent')
    };`,
    getBorderStyles(theme, showBorder, showShadow, borderTone),
    "&[data-has-clear]:has(> [data-slot='icon']) { grid-template-columns: minmax(0, 1fr) auto auto; }",
    "&[data-has-clear]:has(> [data-slot='icon']:first-child) { grid-template-columns: auto minmax(0, 1fr) auto; }",
  ];

  if (!tinted) {
    styles.push(
      `:not([data-disabled]) > &:hover { --icon-state-background: ${stateBackground}; }`
    );
  }

  styles.push(
    `:not([data-disabled]) > &:has(input:focus) { --icon-state-background: ${pressedBackground}; }`,
    `:not([data-disabled]) > &:has(input:focus) > [data-slot='icon'] { ${pressedShadow} }`
  );

  if (showOutline) {
    styles.push(
      `&:has(:focus-visible) { ${getOutlineStyles(theme.colors.focusOutline)} }`,
      `&:has([data-quiet]:focus-visible) { outline: none; }`
    );
  }

  return styles.join('\n');
}

/**
 * StyledSearchFieldRow — задаёт ряд поля поиска компонента SearchField.
 * Базируется на `<div>` и принимает пропсы из `SearchFieldRowStyleProps`.
 *
 * Генерация стилей:
 *  - `getSearchFieldRowStyles` — сетка, высота, рамка с тенью, фон, фокус и
 *    канал состояний секции иконки
 */
export const StyledSearchFieldRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !SEARCH_FIELD_ROW_PROP_NAMES.has(prop),
})<SearchFieldRowStyleProps>`
  ${(props) => getSearchFieldRowStyles(props)}
`;

/**
 * SearchFieldControlStyleProps — представляет пропсы стилизации нативного поля ввода.
 */
type SearchFieldControlStyleProps = Pick<SearchFieldStyleProps, 'size'>;

/**
 * SEARCH_FIELD_CONTROL_PROP_NAMES — хранит имена пропсов стилизации нативного поля ввода.
 */
const SEARCH_FIELD_CONTROL_PROP_NAMES = new Set<string>(['size']);

/**
 * StyledSearchFieldControl — задаёт нативное поле ввода компонента SearchField.
 * Базируется на `<input>` и поддерживает пропсы из `SearchFieldControlStyleProps`.
 *
 * Генерация стилей:
 *  - `getNativeFieldStyles` — заполнение ряда, отступ, типографика
 *    нативного поля, сброс рамки и фона, гашение контура фокуса
 *    и нативных контролов поиска WebKit
 */
export const StyledSearchFieldControl = styled.input.withConfig({
  shouldForwardProp: (prop) => !SEARCH_FIELD_CONTROL_PROP_NAMES.has(prop),
})<SearchFieldControlStyleProps>`
  ${(props) => getNativeFieldStyles(props.size)}
`;
