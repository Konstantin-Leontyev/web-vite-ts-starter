/**
 * Файл: `src/ui/input/input.styles.ts`
 * Определяет внешний вид компонента Input.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `InputStyleProps`
 * 2. Предоставить styled-узлы `StyledInputRoot`, `StyledInputRow`
 *    и `StyledInputControl`
 * 3. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/input/index.tsx` — собирает компонент Input
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
import { resolveIconStateBackground } from '@ui/icon';
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
import { DEFAULT_TONE } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * InputStyleProps — представляет пропсы стилизации Input и layout-пропсы.
 *
 * @property shape — форма строки-поля
 * @property showOutline — включает обводку фокуса. Без пропа обводка есть и без
 *   рамки. `false` гасит её
 * @property size — размер контрола
 * @property tinted — включает мягкую заливку
 */
export type InputStyleProps = LayoutProps &
  BorderProps & {
    shape?: ShapePreset;
    showOutline?: boolean;
    size?: SizePreset;
    tinted?: boolean;
  };

/**
 * StyledInputRoot — задаёт корневой узел компонента Input.
 * Базируется на `<div>` и поддерживает все пропсы из `LayoutProps`.
 *
 * Генерация стилей:
 *  - `getControlRootStyles` — колонка подписи, поля и строки ошибки, layout-пропсы
 *
 * Атрибут `data-disabled` на корне с подписью включает бледность через `@ui/reset`.
 * Своего `opacity` у узла нет.
 */
export const StyledInputRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  ${(props) => getControlRootStyles(props)}
`;

/**
 * InputRowStyleProps — представляет пропсы стилизации ряда поля ввода.
 */
type InputRowStyleProps = Pick<
  InputStyleProps,
  | 'borderTone'
  | 'shape'
  | 'showBorder'
  | 'showOutline'
  | 'showShadow'
  | 'size'
  | 'tinted'
>;

/**
 * INPUT_ROW_PROP_NAMES — объединяет имена пропсов рамки и пропсов стилизации ряда Input.
 */
const INPUT_ROW_PROP_NAMES = new Set<string>([
  ...BORDER_PROP_NAMES,
  'shape',
  'size',
  'showOutline',
  'tinted',
]);

/**
 * DEFAULT_INPUT_TINTED — задаёт режим мягкой заливки по умолчанию.
 * Используется, когда вызывающий код не передал проп `tinted`.
 */
const DEFAULT_INPUT_TINTED = false;

/**
 * DEFAULT_INPUT_SHOW_OUTLINE — задаёт режим обводки фокуса по умолчанию.
 * Используется, когда вызывающий код не передал проп `showOutline`.
 */
const DEFAULT_INPUT_SHOW_OUTLINE = true;

/**
 * getInputRowStyles — возвращает CSS-правила для узла `StyledInputRow`:
 * сетку поля и сброса, высоту ряда, рамку с тенью, фон, фокус и невалидность.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолты `shape`, `showBorder`, `showOutline`,
 *    `showShadow`, `size` и `tinted`
 * 2. Собирает бокс ряда: `display: grid`, колонки `minmax(0, 1fr)`, при
 *    `data-has-clear` — `minmax(0, 1fr) auto`, `align-items: center`, ширину,
 *    `min-block-size` через `getMinBlockSize`, `overflow: hidden` и
 *    `border-radius` через `resolveBlockRadius`
 * 3. Красит фон. При `tinted` — та же заливка, что у нейтральной иконки
 *    на наведении, через `resolveIconStateBackground`. Иначе через
 *    `getSurfaceBackgroundColor`: при рамке — `surface`, без рамки —
 *    `transparent`. Кладёт рамку с тенью через `getBorderStyles`
 * 4. При `showOutline` на `&:has(:focus-visible)` кладёт `outline`
 *    через `getOutlineStyles`. Обводка есть и без рамки. При
 *    `showOutline={false}` обводки фокуса нет. Невалидность красится отдельно
 * 5. На `&[data-invalid]` кладёт ту же обводку цветом `invalidOutline`.
 *    Ряд ставит признак сам, как `data-disabled` у композита: состояние
 *    не угадывается по потомку. Правило стоит после фокуса, чтобы
 *    невалидность перебивала фокус
 * 6. Пока фокус на тихом сбросе `[data-quiet]`, обводку ряда гасит:
 *    её рисует сам крестик
 *
 * @param props пропсы стилизации ряда и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getInputRowStyles(props: InputRowStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    borderTone,
    shape = DEFAULT_SHAPE_PRESET,
    showBorder = DEFAULT_SHOW_BORDER,
    showOutline = DEFAULT_INPUT_SHOW_OUTLINE,
    showShadow = DEFAULT_SHOW_SHADOW,
    size = DEFAULT_SIZE_PRESET,
    tinted = DEFAULT_INPUT_TINTED,
  } = props;
  const minBlockSize = getMinBlockSize(size);
  const styles = [
    'display: grid;',
    'grid-template-columns: minmax(0, 1fr);',
    '&[data-has-clear] { grid-template-columns: minmax(0, 1fr) auto; }',
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
  ];

  if (showOutline) {
    styles.push(
      `&:has(:focus-visible) { ${getOutlineStyles(theme.colors.focusOutline)} }`
    );
  }

  styles.push(`&[data-invalid] { ${getOutlineStyles(theme.colors.invalidOutline)} }`);
  styles.push(`&:has([data-quiet]:focus-visible) { outline: none; }`);

  return styles.join('\n');
}

/**
 * StyledInputRow — задаёт ряд поля ввода компонента Input.
 * Базируется на `<div>` и принимает пропсы из `InputRowStyleProps`.
 *
 * Генерация стилей:
 *  - `getInputRowStyles` — сетка, высота, рамка с тенью, фон, фокус и невалидность
 */
export const StyledInputRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !INPUT_ROW_PROP_NAMES.has(prop),
})<InputRowStyleProps>`
  ${(props) => getInputRowStyles(props)}
`;

/**
 * InputControlStyleProps — представляет пропсы стилизации нативного поля ввода.
 */
type InputControlStyleProps = Pick<InputStyleProps, 'size'>;

/**
 * INPUT_CONTROL_PROP_NAMES — хранит имена пропсов стилизации нативного поля ввода.
 */
const INPUT_CONTROL_PROP_NAMES = new Set<string>(['size']);

/**
 * getInputControlStyles — возвращает CSS-правила для узла `StyledInputControl`:
 * общую коробку нативного поля и гашение `outline` на `[aria-invalid]`.
 *
 * Как работает:
 * 1. Берёт общую коробку из `getNativeFieldStyles`
 * 2. Гасит `outline` на `[aria-invalid='true']`: контур композита рисует ряд.
 *    Локальное гашение глушит контур `GlobalResetStyle` на нативном поле,
 *    чтобы не оставлять шов у кнопки сброса
 *
 * @param props пропсы стилизации нативного поля ввода
 * @returns CSS-правила, каждое с новой строки
 */
function getInputControlStyles(props: InputControlStyleProps): string {
  return `
    ${getNativeFieldStyles(props.size)}
    &[aria-invalid='true'],
    &[aria-invalid='true']:focus,
    &[aria-invalid='true']:focus-visible {
      outline: none;
    }
  `;
}

/**
 * StyledInputControl — задаёт нативное поле ввода компонента Input.
 * Базируется на `<input>` и поддерживает пропсы из `InputControlStyleProps`.
 *
 * Генерация стилей:
 *  - `getInputControlStyles` — заполнение ряда, отступ, типографика нативного
 *    поля, сброс рамки и фона, гашение контура
 */
export const StyledInputControl = styled.input.withConfig({
  shouldForwardProp: (prop) => !INPUT_CONTROL_PROP_NAMES.has(prop),
})<InputControlStyleProps>`
  ${(props) => getInputControlStyles(props)}
`;
