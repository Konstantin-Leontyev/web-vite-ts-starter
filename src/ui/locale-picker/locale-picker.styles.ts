/**
 * Файл: `src/ui/locale-picker/locale-picker.styles.ts`
 * Определяет внешний вид компонента LocaleFlag.
 *
 * Основные задачи:
 * 1. Предоставить styled-узел `StyledLocaleFlag`
 *
 * Потребители:
 *  - `src/ui/locale-picker/flags.tsx` — собирает компонент LocaleFlag
 */

import styled from 'styled-components';

import { getBorderStyles } from '@ui/border';
import { MOTION_CONTROL_DURATION, getTransitionStyles } from '@ui/motion';
import { getTheme, type AppTheme } from '@ui/theme';

/**
 * getLocaleFlagStyles — возвращает CSS-правила для узла `StyledLocaleFlag`: рамку с тенью.
 * Используется в узле `StyledLocaleFlag`.
 *
 * @param props объект с полем `theme` из styled-components
 * @returns CSS-правила, каждое с новой строки
 */
function getLocaleFlagStyles(props: { theme: AppTheme }): string {
  return getBorderStyles(getTheme(props), true, true);
}

/**
 * StyledLocaleFlag — задаёт оболочку svg-флага компонента LocaleFlag.
 * Базируется на `<span>`.
 *
 * Встроенные стили:
 *  - `aspect-ratio: 3 / 2` — пропорция svg-флага, оболочка его не растягивает
 *  - `border-radius: 2px` — скругляет углы флага
 *  - `box-shadow: none` на `[data-active='true']` — рамка флага снимается
 *    только у активной кнопки или строки
 *
 * Генерация стилей:
 *  - `getLocaleFlagStyles` — рамка с тенью. На белом фоне они отделяют флаг
 *  - `getTransitionStyles` — переход `box-shadow` той же длительности, что
 *    подсветка строки
 */
export const StyledLocaleFlag = styled.span`
  display: grid;
  inline-size: 100%;
  aspect-ratio: 3 / 2;
  border-radius: 2px;
  ${(props) => getLocaleFlagStyles(props)}
  ${getTransitionStyles('box-shadow', MOTION_CONTROL_DURATION)}

  [data-active='true'] & {
    box-shadow: none;
  }

  svg {
    inline-size: 100%;
    block-size: 100%;
    border-radius: inherit;
  }
`;
