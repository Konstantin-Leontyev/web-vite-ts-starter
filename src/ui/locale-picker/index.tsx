/**
 * Файл: `src/ui/locale-picker/index.tsx`
 * Предоставляет компонент LocalePicker для отображения выбора языка.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - форму через проп `shape`
 *  - вид триггера через проп `appearance`
 *  - рамку вида `icon` через проп `showBorder`
 *  - тень вида `icon` через проп `showShadow`
 *  - у вида `icon` глиф — земля. У вида `field` этот глиф не рисуется
 *  - тон рамки через проп `borderTone`
 *  - тон глифа шеврона через проп `iconFill`. Только у вида `field`
 *  - позицию шеврона через проп `iconPosition`. Только у вида `field`
 *  - тон секции шеврона через проп `iconTone`. Только у вида `field`
 *  - начальное значение через проп `defaultValue`. Без `value` и `defaultValue`
 *    язык берётся из `navigator.languages`
 *  - недоступное состояние через проп `disabled`
 *  - текст пустого результата поиска через проп `emptyMessage`
 *  - подпись над триггером через проп `label`
 *  - обработчик изменения значения через проп `onChange`
 *  - опции списка через проп `options`. Без пропа — полный перечень iso-639-1
 *  - плейсхолдер пустого триггера через проп `placeholder`
 *  - плейсхолдер поля поиска через проп `searchPlaceholder`. Без пропа поле ставит
 *    `Search…`, пустая строка перебивает
 *  - контролируемое значение через проп `value`
 *  - опциональный сброс выбора через проп `showClearButton`. Только у вида `field`.
 *    Базовая логика — шеврон. Кнопка сброса появляется при выборе, только когда
 *    проп включён
 *  - доступное имя кнопки сброса через проп `clearAriaLabel`. Без пропа имя —
 *    `resolveClearAriaLabel`
 *
 * Основные задачи:
 * 1. Экспортировать компонент LocalePicker
 * 2. Типизировать пропсы через `LocalePickerProps`
 * 3. Реэкспортировать `getLocaleOptions`
 * 4. Всегда включать поиск и мягкую заливку поля в Listbox и не отдавать
 *    `multiple`, `inlineCheckbox` и `tinted`
 *
 * Потребители:
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 *  - `src/pages/showcase/locale-slice.ts` — собирает срез опций через `getLocaleOptions`
 */

import { type ComponentProps } from 'react';

import { EarthIcon } from '@icons';
import { Listbox, type ListboxAppearanceProps, type ListboxOption } from '@ui/listbox';
import { type DistributiveOmit } from '@ui/type-utils';

import { getLocaleOptions } from './locales';

/**
 * DEFAULT_LOCALE_PICKER_OPTIONS — задаёт перечень языков по умолчанию.
 * Используется, когда вызывающий код не передал проп `options`.
 */
const DEFAULT_LOCALE_PICKER_OPTIONS = getLocaleOptions();

/**
 * resolveLocaleLookup — возвращает код опции по языковой метке.
 * Сначала ищет метку целиком, затем код языка до первого дефиса.
 *
 * @param languageTag метка из `navigator.languages`
 * @param optionValues коды опций списка
 * @returns код опции или `undefined`, если совпадения нет
 */
function resolveLocaleLookup(
  languageTag: string,
  optionValues: ReadonlySet<string>
): string | undefined {
  const normalized = languageTag.trim().toLowerCase();

  if (normalized === '') {
    return undefined;
  }

  if (optionValues.has(normalized)) {
    return normalized;
  }

  const language = normalized.split('-')[0] ?? '';

  if (language !== '' && language !== normalized && optionValues.has(language)) {
    return language;
  }

  return undefined;
}

/**
 * resolvePreferredLocaleValue — возвращает код языка браузера среди опций.
 * Идёт по `navigator.languages` с первой метки. Если перечень пуст, берёт
 * `navigator.language`.
 *
 * @param options опции списка
 * @returns код опции или `undefined`, если языка пользователя в списке нет
 */
function resolvePreferredLocaleValue(
  options: readonly ListboxOption[]
): string | undefined {
  if (typeof navigator === 'undefined') {
    return undefined;
  }

  const optionValues = new Set(options.map((option) => option.value));
  const languages =
    navigator.languages.length > 0 ? navigator.languages : [navigator.language];

  for (const languageTag of languages) {
    const matched = resolveLocaleLookup(languageTag, optionValues);

    if (matched !== undefined) {
      return matched;
    }
  }

  return undefined;
}

/**
 * LocalePickerProps — представляет пропсы компонента LocalePicker.
 *
 * @property options — опции списка. Без пропа — полный перечень iso-639-1
 */
type LocalePickerProps = DistributiveOmit<
  ComponentProps<typeof Listbox>,
  | 'appearance'
  | 'clearAriaLabel'
  | 'icon'
  | 'iconFill'
  | 'iconPosition'
  | 'iconTone'
  | 'inlineCheckbox'
  | 'multiple'
  | 'options'
  | 'searchFieldBorderTone'
  | 'searchFieldIcon'
  | 'searchFieldIconFill'
  | 'searchFieldIconPosition'
  | 'searchFieldIconTone'
  | 'searchShape'
  | 'searchSize'
  | 'showBorder'
  | 'showClearButton'
  | 'showSearchField'
  | 'showSearchFieldBorder'
  | 'showSearchFieldIcon'
  | 'showSearchFieldShadow'
  | 'showShadow'
  | 'tinted'
> &
  DistributiveOmit<ListboxAppearanceProps, 'icon'> & {
    options?: readonly ListboxOption[];
  };

/**
 * LocalePicker — отображает выбор языка.
 *
 * @example
 * <LocalePicker value={locale} onChange={setLocale} />
 * <LocalePicker appearance="icon" options={LOCALE_SLICE_OPTIONS} />
 */
export function LocalePicker({
  defaultValue,
  options = DEFAULT_LOCALE_PICKER_OPTIONS,
  value,
  ...rest
}: LocalePickerProps) {
  const browserDefaultValue =
    value === undefined && defaultValue === undefined
      ? resolvePreferredLocaleValue(options)
      : undefined;
  const resolvedDefaultValue = defaultValue ?? browserDefaultValue;
  const valueProps = {
    ...(resolvedDefaultValue === undefined
      ? {}
      : { defaultValue: resolvedDefaultValue }),
    ...(value === undefined ? {} : { value }),
  };

  if (rest.appearance === 'icon') {
    return (
      <Listbox
        {...rest}
        appearance="icon"
        icon={<EarthIcon />}
        options={options}
        showSearchField
        tinted
        {...valueProps}
      />
    );
  }

  return <Listbox {...rest} options={options} showSearchField tinted {...valueProps} />;
}

/* eslint-disable react-refresh/only-export-components -- перечень опций для вызывающего кода */
export { getLocaleOptions };
