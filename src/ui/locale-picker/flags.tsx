/**
 * Файл: `src/ui/locale-picker/flags.tsx`
 * Предоставляет компонент LocaleFlag для отображения флага страны языка.
 *
 * Поддерживает:
 *  - код страны флага через проп `country`. Без пропа или без SVG — глиф Earth
 *
 * Основные задачи:
 * 1. Экспортировать компонент LocaleFlag
 * 2. Типизировать пропсы через `LocaleFlagProps`
 *
 * Потребители:
 *  - `src/ui/locale-picker/locales.tsx` — ставит флаг в опцию языка
 */

import { hasFlag } from 'country-flag-icons';
import * as Flags from 'country-flag-icons/react/3x2';
import { type ComponentType } from 'react';

import { EarthIcon } from '@icons';

import { StyledLocaleFlag } from './locale-picker.styles';

/**
 * FlagComponent — представляет компонент флага из country-flag-icons.
 */
type FlagComponent = ComponentType<{
  'aria-hidden'?: boolean;
  title?: string;
}>;

/**
 * LocaleFlagProps — представляет пропсы компонента LocaleFlag.
 *
 * @property country — код страны флага
 */
type LocaleFlagProps = {
  country?: string;
};

/**
 * LocaleFlag — отображает флаг страны или глиф Earth, если SVG флага нет.
 *
 * @example
 * <LocaleFlag country="US" />
 * <LocaleFlag />
 */
export function LocaleFlag({ country }: LocaleFlagProps) {
  if (!country || !hasFlag(country)) {
    return <EarthIcon />;
  }

  const Flag = (Flags as Record<string, FlagComponent | undefined>)[country];

  if (!Flag) {
    return <EarthIcon />;
  }

  return (
    <StyledLocaleFlag>
      <Flag aria-hidden />
    </StyledLocaleFlag>
  );
}
