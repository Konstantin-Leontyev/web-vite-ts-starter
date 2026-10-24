/**
 * Файл: `src/ui/open-control/index.tsx`
 * Содержит точку входа `@ui/open-control`: шеврон, слот сброса и хелперы хрома
 * open-контролов.
 *
 * Основные задачи:
 * 1. Реэкспортировать компоненты `OpenControlChevron` и `OpenControlClear`
 * 2. Реэкспортировать константы `OPEN_CONTROL_ROW_GAP` и `OPEN_CONTROL_SELECTABLE_INSET`
 * 3. Реэкспортировать функции `getOpenControlActiveRowHighlightStyles`,
 *    `getOpenControlOptionsListInlinePadding`, `getOpenControlOptionsListScrollStyles`,
 *    `getOpenControlPanelStyles`, `getOpenControlRootStyles`,
 *    `getOpenControlSelectableRowSurfaceStyles`, `getOpenControlStackedPanelStyles`,
 *    `getOpenControlTriggerRowStyles`, `getOpenControlTriggerStyles` и
 *    `resolveEnabledOpenControlIndex`
 * 4. Реэкспортировать тип `OpenControlSurfaceStyleProps`
 *
 * Потребители:
 *  - `src/ui/listbox/index.tsx` — ставит шеврон и слот сброса и ищет ближайшую
 *    доступную строку через `resolveEnabledOpenControlIndex`
 *  - `src/ui/listbox/listbox.styles.ts` — подставляет хром open-контрола
 *  - `src/ui/range-input/index.tsx` — ставит шеврон и слот сброса
 *  - `src/ui/range-input/range-input.styles.ts` — подставляет хром open-контрола
 *  - `src/ui/date-range-input/date-range-input.styles.ts` — подставляет хром open-контрола
 */

import { OpenControlChevron } from './open-control-chevron';
import { OpenControlClear } from './open-control-clear';
import {
  OPEN_CONTROL_ROW_GAP,
  OPEN_CONTROL_SELECTABLE_INSET,
  getOpenControlActiveRowHighlightStyles,
  getOpenControlOptionsListInlinePadding,
  getOpenControlOptionsListScrollStyles,
  getOpenControlPanelStyles,
  getOpenControlRootStyles,
  getOpenControlSelectableRowSurfaceStyles,
  getOpenControlStackedPanelStyles,
  getOpenControlTriggerRowStyles,
  getOpenControlTriggerStyles,
  resolveEnabledOpenControlIndex,
  type OpenControlSurfaceStyleProps,
} from './open-control.styles';

/* eslint-disable react-refresh/only-export-components -- реэкспорт хелперов хрома со строчной буквы */
export {
  OPEN_CONTROL_ROW_GAP,
  OPEN_CONTROL_SELECTABLE_INSET,
  OpenControlChevron,
  OpenControlClear,
  getOpenControlActiveRowHighlightStyles,
  getOpenControlOptionsListInlinePadding,
  getOpenControlOptionsListScrollStyles,
  getOpenControlPanelStyles,
  getOpenControlRootStyles,
  getOpenControlSelectableRowSurfaceStyles,
  getOpenControlStackedPanelStyles,
  getOpenControlTriggerRowStyles,
  getOpenControlTriggerStyles,
  resolveEnabledOpenControlIndex,
  type OpenControlSurfaceStyleProps,
};
