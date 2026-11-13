/**
 * Файл: `src/ui/text-action/index.tsx`
 * Предоставляет компонент TextAction для отображения действия внутри фразы.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - текст действия через `children`. Пустая строка, пробелы или отсутствие
 *    `children` — компонент ничего не рисует
 *  - линию через проп `showUnderline`
 *
 * Основные задачи:
 * 1. Экспортировать компонент TextAction
 * 2. Типизировать пропсы через `TextActionProps`
 * 3. Реэкспортировать публичное API стилей: `DEFAULT_TEXT_ACTION_SHOW_UNDERLINE`
 * 4. Задавать `type="button"` на теге `<button>`: клик вызывает действие
 *    вызывающего кода и не переходит по адресу
 *
 * Потребители:
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef, type ReactNode } from 'react';

import {
  DEFAULT_TEXT_ACTION_SHOW_UNDERLINE,
  StyledTextAction,
  type TextActionStyleProps,
} from './text-action.styles';

/**
 * TextActionProps — представляет пропсы компонента TextAction.
 *
 * @property children — текст действия. Пустая строка, пробелы или отсутствие —
 *   компонент ничего не рисует
 */
type TextActionProps = TextActionStyleProps &
  Omit<
    ComponentPropsWithRef<'button'>,
    'className' | 'disabled' | 'style' | 'type' | keyof TextActionStyleProps
  >;

/**
 * hasTextActionChildren — сообщает, есть ли у действия видимый текст.
 * Пустая строка, пробелы и отсутствие `children` видимым текстом не считаются.
 *
 * @param children содержимое действия
 * @returns `true`, когда есть видимый текст
 */
function hasTextActionChildren(children: ReactNode): boolean {
  if (typeof children === 'string') {
    return children.trim() !== '';
  }

  if (Array.isArray(children)) {
    return children.some((child) => hasTextActionChildren(child));
  }

  return children != null && typeof children !== 'boolean';
}

/**
 * TextAction — отображает действие внутри фразы.
 *
 * @example
 * <TextAction showUnderline={textAction.showUnderline} onClick={handleTextActionClick}>
 *   {textAction.children}
 * </TextAction>
 */
function TextAction({ children, ...rest }: TextActionProps) {
  if (!hasTextActionChildren(children)) {
    return null;
  }

  return (
    <StyledTextAction {...rest} type="button">
      {children}
    </StyledTextAction>
  );
}

export { DEFAULT_TEXT_ACTION_SHOW_UNDERLINE, TextAction };
