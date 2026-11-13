/**
 * Файл: `src/pages/showcase/text-settings/index.tsx`
 * Определяет панель настроек компонента Text в витрине дизайн-системы.
 * Содержит контролы для изменения содержимого, размера, выравнивания, тона,
 * обрезания, курсива текста и текста действия в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `TextWidgetState` и `TextActionWidgetState`
 * 2. Экспортировать компонент `TextSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета текста
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import {
  Text,
  type TextAlignPreset,
  type TextSizePreset,
  type TextTonePreset,
} from '@ui/text';

import { StyledSettingsForm } from '../showcase.styles';
import { TextGroup } from '../text-group';

/**
 * TextWidgetState — представляет состояние настроек компонента Text в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Text.
 * Используется для синхронизации значений между панелью управления и демонстрационным текстом.
 *
 * @property align — выравнивание текста
 * @property children — содержимое текста
 * @property ellipsis — включает однострочное обрезание с многоточием
 * @property italic — включает курсивное начертание
 * @property size — типографический пресет
 * @property tone — тон текста
 */
export type TextWidgetState = {
  align?: TextAlignPreset;
  children: string;
  ellipsis: boolean;
  italic: boolean;
  size: TextSizePreset;
  tone: TextTonePreset;
};

/**
 * TextActionWidgetState — представляет состояние действия в превью Text.
 * Ключи совпадают с именами пропов компонента TextAction.
 *
 * @property children — текст действия
 * @property showUnderline — включает постоянную линию
 */
export type TextActionWidgetState = {
  children: string;
  showUnderline: boolean;
};

/**
 * TextSettingsProps — представляет пропсы компонента TextSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property onTextActionChange — обработчик изменения текста и линии действия
 * @property state — текущее состояние настроек текста
 * @property textAction — текст и линия действия в превью
 */
type TextSettingsProps = {
  onChange: <K extends keyof TextWidgetState>(key: K, value: TextWidgetState[K]) => void;
  onTextActionChange: <K extends keyof TextActionWidgetState>(
    key: K,
    value: TextActionWidgetState[K]
  ) => void;
  state: TextWidgetState;
  textAction: TextActionWidgetState;
};

/**
 * TextSettings — отображает панель настроек Text в витрине дизайн-системы.
 *
 * @example
 * <TextSettings
 *   state={text}
 *   textAction={textAction}
 *   onChange={updateText}
 *   onTextActionChange={updateTextAction}
 * />
 */
export function TextSettings({
  onChange,
  onTextActionChange,
  state,
  textAction,
}: TextSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <TextGroup
        align={state.align}
        contents={[
          {
            value: state.children,
            onChange: (value) => onChange('children', value),
          },
        ]}
        ellipsis={{
          checked: state.ellipsis,
          onChange: (checked) => onChange('ellipsis', checked),
        }}
        italic={state.italic}
        labelPrefix="Sample"
        size={state.size}
        tones={[
          {
            value: state.tone,
            onChange: (tone) => onChange('tone', tone),
          },
        ]}
        onAlignChange={(align) => onChange('align', align)}
        onItalicChange={(value) => onChange('italic', value)}
        onSizeChange={(size) => onChange('size', size)}
      />

      <Text as="h2" size="bold">
        Text action
      </Text>

      <TextGroup
        contents={[
          {
            value: textAction.children,
            onChange: (value) => onTextActionChange('children', value),
          },
        ]}
        labelPrefix="Text"
      />

      <Checkbox
        checked={textAction.showUnderline}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onTextActionChange('showUnderline', event.target.checked)
        }
      >
        Show underline
      </Checkbox>
    </StyledSettingsForm>
  );
}
