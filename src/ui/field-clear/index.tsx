/**
 * Файл: `src/ui/field-clear/index.tsx`
 * Предоставляет компонент FieldClear для отображения кнопки сброса значения поля.
 *
 * Поддерживает:
 *  - размерный ряд через проп `size`. Окно крестика того же размера, что поле.
 *    Отступ окна: `small` `10`, `normal` `12`, `large` `14`
 *  - тон заливки окна через проп `iconTone`
 *  - тон глифа через проп `iconFill`
 *  - недоступное состояние через проп `disabled`
 *  - обводку ошибки через проп `invalid`
 *  - доступное имя через проп `ariaLabel`
 *  - обработчик клика через проп `onClick`
 *
 * Основные задачи:
 * 1. Экспортировать компонент FieldClear
 * 2. Типизировать пропсы через `FieldClearProps`
 * 3. Экспортировать типы `ClearProps` и `ShowClearButtonProps`
 * 4. Экспортировать функцию `resolveClearProps`
 *
 * Потребители:
 *  - `@ui/input` и `@ui/search-field` — подключают `ClearProps` и рендерят кнопку сброса
 *  - `@ui/listbox` — подключает `ShowClearButtonProps` у вида `field`. Пакет сброса
 *    поиска через `resolveClearProps` собирает только когда передан
 *    `showSearchFieldClearButton`
 *  - `src/pages/showcase` и `@ui/toolbar` — собирают пакет сброса через `resolveClearProps`
 */

import { type MouseEvent } from 'react';

import { CloseIcon } from '@icons';
import { Icon, getFieldClearPadding } from '@ui/icon';
import { DEFAULT_SIZE_PRESET, type SizePreset } from '@ui/presets';
import { type TonePreset } from '@ui/tones';

/**
 * ClearProps — представляет пропсы кнопки сброса.
 * Поле `clearAriaLabel` допустимо, пока `showClearButton` не выключен: дефолт флага — сброс есть.
 * Для потребителя с дефолтом «сброса нет» берётся `ShowClearButtonProps`.
 * Подключается локально через `& ClearProps` у Input и SearchField.
 *
 * @property clearAriaLabel — доступное имя кнопки сброса при включённом `showClearButton`
 * @property showClearButton — включает кнопку сброса
 */
type ClearProps =
  | {
      clearAriaLabel?: never;
      showClearButton: false;
    }
  | {
      clearAriaLabel?: string;
      showClearButton?: true;
    };

/**
 * ShowClearButtonProps — представляет пропсы кнопки сброса.
 * Поле `clearAriaLabel` допустимо только при явном `showClearButton: true`: дефолт флага — сброса нет.
 * Для потребителя с дефолтом «сброс есть» берётся `ClearProps`.
 * Подключается локально через `& ShowClearButtonProps` у вида `field` Listbox.
 *
 * @property clearAriaLabel — доступное имя кнопки сброса при включённом `showClearButton`
 * @property showClearButton — включает кнопку сброса
 */
type ShowClearButtonProps =
  | {
      clearAriaLabel?: never;
      showClearButton?: false;
    }
  | {
      clearAriaLabel?: string;
      showClearButton: true;
    };

/**
 * resolveClearProps — возвращает пакет пропсов кнопки сброса по флагу показа.
 * При включённом сбросе отдаёт `showClearButton` вместе с `clearAriaLabel`, иначе гасит
 * зависимое поле. Результат подходит и к `ClearProps`, и к `ShowClearButtonProps`.
 * Используется в `src/pages/showcase` и `@ui/toolbar`, а `@ui/listbox` зовёт функцию
 * только когда передан `showSearchFieldClearButton`: без пропа в SearchField уходит пустой объект.
 *
 * @param showClearButton включает кнопку сброса
 * @param clearAriaLabel доступное имя кнопки сброса при включённом сбросе
 * @returns пакет пропсов кнопки сброса для передачи в потребитель
 */
function resolveClearProps(
  showClearButton: boolean,
  clearAriaLabel?: string
):
  | {
      clearAriaLabel?: string;
      showClearButton: true;
    }
  | {
      showClearButton: false;
    } {
  return showClearButton
    ? { clearAriaLabel, showClearButton: true }
    : { showClearButton: false };
}

/**
 * FieldClearProps — представляет пропсы компонента FieldClear.
 *
 * @property ariaLabel — доступное имя кнопки сброса
 * @property disabled — включает недоступное состояние
 * @property iconFill — тон глифа
 * @property iconTone — тон заливки окна
 * @property invalid — включает цвет обводки ошибки
 * @property onClick — обработчик клика
 * @property size — размер поля и окна крестика. Отступ окна берётся из
 *   `getFieldClearPadding`. Форма всегда круг
 */
type FieldClearProps = {
  ariaLabel: string;
  disabled?: boolean;
  iconFill?: TonePreset;
  iconTone?: TonePreset;
  invalid?: boolean;
  onClick: () => void;
  size?: SizePreset;
};

/**
 * FieldClear — отображает кнопку сброса значения поля.
 *
 * @example
 * <FieldClear
 *   ariaLabel={resolveClearAriaLabel(label)}
 *   disabled={disabled}
 *   size={size}
 *   onClick={handleClear}
 * />
 * <FieldClear
 *   ariaLabel={resolveClearAriaLabel(label, CLEAR_SEARCH_ARIA_LABEL)}
 *   disabled={disabled}
 *   iconFill={iconFill}
 *   iconTone={iconTone}
 *   size={size}
 *   onClick={handleClear}
 * />
 */
function FieldClear({
  ariaLabel,
  disabled,
  iconFill,
  iconTone,
  invalid,
  onClick,
  size = DEFAULT_SIZE_PRESET,
}: FieldClearProps) {
  /**
   * handleMouseDown — удерживает фокус в поле при клике по сбросу.
   * `preventDefault` на левой кнопке не даёт кнопке забрать каретку.
   *
   * @param event нажатие мыши на кнопке сброса
   */
  function handleMouseDown(event: MouseEvent<HTMLButtonElement>): void {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
  }

  return (
    <Icon
      aria-label={ariaLabel}
      as="button"
      data-invalid={invalid ? true : undefined}
      data-quiet={true}
      data-slot="clear"
      disabled={disabled}
      iconFill={iconFill}
      iconTone={iconTone}
      padding={getFieldClearPadding(size)}
      shape="round"
      showBorder={false}
      showHover={false}
      size={size}
      onClick={onClick}
      onMouseDown={handleMouseDown}
    >
      <CloseIcon />
    </Icon>
  );
}

/* eslint-disable react-refresh/only-export-components -- резолвер пакета пропсов кнопки сброса */
export { FieldClear, resolveClearProps, type ClearProps, type ShowClearButtonProps };
