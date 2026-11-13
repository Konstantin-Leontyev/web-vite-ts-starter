/**
 * Файл: `src/ui/text-action/text-action.styles.ts`
 * Определяет внешний вид компонента TextAction.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `TextActionStyleProps`
 * 2. Предоставить дефолт `DEFAULT_TEXT_ACTION_SHOW_UNDERLINE`
 * 3. Предоставить styled-узел `StyledTextAction`
 *
 * Потребители:
 *  - `src/ui/text-action/index.tsx` — собирает компонент TextAction
 *    и реэкспортирует публичное API
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { getTheme, type AppTheme } from '@ui/theme';

/**
 * TextActionStyleProps — представляет пропсы стилизации TextAction и layout-пропсы.
 *
 * @property showUnderline — включает постоянную линию. Выключенный — линии нет
 *   в покое, она появляется при наведении и при фокусе с клавиатуры
 */
export type TextActionStyleProps = LayoutProps & {
  showUnderline?: boolean;
};

/**
 * TEXT_ACTION_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации TextAction.
 */
const TEXT_ACTION_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES, 'showUnderline']);

/**
 * DEFAULT_TEXT_ACTION_SHOW_UNDERLINE — задаёт режим `showUnderline` по умолчанию.
 * Используется, когда вызывающий код не передал проп `showUnderline`.
 */
export const DEFAULT_TEXT_ACTION_SHOW_UNDERLINE = false;

/**
 * getTextActionStyles — возвращает CSS-правила для корня `StyledTextAction`:
 * цвет текста и цвет линии.
 *
 * Как работает:
 * 1. Ставит цвет текста и цвет линии одним `primary` из темы. Наведение цвет не меняет
 * 2. При `showUnderline` ставит постоянную линию
 * 3. Без `showUnderline` ставит линию на `&:not(:disabled):hover` и
 *    `&:focus-visible`
 *
 * @param props пропсы стилизации и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getTextActionStyles(props: TextActionStyleProps & { theme: AppTheme }): string {
  const { showUnderline = DEFAULT_TEXT_ACTION_SHOW_UNDERLINE } = props;
  const textColor = getTheme(props).colors.primary;
  const styles = [`color: ${textColor};`, `text-decoration-color: ${textColor};`];

  if (showUnderline) {
    styles.push('text-decoration: underline;');
  } else {
    styles.push(`&:not(:disabled):hover,
      &:focus-visible {
        text-decoration: underline;
      }`);
  }

  return styles.join('\n');
}

/**
 * StyledTextAction — задаёт корневой узел компонента TextAction.
 * Базируется на `<button>` и поддерживает все пропсы из `TextActionStyleProps`.
 *
 * Генерация стилей:
 *  - `getTextActionStyles` — цвет текста и цвет линии, один `primary`
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 *
 * Шрифт, размер и высота строки приходят от окружающего текста.
 */
export const StyledTextAction = styled.button.withConfig({
  shouldForwardProp: (prop) => !TEXT_ACTION_PROP_NAMES.has(prop),
})<TextActionStyleProps>`
  ${(props) => getTextActionStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;
