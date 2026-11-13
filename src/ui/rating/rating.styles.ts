/**
 * Файл: `src/ui/rating/rating.styles.ts`
 * Определяет внешний вид компонента Rating.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `RatingStyleProps`
 * 2. Хранить отступы в `RATING_PADDING`, `RATING_ROW_GAP` и `RATING_STAR_GAP`,
 *    кегль заголовка в `ratingTitleText`
 * 3. Предоставить функцию `getRatingTitleText`, а также дефолт
 *    `DEFAULT_RATING_TITLE_INLINE`
 * 4. Предоставить styled-узлы `StyledRating`, `StyledRatingStars`
 *    и `StyledRatingStar`
 *
 * Потребители:
 *  - `src/ui/rating/index.tsx` — собирает компонент Rating и реэкспортирует публичное API
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
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  resolveBlockRadius,
  type ShapePreset,
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
 * RATING_PADDING — задаёт внутренний отступ поверхности.
 * Используется в `StyledRating` и в скруглении `resolveRatingBlockRadius`.
 */
const RATING_PADDING: SpacingValue = 8;

/**
 * RATING_ROW_GAP — задаёт зазор между заголовком и рядом звёзд.
 * Используется в `getRatingStyles` и в скруглении `resolveRatingBlockRadius`.
 */
const RATING_ROW_GAP: SpacingValue = 8;

/**
 * RATING_STAR_GAP — задаёт зазор между звёздами.
 * Используется в `StyledRatingStars`.
 */
const RATING_STAR_GAP: SpacingValue = 8;

/**
 * ratingTitleText — хранит кегль и высоту строки заголовка для каждого размера звезды.
 * Ключ — размер из `IconSizePreset`, значение — пара ключей шкалы из `@ui/spacing`:
 *  - `fontSize` — кегль
 *  - `lineHeight` — высота строки
 */
const ratingTitleText = {
  tiny: { fontSize: 12, lineHeight: 12 },
  small: { fontSize: 24, lineHeight: 24 },
  normal: { fontSize: 28, lineHeight: 28 },
  large: { fontSize: 32, lineHeight: 32 },
} as const satisfies Record<
  IconSizePreset,
  { fontSize: SpacingValue; lineHeight: SpacingValue }
>;

/**
 * getRatingTitleText — возвращает кегль и высоту строки заголовка по размеру звезды.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param size размер звезды
 * @returns кегль и высота строки в rem
 */
export function getRatingTitleText(size?: IconSizePreset): {
  fontSize: string;
  lineHeight: string;
} {
  const titleText = ratingTitleText[size ?? DEFAULT_SIZE_PRESET];

  return {
    fontSize: getSpacingValue(titleText.fontSize),
    lineHeight: getSpacingValue(titleText.lineHeight),
  };
}

/**
 * RatingStyleProps — представляет пропсы стилизации Rating и layout-пропсы.
 *
 * @property background — заливка поверхности
 * @property shape — форма поверхности
 * @property size — размер звезды
 */
export type RatingStyleProps = LayoutProps &
  BorderProps & {
    background?: SurfaceBackgroundPreset;
    shape?: ShapePreset;
    size?: IconSizePreset;
  };

/**
 * RatingStyledProps — представляет пропсы стилизации корня Rating.
 *
 * @property hasTitle — включает заголовок в раскладке
 * @property titleInline — включает заголовок в одну строку со звёздами.
 *   Выключенный — заголовок над звёздами
 */
type RatingStyledProps = RatingStyleProps & {
  hasTitle: boolean;
  titleInline?: boolean;
};

/**
 * RATING_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Rating.
 */
const RATING_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  ...BORDER_PROP_NAMES,
  'background',
  'hasTitle',
  'shape',
  'size',
  'titleInline',
]);

/**
 * DEFAULT_RATING_TITLE_INLINE — задаёт режим `titleInline` по умолчанию.
 * Используется, когда вызывающий код не передал проп `titleInline`.
 */
export const DEFAULT_RATING_TITLE_INLINE = true;

/**
 * resolveRatingBlockRadius — возвращает скругление поверхности по форме.
 * Высота складывается из окна звезды, отступов и, при заголовке, строки
 * заголовка с зазором.
 *
 * @param shape форма поверхности
 * @param size размер звезды
 * @param props отступы поверхности
 * @param hasTitle есть ли заголовок
 * @returns значение для CSS-свойства `border-radius`
 */
function resolveRatingBlockRadius(
  shape: ShapePreset,
  size: IconSizePreset,
  props: SpacingProps,
  hasTitle: boolean
): string {
  const blockPadding = `${getSpacingValue(
    resolvePaddingEdge(props, 'blockStart', RATING_PADDING)
  )} + ${getSpacingValue(resolvePaddingEdge(props, 'blockEnd', RATING_PADDING))}`;
  const titleRow = hasTitle
    ? ` + ${getRatingTitleText(size).lineHeight} + ${getSpacingValue(RATING_ROW_GAP)}`
    : '';
  const surfaceBlockSize = `calc(${getSpacingValue(getIconSize(size))} + ${blockPadding}${titleRow})`;

  return resolveBlockRadius(shape, surfaceBlockSize);
}

/**
 * getRatingStyles — возвращает CSS-правила для корня `StyledRating`: заливку,
 * рамку с тенью, скругление и раскладку заголовка.
 *
 * Как работает:
 * 1. Ставит заливку, рамку с тенью и скругление. Высота скругления включает
 *    строку заголовка, только когда заголовок над звёздами
 * 2. При заголовке над звёздами ставит `row-gap`
 * 3. При заголовке в одну строку со звёздами ставит `grid-auto-flow: column`,
 *    `align-items: center` и `column-gap`
 *
 * @param props пропсы стилизации корня и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getRatingStyles(props: RatingStyledProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    background = DEFAULT_SURFACE_BACKGROUND,
    borderTone,
    hasTitle,
    shape = DEFAULT_SHAPE_PRESET,
    showBorder = DEFAULT_SHOW_BORDER,
    showShadow = DEFAULT_SHOW_SHADOW,
    size = DEFAULT_SIZE_PRESET,
    titleInline = DEFAULT_RATING_TITLE_INLINE,
  } = props;
  const titleStacks = hasTitle && !titleInline;
  const styles = [
    `background-color: ${getSurfaceBackgroundColor(theme, background)};`,
    getBorderStyles(theme, showBorder, showShadow, borderTone),
    `border-radius: ${resolveRatingBlockRadius(shape, size, props, titleStacks)};`,
  ];

  if (titleStacks) {
    styles.push(`row-gap: ${getSpacingValue(RATING_ROW_GAP)};`);
  } else if (hasTitle) {
    styles.push(
      'grid-auto-flow: column;',
      'align-items: center;',
      `column-gap: ${getSpacingValue(RATING_ROW_GAP)};`
    );
  }

  return styles.join('\n');
}

/**
 * StyledRating — задаёт корневой узел компонента Rating.
 * Базируется на `<div>` и поддерживает все пропсы из `RatingStyledProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка заголовка и ряда звёзд
 *  - `justify-items: center` — центрирует заголовок и ряд
 *  - `justify-self: center` — центрирует оболочку на родителе
 *  - `inline-size: max-content` и `min-inline-size: max-content` — ширина по содержимому
 *  - `min-block-size: min-content` — высота не ниже содержимого
 *  - `padding` — внутренний отступ поверхности
 *  - `overflow: hidden` — обрезает содержимое по скруглению
 *
 * Генерация стилей:
 *  - `getRatingStyles` — заливка, рамка с тенью, скругление и раскладка заголовка
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledRating = styled.div.withConfig({
  shouldForwardProp: (prop) => !RATING_PROP_NAMES.has(prop),
})<RatingStyledProps>`
  display: grid;
  justify-items: center;
  justify-self: center;
  inline-size: max-content;
  min-inline-size: max-content;
  min-block-size: min-content;
  padding: ${getSpacingValue(RATING_PADDING)};
  overflow: hidden;
  ${(props) => getRatingStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * StyledRatingStars — задаёт ряд звёзд компонента Rating.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: grid` и `grid-auto-flow: column` — пять звёзд в ряд
 *  - `column-gap` — зазор между звёздами
 */
export const StyledRatingStars = styled.div`
  display: grid;
  grid-auto-flow: column;
  column-gap: ${getSpacingValue(RATING_STAR_GAP)};
`;

/**
 * getRatingStarStyles — возвращает CSS-правила для узла `StyledRatingStar`:
 * цвет текста на `:not(:disabled):hover` и `:focus-visible`.
 * Так пустая звезда не становится `primary`. Залитую звезду цвет ссылки
 * не перекрашивает: её цвет задаёт Icon.
 *
 * @param props объект с полем `theme` из styled-components
 * @returns CSS-правила, каждое с новой строки
 */
function getRatingStarStyles(props: { theme: AppTheme }): string {
  return `
    &:not(:disabled):hover,
    &:focus-visible {
      color: ${getTheme(props).colors.default};
    }
  `;
}

/**
 * StyledRatingStar — задаёт звезду-ссылку компонента Rating.
 * Базируется на `<a>`.
 *
 * Встроенные стили:
 *  - `display: grid` — без сетки ссылка в ряду звёзд схлопнулась бы в `block`
 *
 * Генерация стилей:
 *  - `getRatingStarStyles` — цвет текста на `:not(:disabled):hover` и `:focus-visible`
 */
export const StyledRatingStar = styled.a`
  display: grid;
  ${(props) => getRatingStarStyles(props)}
`;
