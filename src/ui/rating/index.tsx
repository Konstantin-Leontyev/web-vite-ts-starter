/**
 * Файл: `src/ui/rating/index.tsx`
 * Предоставляет компонент Rating для отображения оценки пятью звёздами-ссылками.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - форму через проп `shape`
 *  - рамку через проп `showBorder`
 *  - тень через проп `showShadow`
 *  - тон рамки через проп `borderTone`
 *  - заливку через проп `background`
 *  - заголовок через проп `title`. Без пропа — `Rate us`.
 *    Пустая строка или пробелы — видимого заголовка нет
 *  - заголовок в одну строку со звёздами через проп `titleInline`.
 *    По умолчанию в одну строку. Выключенный — заголовок над звёздами
 *  - доступное имя ряда звёзд через проп `ariaLabel`. Без пропа, при пустой строке
 *    или пробелах — видимый заголовок, а без него — `Rate us`
 *  - описание звёзд через проп `description`. Без пропа, при пустой строке или
 *    пробелах — `Review window opens in a new tab`
 *  - порог через проп `threshold`
 *  - адрес низкой оценки через проп `lowRatingHref`
 *  - адрес высокой оценки через проп `highRatingHref`
 *  - имена звёзд через проп `starNames`. Без пропа — `Rate 1 out of 5`,
 *    `Rate 2 out of 5`, `Rate 3 out of 5`, `Rate 4 out of 5` и `Rate 5 out of 5`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Rating
 * 2. Типизировать пропсы через `RatingProps`
 * 3. Экспортировать `DEFAULT_RATING_DESCRIPTION`, `DEFAULT_RATING_STAR_NAMES`,
 *    `DEFAULT_RATING_THRESHOLD`, `DEFAULT_RATING_TITLE`, `DEFAULT_RATING_TITLE_INLINE`,
 *    `RATING_VALUES` и тип `RatingValue`
 * 4. Подсвечивать звезду и предыдущие, пока указатель или фокус на звезде
 * 5. Давать ряду звёзд `role="group"` и имя, ставить `aria-label` звезды из
 *    `starNames`. Описание звёзд — один скрытый узел, у звёзд `aria-describedby`,
 *    фраза не внутри ссылки. Открывать адрес в новой вкладке
 *
 * Потребители:
 *  - `src/pages/showcase/rating-settings/index.tsx` — собирает опции порога из `RATING_VALUES`
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import {
  useId,
  useState,
  type ComponentPropsWithRef,
  type FocusEvent,
  type PointerEvent,
} from 'react';

import { StarFilledIcon, StarIcon } from '@icons';
import { Icon, resolveIconShape } from '@ui/icon';
import { Text } from '@ui/text';

import {
  DEFAULT_RATING_TITLE_INLINE,
  StyledRating,
  StyledRatingStar,
  StyledRatingStars,
  getRatingTitleText,
  type RatingStyleProps,
} from './rating.styles';

/**
 * RatingValue — представляет оценку от одной до пяти звёзд.
 */
type RatingValue = 1 | 2 | 3 | 4 | 5;

/**
 * RatingStarNames — представляет имена пяти звёзд.
 * Имена идут от первой звезды к пятой.
 */
type RatingStarNames = readonly [string, string, string, string, string];

/**
 * RATING_VALUES — задаёт перечень оценок от одной до пяти звёзд.
 * Используется в `Rating` для ряда звёзд и в панели настроек витрины.
 */
const RATING_VALUES = Object.freeze([
  1, 2, 3, 4, 5,
] as const satisfies readonly RatingValue[]);

/**
 * DEFAULT_RATING_DESCRIPTION — задаёт описание звёзд по умолчанию.
 * Используется, когда вызывающий код не передал проп `description`.
 */
const DEFAULT_RATING_DESCRIPTION = 'Review window opens in a new tab';

/**
 * DEFAULT_RATING_STAR_NAMES — задаёт имена пяти звёзд по умолчанию.
 * Используется, когда вызывающий код не передал проп `starNames`.
 */
const DEFAULT_RATING_STAR_NAMES = Object.freeze([
  'Rate 1 out of 5',
  'Rate 2 out of 5',
  'Rate 3 out of 5',
  'Rate 4 out of 5',
  'Rate 5 out of 5',
] as const satisfies RatingStarNames);

/**
 * DEFAULT_RATING_THRESHOLD — задаёт порог оценки по умолчанию.
 * Используется, когда вызывающий код не передал проп `threshold`.
 */
const DEFAULT_RATING_THRESHOLD: RatingValue = 3;

/**
 * DEFAULT_RATING_TITLE — задаёт текст заголовка по умолчанию.
 * Используется, когда вызывающий код не передал проп `title`.
 */
const DEFAULT_RATING_TITLE = 'Rate us';

/**
 * RatingProps — представляет пропсы компонента Rating.
 *
 * @property ariaLabel — доступное имя ряда звёзд. Без пропа, при пустой строке
 *   или пробелах — видимый заголовок, а без него — `Rate us`
 * @property description — описание звёзд для экранного чтеца. Без пропа, при
 *   пустой строке или пробелах — `Review window opens in a new tab`
 * @property highRatingHref — адрес для оценки выше порога
 * @property lowRatingHref — адрес для оценки не выше порога
 * @property starNames — имена пяти звёзд, от первой к пятой. Без пропа —
 *   `Rate 1 out of 5`, `Rate 2 out of 5`, `Rate 3 out of 5`, `Rate 4 out of 5`
 *   и `Rate 5 out of 5`
 * @property threshold — порог оценки
 * @property title — видимый заголовок. Без пропа — `Rate us`.
 *   Пустая строка или пробелы — видимого заголовка нет
 * @property titleInline — включает заголовок в одну строку со звёздами.
 *   Выключенный — заголовок над звёздами
 */
type RatingProps = {
  ariaLabel?: string;
  description?: string;
  highRatingHref: string;
  lowRatingHref: string;
  starNames?: RatingStarNames;
  threshold?: RatingValue;
  title?: string;
  titleInline?: boolean;
} & RatingStyleProps &
  Omit<
    ComponentPropsWithRef<'div'>,
    'children' | 'className' | 'style' | 'title' | keyof RatingStyleProps
  >;

/**
 * resolveRatingTitle — возвращает видимый заголовок.
 * Без пропа — `Rate us`. Пустая строка или пробелы — заголовка нет.
 *
 * @param title проп `title`
 * @returns видимый текст или `undefined`, когда видимого заголовка нет
 */
function resolveRatingTitle(title: string | undefined): string | undefined {
  if (title === undefined) {
    return DEFAULT_RATING_TITLE;
  }

  if (title.trim() === '') {
    return undefined;
  }

  return title;
}

/**
 * resolveRatingDescription — возвращает описание звёзд.
 * Пустая строка или пробелы остаются умолчанием.
 *
 * @param description проп `description`
 * @returns фраза описания
 */
function resolveRatingDescription(description: string | undefined): string {
  if (description !== undefined && description.trim() !== '') {
    return description;
  }

  return DEFAULT_RATING_DESCRIPTION;
}

/**
 * resolveRatingGroupLabel — возвращает имя ряда звёзд.
 * Непустой `ariaLabel` важнее видимого заголовка, заголовок — важнее умолчания.
 * Пустая строка или пробелы в `ariaLabel` считаются отсутствием имени.
 *
 * @param ariaLabel проп `ariaLabel`
 * @param visibleTitle видимый заголовок
 * @param titleId id узла видимого заголовка
 * @returns `label` для `aria-label` или `labelledBy` для `aria-labelledby`
 */
function resolveRatingGroupLabel(
  ariaLabel: string | undefined,
  visibleTitle: string | undefined,
  titleId: string
): { label: string | undefined; labelledBy: string | undefined } {
  const passedName = ariaLabel?.trim() ?? '';

  if (passedName !== '') {
    return { label: passedName, labelledBy: undefined };
  }

  if (visibleTitle !== undefined) {
    return { label: undefined, labelledBy: titleId };
  }

  return { label: DEFAULT_RATING_TITLE, labelledBy: undefined };
}

/**
 * resolveRatingHref — возвращает адрес звезды по порогу.
 *
 * @param value оценка звезды
 * @param threshold порог оценки
 * @param lowRatingHref адрес для оценки не выше порога
 * @param highRatingHref адрес для оценки выше порога
 * @returns `lowRatingHref`, когда оценка не выше порога, иначе `highRatingHref`
 */
function resolveRatingHref(
  value: RatingValue,
  threshold: RatingValue,
  lowRatingHref: string,
  highRatingHref: string
): string {
  return value > threshold ? highRatingHref : lowRatingHref;
}

/**
 * Rating — отображает заголовок и пять звёзд-ссылок.
 *
 * @example
 * <Rating
 *   highRatingHref={rating.highRatingHref}
 *   lowRatingHref={rating.lowRatingHref}
 *   shape={rating.shape}
 *   size={rating.size}
 *   starNames={DEFAULT_RATING_STAR_NAMES}
 *   threshold={rating.threshold}
 *   {...ratingTitleProps}
 * />
 */
function Rating({
  ariaLabel,
  description,
  highRatingHref,
  lowRatingHref,
  shape,
  size,
  starNames = DEFAULT_RATING_STAR_NAMES,
  threshold = DEFAULT_RATING_THRESHOLD,
  title,
  titleInline,
  ...rest
}: RatingProps) {
  const descriptionId = useId();
  const titleId = useId();
  const [focusIndex, setFocusIndex] = useState<null | RatingValue>(null);
  const [pointerIndex, setPointerIndex] = useState<null | RatingValue>(null);
  const visibleTitle = resolveRatingTitle(title);
  const hasTitle = visibleTitle !== undefined;
  const groupName = resolveRatingGroupLabel(ariaLabel, visibleTitle, titleId);
  const starDescription = resolveRatingDescription(description);
  const highlightIndex = pointerIndex ?? focusIndex;
  const iconShape = resolveIconShape(shape);
  const titleText = getRatingTitleText(size);

  /**
   * handleBlur — сбрасывает звезду в фокусе, когда фокус уходит за пределы ряда.
   *
   * @param event событие потери фокуса ряда
   */
  function handleBlur(event: FocusEvent<HTMLDivElement>): void {
    const next = event.relatedTarget;

    if (next instanceof Node && event.currentTarget.contains(next)) {
      return;
    }

    setFocusIndex(null);
  }

  /**
   * handlePointerLeave — сбрасывает звезду под указателем.
   */
  function handlePointerLeave(): void {
    setPointerIndex(null);
  }

  /**
   * handlePointerMove — сбрасывает звезду под указателем, когда указатель уходит со ссылки.
   *
   * @param event событие движения указателя по ряду
   */
  function handlePointerMove(event: PointerEvent<HTMLDivElement>): void {
    const target = event.target;
    const star = target instanceof Element ? target.closest('a') : null;

    if (star instanceof HTMLAnchorElement && event.currentTarget.contains(star)) {
      return;
    }

    setPointerIndex(null);
  }

  /**
   * handleStarFocus — запоминает звезду, на которой фокус.
   *
   * @param value оценка звезды в фокусе
   */
  function handleStarFocus(value: RatingValue): void {
    setFocusIndex(value);
  }

  /**
   * handleStarPointerEnter — запоминает звезду под указателем.
   *
   * @param value оценка звезды под указателем
   */
  function handleStarPointerEnter(value: RatingValue): void {
    setPointerIndex(value);
  }

  return (
    <StyledRating
      hasTitle={hasTitle}
      shape={shape}
      size={size}
      titleInline={titleInline}
      {...rest}
    >
      {hasTitle && (
        <Text
          fontSize={titleText.fontSize}
          id={titleId}
          lineHeight={titleText.lineHeight}
        >
          {visibleTitle}
        </Text>
      )}
      <StyledRatingStars
        aria-label={groupName.label}
        aria-labelledby={groupName.labelledBy}
        role="group"
        onBlur={handleBlur}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
      >
        <span className="visually-hidden" id={descriptionId}>
          {starDescription}
        </span>
        {RATING_VALUES.map((value, index) => {
          const href = resolveRatingHref(
            value,
            threshold,
            lowRatingHref,
            highRatingHref
          );
          const isHighlighted = highlightIndex !== null && value <= highlightIndex;

          return (
            <StyledRatingStar
              aria-describedby={descriptionId}
              aria-label={starNames[index]}
              href={href}
              key={value}
              rel="noopener noreferrer"
              target="_blank"
              onFocus={() => handleStarFocus(value)}
              onPointerEnter={() => handleStarPointerEnter(value)}
            >
              <Icon
                iconFill={isHighlighted ? 'warning' : undefined}
                shape={iconShape}
                showHover={false}
                size={size}
              >
                {(isHighlighted && <StarFilledIcon />) || <StarIcon />}
              </Icon>
            </StyledRatingStar>
          );
        })}
      </StyledRatingStars>
    </StyledRating>
  );
}

export {
  DEFAULT_RATING_DESCRIPTION,
  DEFAULT_RATING_STAR_NAMES,
  DEFAULT_RATING_THRESHOLD,
  DEFAULT_RATING_TITLE,
  DEFAULT_RATING_TITLE_INLINE,
  RATING_VALUES,
  Rating,
  type RatingValue,
};
