/**
 * Файл: `src/ui/table/index.tsx`
 * Предоставляет компонент Table для отображения табличных данных со скроллом,
 * выбором строк и панелями добавления и редактирования.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - подсветку строки при наведении через проп `hoverHighlight`
 *  - рамку вокруг таблицы через проп `showBorder`
 *  - чередование фона строк через проп `striped`
 *  - колонки через проп `columns`
 *  - добавление и редактирование строк через проп `editable`. Без `editable` таблица
 *    только выводит строки
 *  - колонку нумерации через проп `numbered`
 *  - строки данных через проп `rows`
 *  - текст ошибки панели добавления через проп `addError`
 *  - подсказку в полоске ошибки панели добавления через проп `addHint`, пока нет
 *    `addError`
 *  - режим панели добавления строки через проп `addRowActive`
 *  - якорь панели добавления через проп `addRowSource`
 *  - обработчик запроса на добавление строки через проп `onAddRow`. Без колбэка кнопка
 *    «+» видна, но недоступна
 *  - обработчик отмены добавления строки через проп `onAddCancel`
 *  - рендер ячеек панели добавления через проп `renderAddCell`
 *  - текст ошибки панели редактирования через проп `editError`
 *  - подсказку в полоске ошибки панели редактирования через проп `editHint`, пока нет
 *    `editError`
 *  - режим панели редактирования строки через проп `editRowActive`
 *  - ключ редактируемой строки через проп `editRowKey`
 *  - обработчик отмены редактирования через проп `onEditCancel`
 *  - обработчик запроса на редактирование строки через проп `onEditRow`
 *  - рендер ячеек панели редактирования через проп `renderEditCell`
 *  - видимый текст кнопки правки через проп `editLabel`. Без пропа — `Edit`.
 *    Пустая строка прячет текст, доступное имя остаётся этой фразой
 *  - доступное имя кнопки и диалога добавления через проп `addRowAriaLabel`.
 *    Без пропа — `Add row`. Пустая строка остаётся этой фразой
 *  - доступное имя диалога редактирования через проп `editRowAriaLabel`.
 *    Без пропа — `Edit row`. Пустая строка остаётся этой фразой
 *  - выбор строк через проп `checkable`. Без него каждое поле выбора погашено
 *    и спред этих полей не собирается. При `checkable: true` поля выбора есть
 *  - полный набор выбираемых ключей через проп `allSelectableKeys`
 *  - ключи членов группы через проп `getRowGroupMemberKeys`
 *  - ключ строки через проп `getRowKey`
 *  - фильтр выбираемых строк через проп `isRowSelectable`
 *  - обработчик изменения выбранных ключей через проп `onSelectedKeysChange`
 *  - действия при множественном выборе через проп `renderBulkSelectionActions`
 *  - действия выбранной строки через проп `renderSelectedRowActions`
 *  - колонку с чекбоксом строки через проп `rowCheckboxColumnKey`
 *  - выбранные ключи через проп `selectedKeys`
 *  - колонку действий выбранной строки через проп `selectedRowActionsColumnKey`
 *  - доступное имя чекбокса выбора всех строк через проп `selectAllAriaLabel`.
 *    Без пропа — `Select all rows`. Пустая строка остаётся этой фразой
 *  - доступное имя чекбокса сброса выбора через проп `clearSelectionAriaLabel`.
 *    Без пропа — `Clear selection`. Пустая строка остаётся этой фразой
 *  - доступное имя чекбокса строки без видимого текста через проп `selectRowAriaLabel`.
 *    Без пропа — `Select row`. Пустая строка остаётся этой фразой
 *  - доступное имя чекбокса группы без видимого заголовка через проп `selectGroupAriaLabel`.
 *    Без пропа — `Select group`. Пустая строка остаётся этой фразой
 *
 * Основные задачи:
 * 1. Экспортировать компонент Table
 * 2. Типизировать пропсы через `TableProps`
 * 3. Экспортировать типы `TableAddRowSource`, `TableAddRowActiveProps`,
 *    `TableCellRenderContext`, `TableColumn`, `TableEditRowActiveProps` и
 *    `TableEditableProps`
 * 4. Экспортировать дефолты подсказок `DEFAULT_ADD_HINT` и `DEFAULT_EDIT_HINT`
 * 5. Реэкспортировать утилиту `computeTableColumnInlineSizes`, тип `TableColumnSizeConfig`
 *    и дефолты пропов стилизации
 * 6. Реэкспортировать сателлиты `TableCell`, `TableCellAlign`, `TableGroupCell`,
 *    `TableInlineField`, `TableMemberPrefix` и `TableNestedCell`
 * 7. Ставить фокус при открытии панелей add и edit на первое поле ввода
 *    внутри узла панели. Панель открывают ради правки строки, кнопка
 *    шапки и чекбокс в обход не входят
 * 8. Называть галочку строки и группы текстом ячейки колонки галочки, без слова
 *    `Select` и не по внутреннему ключу. Связь — `aria-labelledby` на узел, чей
 *    текст совпал со значением колонки, id на этом узле. Экранный чтец говорит
 *    этот текст, затем роль флажка. Такого узла нет — `aria-label`, целая фраза
 *    `Select row` или `Select group`, проп заменяет её целиком. В шапке и подвале —
 *    `Select all rows` и `Clear selection`
 * 9. Показывать в отмеченной строке текст, затем кнопку Edit тона `primary`
 *    и размера `small`, затем действия выбранной строки. У заголовка группы
 *    Edit нет, действия видны, когда группа отмечена. Кнопка добавления и Edit
 *    несут `aria-haspopup`, `aria-expanded` и `aria-controls`. Долгое нажатие
 *    выбираемой строки сразу запрашивает её правку. С клавиатуры сначала галочка,
 *    затем Edit. Стрелка вниз на Edit запрашивает правку, на кнопке добавления —
 *    добавление
 *
 * Потребители:
 *  - `src/pages/showcase/table-demo/index.tsx` — собирает демо-таблицу каталога
 *  - `src/pages/showcase/table-settings/index.tsx` — подставляет дефолты подсказок
 *    в поля панели
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */
import {
  cloneElement,
  isValidElement,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';

import { useLongPress } from '@hooks/use-long-press';
import { PlusIcon } from '@icons';
import { AnchoredPanel } from '@ui/anchored-panel';
import { Button } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import { FieldError } from '@ui/field-error';
import { Icon } from '@ui/icon';
import { getTextSize, type SizePreset } from '@ui/presets';
import { ScrollPort } from '@ui/scroll-port';
import { Text, type TextSizePreset } from '@ui/text';

import {
  StyledTableCellLead,
  TableCell,
  type TableCellAlign,
  type TableCellHeadProps,
} from './table-cell';
import {
  DEFAULT_TABLE_SIZE_PRESET,
  StyledTable,
  StyledTableBody,
  StyledTableCellTrailing,
  StyledTableClip,
  StyledTableCol,
  StyledTableFoot,
  StyledTableHead,
  StyledTableHeaderKeywordBar,
  StyledTableHeaderMarkSpacer,
  StyledTablePanel,
  StyledTablePanelErrorCell,
  StyledTableRow,
  StyledTableRowPanel,
  splitLayoutProps,
  type TableStyleProps,
} from './table.styles';

/**
 * NUMBER_COLUMN_INLINE_SIZE — задаёт ширину колонки нумерации в режиме `fixed`.
 */
const NUMBER_COLUMN_INLINE_SIZE = '3.5rem';

/**
 * BULK_SELECTION_MIN — задаёт минимум выбранных строк для групповых действий
 * и группового чекбокса в шапке.
 */
const BULK_SELECTION_MIN = 2;

/**
 * SCROLL_OVERFLOW_THRESHOLD_PX — задаёт субпиксельный допуск при сравнении высоты
 * контента с viewport.
 */
const SCROLL_OVERFLOW_THRESHOLD_PX = 1;

/**
 * TableAddRowSource — представляет сторону якоря панели добавления строки:
 * шапку или футер.
 */
export type TableAddRowSource = 'foot' | 'head';

/**
 * TableCellRenderContext — представляет контекст рендера ячейки таблицы.
 * Передаётся в `renderCell`, `renderAddCell` и `renderEditCell`.
 *
 * @property addError — текст ошибки панели добавления для связи с полем
 * @property addErrorId — id полоски ошибки панели добавления для `aria-describedby`
 * @property editError — текст ошибки панели редактирования для связи с полем
 * @property editErrorId — id полоски ошибки панели редактирования для `aria-describedby`
 * @property textSize — размер текста ячейки по `size` таблицы
 */
export type TableCellRenderContext = {
  addError?: string;
  addErrorId?: string;
  editError?: string;
  editErrorId?: string;
  textSize: TextSizePreset;
};

/**
 * TableColumn — представляет описание колонки таблицы.
 *
 * @property align — горизонтальное выравнивание содержимого ячейки данных
 * @property ellipsis — включает обрезку содержимого с многоточием
 * @property header — текст заголовка колонки
 * @property headerAlign — горизонтальное выравнивание заголовка. Данные выравнивает `align`
 * @property inlineSize — фиксированная ширина колонки в режиме `fixed`
 * @property key — ключ поля строки
 * @property nowrap — включает запрет переноса содержимого ячейки
 * @property renderCell — кастомный рендер ячейки данных
 */
export type TableColumn<Row> = {
  align?: TableCellAlign;
  ellipsis?: boolean;
  header: string;
  headerAlign?: TableCellAlign;
  inlineSize?: string;
  key: Extract<keyof Row, string>;
  nowrap?: boolean;
  renderCell?: (
    row: Row,
    rowIndex: number,
    context: TableCellRenderContext
  ) => ReactNode;
};

/**
 * DEFAULT_ADD_HINT — задаёт подсказку в полоске ошибки панели добавления по умолчанию.
 * Используется, когда вызывающий код не передал проп `addHint`.
 */
export const DEFAULT_ADD_HINT =
  'Press Esc to close without saving, or Enter to add the row. Use Tab to move between fields.';

/**
 * DEFAULT_EDIT_HINT — задаёт подсказку в полоске ошибки панели редактирования по умолчанию.
 * Используется, когда вызывающий код не передал проп `editHint`.
 */
export const DEFAULT_EDIT_HINT =
  'Press Esc to close without saving, or Enter to save changes';

/**
 * DEFAULT_TABLE_ADD_ROW_ACTIVE — задаёт режим панели добавления строки по умолчанию.
 * Используется, когда вызывающий код не передал проп `addRowActive`.
 */
const DEFAULT_TABLE_ADD_ROW_ACTIVE = false;

/**
 * DEFAULT_TABLE_EDIT_ROW_ACTIVE — задаёт режим панели редактирования строки по умолчанию.
 * Используется, когда вызывающий код не передал проп `editRowActive`.
 */
const DEFAULT_TABLE_EDIT_ROW_ACTIVE = false;

/**
 * DEFAULT_TABLE_EDITABLE — задаёт режим редактирования таблицы по умолчанию.
 * Используется, когда вызывающий код не передал проп `editable`.
 */
const DEFAULT_TABLE_EDITABLE = false;

/**
 * DEFAULT_TABLE_HEADER_RESERVE_ADD_BUTTON — задаёт резерв слота кнопки «+» в шапке
 * по умолчанию.
 * Используется, когда вызывающий код не передал проп `reserveAddButton`.
 */
const DEFAULT_TABLE_HEADER_RESERVE_ADD_BUTTON = false;

/**
 * DEFAULT_TABLE_HEADER_RESERVE_CHECKBOX — задаёт резерв слота чекбокса в шапке
 * по умолчанию.
 * Используется, когда вызывающий код не передал проп `reserveCheckbox`.
 */
const DEFAULT_TABLE_HEADER_RESERVE_CHECKBOX = false;

/**
 * DEFAULT_TABLE_NUMBERED — задаёт показ колонки нумерации по умолчанию.
 * Используется, когда вызывающий код не передал проп `numbered`.
 */
const DEFAULT_TABLE_NUMBERED = true;

/**
 * DEFAULT_TABLE_ADD_ROW_ARIA_LABEL — задаёт доступное имя кнопки и диалога добавления строки по умолчанию.
 * Используется, когда вызывающий код не передал проп `addRowAriaLabel`.
 */
const DEFAULT_TABLE_ADD_ROW_ARIA_LABEL = 'Add row';

/**
 * DEFAULT_TABLE_EDIT_LABEL — задаёт видимый текст кнопки правки строки по умолчанию.
 * Используется, когда вызывающий код не передал проп `editLabel`.
 */
export const DEFAULT_TABLE_EDIT_LABEL = 'Edit';

/**
 * DEFAULT_TABLE_EDIT_ROW_ARIA_LABEL — задаёт доступное имя диалога редактирования строки по умолчанию.
 * Используется, когда вызывающий код не передал проп `editRowAriaLabel`.
 */
const DEFAULT_TABLE_EDIT_ROW_ARIA_LABEL = 'Edit row';

/**
 * TABLE_ROW_ACTION_SIZE_PRESET — задаёт `size` кнопки Edit.
 * Совпадает с размером Delete в ячейке строки.
 */
const TABLE_ROW_ACTION_SIZE_PRESET: SizePreset = 'small';

/**
 * DEFAULT_TABLE_SELECT_ALL_ARIA_LABEL — задаёт доступное имя чекбокса выбора всех строк по умолчанию.
 * Используется, когда вызывающий код не передал проп `selectAllAriaLabel`.
 */
const DEFAULT_TABLE_SELECT_ALL_ARIA_LABEL = 'Select all rows';

/**
 * DEFAULT_TABLE_CLEAR_SELECTION_ARIA_LABEL — задаёт доступное имя чекбокса сброса выбора по умолчанию.
 * Используется, когда вызывающий код не передал проп `clearSelectionAriaLabel`.
 */
const DEFAULT_TABLE_CLEAR_SELECTION_ARIA_LABEL = 'Clear selection';

/**
 * DEFAULT_TABLE_SELECT_GROUP_ARIA_LABEL — задаёт доступное имя чекбокса группы без видимого заголовка по умолчанию.
 * Используется, когда вызывающий код не передал проп `selectGroupAriaLabel`.
 */
const DEFAULT_TABLE_SELECT_GROUP_ARIA_LABEL = 'Select group';

/**
 * DEFAULT_TABLE_SELECT_ROW_ARIA_LABEL — задаёт доступное имя чекбокса строки без видимого текста по умолчанию.
 * Используется, когда вызывающий код не передал проп `selectRowAriaLabel`.
 */
const DEFAULT_TABLE_SELECT_ROW_ARIA_LABEL = 'Select row';

/**
 * TableAddRowActiveProps — представляет пропсы активной панели добавления строки Table.
 * Поля `addRowSource` и `renderAddCell` допустимы только вместе с `addRowActive`.
 *
 * @property addRowActive — включает режим панели добавления строки
 * @property addRowSource — якорь панели: шапка или футер
 * @property renderAddCell — рендер содержимого ячейки в панели добавления
 */
export type TableAddRowActiveProps<Row> =
  | {
      addRowActive: true;
      addRowSource?: TableAddRowSource;
      renderAddCell?: (
        column: TableColumn<Row>,
        context: TableCellRenderContext
      ) => ReactNode;
    }
  | {
      addRowActive?: false;
      addRowSource?: never;
      renderAddCell?: never;
    };

/**
 * TableEditRowActiveProps — представляет пропсы активной панели правки строки Table.
 * Поле `editRowKey` допустимо только вместе с `editRowActive`.
 *
 * @property editRowActive — включает режим панели редактирования строки
 * @property editRowKey — ключ редактируемой строки
 */
export type TableEditRowActiveProps =
  | {
      editRowActive: true;
      editRowKey?: string;
    }
  | {
      editRowActive?: false;
      editRowKey?: never;
    };

/**
 * TableEditableProps — представляет пропсы режима редактирования Table.
 * Поля панелей добавления и правки допустимы только вместе с `editable`.
 *
 * @property addError — текст ошибки панели добавления строки
 * @property addHint — текст подсказки в полоске ошибки панели добавления, пока нет
 *   `addError`
 * @property addRowAriaLabel — доступное имя кнопки и диалога добавления строки.
 *   Без пропа — `Add row`. Пустая строка остаётся этой фразой
 * @property editable — включает добавление и редактирование строк
 * @property editError — текст ошибки панели редактирования строки
 * @property editHint — текст подсказки в полоске ошибки панели редактирования, пока нет
 *   `editError`
 * @property editLabel — видимый текст кнопки правки строки. Без пропа — `Edit`.
 *   Пустая строка прячет текст, доступное имя остаётся этой фразой
 * @property editRowAriaLabel — доступное имя диалога редактирования строки.
 *   Без пропа — `Edit row`. Пустая строка остаётся этой фразой
 * @property onAddCancel — обработчик отмены добавления строки
 * @property onAddRow — обработчик запроса на добавление строки из шапки или футера.
 *   Без колбэка кнопка «+» видна, но недоступна
 * @property onEditCancel — обработчик отмены редактирования строки
 * @property onEditRow — обработчик запроса на редактирование строки
 * @property renderEditCell — рендер содержимого ячейки в панели редактирования
 */
export type TableEditableProps<Row> =
  | {
      addError?: never;
      addHint?: never;
      addRowActive?: never;
      addRowAriaLabel?: never;
      addRowSource?: never;
      editable?: false;
      editError?: never;
      editHint?: never;
      editLabel?: never;
      editRowActive?: never;
      editRowAriaLabel?: never;
      editRowKey?: never;
      onAddCancel?: never;
      onAddRow?: never;
      onEditCancel?: never;
      onEditRow?: never;
      renderAddCell?: never;
      renderEditCell?: never;
    }
  | ({
      addError?: string;
      addHint?: string;
      addRowAriaLabel?: string;
      editable: true;
      editError?: string;
      editHint?: string;
      editLabel?: string;
      editRowAriaLabel?: string;
      onAddCancel?: () => void;
      onAddRow?: (source: TableAddRowSource) => void;
      onEditCancel?: () => void;
      onEditRow?: (row: Row) => void;
      renderEditCell?: (
        column: TableColumn<Row>,
        row: Row,
        context: TableCellRenderContext
      ) => ReactNode;
    } & TableAddRowActiveProps<Row> &
      TableEditRowActiveProps);

/**
 * TableSelectionProps — представляет пропсы выбора строк Table.
 * Доступны только при `checkable` равном `true`.
 *
 * @property allSelectableKeys — полный набор выбираемых ключей, включая скрытые
 *   в свёрнутых группах. Если задан, «выбрать всё» в шапке и её галка работают над ним,
 *   а не только над видимыми строками: свёрнутые строки тоже выделяются. Иначе выбор
 *   охватывает только видимые строки
 * @property checkable — включает режим выбора строк
 * @property clearSelectionAriaLabel — доступное имя чекбокса сброса выбора. Без пропа —
 *   `Clear selection`. Пустая строка остаётся этой фразой
 * @property getRowGroupMemberKeys — ключи строк-членов группы для строки-заголовка.
 *   Для обычной строки возвращает `undefined`. Непустой набор включает групповой
 *   чекбокс у заголовка: отмечает и снимает все эти строки, включая свёрнутые.
 *   Галка стоит, когда выбраны все
 * @property getRowKey — стабильный ключ строки
 * @property isRowSelectable — признак, можно ли выбрать строку
 * @property onSelectedKeysChange — обработчик изменения набора выбранных ключей
 * @property renderBulkSelectionActions — действия шапки при множественном выборе
 * @property renderSelectedRowActions — действия в ячейке выбранной строки
 * @property rowCheckboxColumnKey — ключ колонки, в которой рендерится чекбокс строки.
 *   В шапке этой колонки стоят select-all, «+» и bulk
 * @property selectAllAriaLabel — доступное имя чекбокса выбора всех строк. Без пропа —
 *   `Select all rows`. Пустая строка остаётся этой фразой
 * @property selectedKeys — выбранные ключи строк
 * @property selectedRowActionsColumnKey — ключ колонки для действий выбранной строки
 * @property selectGroupAriaLabel — доступное имя чекбокса группы без видимого заголовка.
 *   Без пропа — `Select group`. Пустая строка остаётся этой фразой
 * @property selectRowAriaLabel — доступное имя чекбокса строки без видимого текста.
 *   Без пропа — `Select row`. Пустая строка остаётся этой фразой
 */
type TableSelectionProps<Row> = {
  allSelectableKeys?: string[];
  checkable: true;
  clearSelectionAriaLabel?: string;
  getRowGroupMemberKeys?: (row: Row) => string[] | undefined;
  getRowKey: (row: Row) => string;
  isRowSelectable?: (row: Row) => boolean;
  onSelectedKeysChange: (keys: Set<string>) => void;
  renderBulkSelectionActions?: () => ReactNode;
  renderSelectedRowActions?: (row: Row) => ReactNode;
  rowCheckboxColumnKey: Extract<keyof Row, string>;
  selectAllAriaLabel?: string;
  selectedKeys: ReadonlySet<string>;
  selectedRowActionsColumnKey?: Extract<keyof Row, string>;
  selectGroupAriaLabel?: string;
  selectRowAriaLabel?: string;
};

/**
 * TableSelectionOffProps — представляет погашенные пропсы выбора строк Table.
 * Без `checkable` каждое поле выбора запрещено. Спред этих полей без `checkable`
 * не собирается. При `checkable: true` те же поля задаёт `TableSelectionProps`.
 *
 * @property allSelectableKeys — запрещён без `checkable`
 * @property checkable — режим выбора выключен
 * @property clearSelectionAriaLabel — запрещён без `checkable`
 * @property getRowGroupMemberKeys — запрещён без `checkable`
 * @property getRowKey — запрещён без `checkable`
 * @property isRowSelectable — запрещён без `checkable`
 * @property onSelectedKeysChange — запрещён без `checkable`
 * @property renderBulkSelectionActions — запрещён без `checkable`
 * @property renderSelectedRowActions — запрещён без `checkable`
 * @property rowCheckboxColumnKey — запрещён без `checkable`
 * @property selectAllAriaLabel — запрещён без `checkable`
 * @property selectedKeys — запрещён без `checkable`
 * @property selectedRowActionsColumnKey — запрещён без `checkable`
 * @property selectGroupAriaLabel — запрещён без `checkable`
 * @property selectRowAriaLabel — запрещён без `checkable`
 */
type TableSelectionOffProps = {
  allSelectableKeys?: never;
  checkable?: false;
  clearSelectionAriaLabel?: never;
  getRowGroupMemberKeys?: never;
  getRowKey?: never;
  isRowSelectable?: never;
  onSelectedKeysChange?: never;
  renderBulkSelectionActions?: never;
  renderSelectedRowActions?: never;
  rowCheckboxColumnKey?: never;
  selectAllAriaLabel?: never;
  selectedKeys?: never;
  selectedRowActionsColumnKey?: never;
  selectGroupAriaLabel?: never;
  selectRowAriaLabel?: never;
};

/**
 * TableProps — представляет пропсы компонента Table.
 *
 * @property columns — описание колонок
 * @property numbered — включает колонку нумерации
 * @property rows — строки данных
 */
type TableProps<Row> = {
  columns: TableColumn<Row>[];
  numbered?: boolean;
  rows: Row[];
} & TableEditableProps<Row> &
  TableStyleProps &
  (
    | (TableSelectionOffProps &
        Omit<
          ComponentPropsWithRef<'table'>,
          'className' | 'style' | keyof TableEditableProps<Row> | keyof TableStyleProps
        >)
    | (TableSelectionProps<Row> &
        Omit<
          ComponentPropsWithRef<'table'>,
          | 'className'
          | 'style'
          | keyof TableEditableProps<Row>
          | keyof TableSelectionProps<Row>
          | keyof TableStyleProps
        >)
  );

/**
 * handleTablePanelOpenFocus — ставит начальный фокус панели add или edit.
 *
 * @param panel DOM-узел панели
 */
function handleTablePanelOpenFocus(panel: HTMLElement): void {
  panel
    .querySelector<HTMLElement>(
      'input:not([disabled]):not([type="checkbox"]):not([type="hidden"]):not([type="radio"])'
    )
    ?.focus();
}

/**
 * resolveRowVisibleText — возвращает видимый текст колонки галочки.
 * Строка, число и булево читаются как текст. Иное значение даёт пустую строку.
 *
 * @param row строка данных
 * @param columnKey ключ колонки галочки
 * @returns видимый текст колонки или пустая строка
 */
function resolveRowVisibleText<Row>(
  row: Row,
  columnKey: Extract<keyof Row, string> | undefined
): string {
  if (columnKey === undefined) {
    return '';
  }

  const value = row[columnKey];

  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return '';
}

/**
 * resolvePhrase — возвращает целую фразу имени.
 * Пустая строка или пробелы остаются умолчанием.
 *
 * @param value переданный текст
 * @param fallback умолчание фразы
 * @returns фраза имени
 */
function resolvePhrase(value: string | undefined, fallback: string): string {
  if (value !== undefined && value.trim() !== '') {
    return value;
  }

  return fallback;
}

/**
 * SelectionLabelElementProps — представляет пропсы элемента при поиске текста ячейки.
 *
 * @property children — содержимое элемента
 * @property id — идентификатор элемента, если он уже задан
 */
type SelectionLabelElementProps = {
  children?: ReactNode;
  id?: string;
};

/**
 * SelectionLabelAttachment — представляет результат поиска текста в ячейке.
 *
 * @property attached — признак, что узел с совпавшим текстом найден
 * @property labelId — идентификатор найденного узла
 * @property node — содержимое ячейки. При находке на узле стоит идентификатор
 */
type SelectionLabelAttachment = {
  attached: boolean;
  labelId: string | undefined;
  node: ReactNode;
};

/**
 * TableCheckboxNameProps — представляет доступное имя чекбокса выбора.
 * При видимом тексте — ссылка на узел. Без текста — фраза целиком.
 *
 * @property ariaLabel — фраза имени без видимого текста
 * @property ariaLabelledBy — идентификатор узла видимого текста
 */
type TableCheckboxNameProps =
  | { ariaLabel: string; ariaLabelledBy?: never }
  | { ariaLabel?: never; ariaLabelledBy: string };

/**
 * resolveSelectionLabelText — возвращает видимый текст текстового узла.
 *
 * @param node содержимое узла
 * @returns обрезанный текст или `undefined`, если узел не текст или текст пуст
 */
function resolveSelectionLabelText(node: ReactNode): string | undefined {
  if (typeof node !== 'string' && typeof node !== 'number') {
    return undefined;
  }

  const text = String(node).trim();

  if (text === '') {
    return undefined;
  }

  return text;
}

/**
 * resolveElementLabelText — возвращает видимый текст содержимого элемента.
 * Смешанное содержимое текстом не считается.
 *
 * @param children содержимое элемента
 * @returns текст содержимого или `undefined`, если оно не сводится к тексту
 */
function resolveElementLabelText(children: ReactNode): string | undefined {
  const directText = resolveSelectionLabelText(children);

  if (directText !== undefined) {
    return directText;
  }

  if (!Array.isArray(children)) {
    return undefined;
  }

  const parts: string[] = [];

  for (const child of children) {
    if (child == null || typeof child === 'boolean') {
      continue;
    }

    if (typeof child !== 'string' && typeof child !== 'number') {
      return undefined;
    }

    parts.push(String(child));
  }

  const text = parts.join('').trim();

  if (text === '') {
    return undefined;
  }

  return text;
}

/**
 * resolveSelectionLabelList — возвращает соседние узлы, в которых на первый
 * узел, чей текст совпал со значением колонки, поставлен id.
 * Не нашёл — id не ставит.
 *
 * @param nodes соседние узлы
 * @param id идентификатор для найденного узла
 * @param visibleText значение колонки
 * @returns список узлов и признак, что текст найден
 */
function resolveSelectionLabelList(
  nodes: readonly ReactNode[],
  id: string,
  visibleText: string
): SelectionLabelAttachment {
  let labelId: string | undefined;
  const next = nodes.map((child) => {
    if (labelId !== undefined) {
      return child;
    }

    const result = resolveSelectionLabel(child, id, visibleText);

    if (!result.attached || result.labelId === undefined) {
      return child;
    }

    labelId = result.labelId;
    return result.node;
  });

  if (labelId === undefined) {
    return { attached: false, labelId: undefined, node: nodes };
  }

  return { attached: true, labelId, node: next };
}

/**
 * resolveSelectionLabelElement — возвращает элемент, в котором на узел,
 * чей текст совпал со значением колонки, поставлен id.
 * Собственный текст элемента совпал — ставит id на элемент и оставляет уже
 * заданный id. Не нашёл — id не ставит.
 *
 * @param element элемент ячейки
 * @param id идентификатор для найденного узла
 * @param visibleText значение колонки
 * @returns элемент и признак, что текст найден
 */
function resolveSelectionLabelElement(
  element: ReactElement<SelectionLabelElementProps>,
  id: string,
  visibleText: string
): SelectionLabelAttachment {
  const { children } = element.props;

  if (resolveElementLabelText(children) === visibleText) {
    const existingId = element.props.id;

    if (existingId !== undefined && existingId !== '') {
      return { attached: true, labelId: existingId, node: element };
    }

    return {
      attached: true,
      labelId: id,
      node: cloneElement(element, { id }),
    };
  }

  if (Array.isArray(children)) {
    const list = resolveSelectionLabelList(children, id, visibleText);

    if (!list.attached || !Array.isArray(list.node)) {
      return { attached: false, labelId: undefined, node: element };
    }

    return {
      attached: true,
      labelId: list.labelId,
      node: cloneElement(element, undefined, ...list.node),
    };
  }

  if (children == null || typeof children === 'boolean') {
    return { attached: false, labelId: undefined, node: element };
  }

  const child = resolveSelectionLabel(children, id, visibleText);

  if (!child.attached) {
    return { attached: false, labelId: undefined, node: element };
  }

  return {
    attached: true,
    labelId: child.labelId,
    node: cloneElement(element, undefined, child.node),
  };
}

/**
 * resolveSelectionLabel — возвращает дерево ячейки, в котором на узел,
 * чей текст совпал со значением колонки, поставлен id.
 * Оборачивает текстовый узел в `<span>` с этим id. Не нашёл — id не ставит,
 * имя чекбокса остаётся фразой без текста.
 *
 * @param node дерево ячейки
 * @param id идентификатор для найденного узла
 * @param visibleText значение колонки
 * @returns содержимое ячейки и признак, что текст найден
 */
function resolveSelectionLabel(
  node: ReactNode,
  id: string,
  visibleText: string
): SelectionLabelAttachment {
  if (node == null || typeof node === 'boolean') {
    return { attached: false, labelId: undefined, node };
  }

  if (typeof node === 'string' || typeof node === 'number') {
    if (resolveSelectionLabelText(node) !== visibleText) {
      return { attached: false, labelId: undefined, node };
    }

    return {
      attached: true,
      labelId: id,
      node: <span id={id}>{node}</span>,
    };
  }

  if (Array.isArray(node)) {
    return resolveSelectionLabelList(node, id, visibleText);
  }

  if (!isValidElement<SelectionLabelElementProps>(node)) {
    return { attached: false, labelId: undefined, node };
  }

  return resolveSelectionLabelElement(node, id, visibleText);
}

/**
 * TableCheckbox — отображает чекбокс выбора строки или группы в таблице.
 */
function TableCheckbox({
  ariaLabel,
  ariaLabelledBy,
  checked,
  onToggle,
}: TableCheckboxNameProps & {
  checked: boolean;
  onToggle: () => void;
}): ReactNode {
  if (ariaLabelledBy !== undefined) {
    return (
      <Checkbox
        aria-labelledby={ariaLabelledBy}
        checked={checked}
        size="small"
        onChange={onToggle}
      />
    );
  }

  return (
    <Checkbox
      aria-label={ariaLabel}
      checked={checked}
      size="small"
      onChange={onToggle}
    />
  );
}

/**
 * TableHeaderLeadSpacers — отображает резервные lead-слоты keyword-шапки, когда
 * чекбокс или кнопка «+» не рендерятся.
 */
function TableHeaderLeadSpacers({
  reserveAddButton = DEFAULT_TABLE_HEADER_RESERVE_ADD_BUTTON,
  reserveCheckbox = DEFAULT_TABLE_HEADER_RESERVE_CHECKBOX,
}: {
  reserveAddButton?: boolean;
  reserveCheckbox?: boolean;
}): ReactNode {
  return (
    <>
      {reserveCheckbox && (
        <StyledTableHeaderMarkSpacer aria-hidden="true" mark="checkbox" />
      )}
      {reserveAddButton && <StyledTableHeaderMarkSpacer aria-hidden="true" mark="add" />}
    </>
  );
}

/**
 * TableBodyRowProps — представляет пропсы внутренней строки тела Table.
 *
 * @property actionsColumnKey — ключ колонки действий выбранной строки
 * @property anchorRef — ref якорной строки панели редактирования
 * @property checkable — признак режима выбора строк
 * @property columns — описание колонок
 * @property editLabel — видимый текст кнопки правки строки
 * @property editPanelId — id диалога редактирования для `aria-controls` кнопки Edit
 * @property editRowActive — признак открытой панели редактирования
 * @property groupMemberKeys — ключи членов группы для строки-заголовка
 * @property groupSelected — признак, что все члены группы выбраны
 * @property isEditAnchor — признак, что строка — якорь панели редактирования
 * @property isSelected — признак выбранной строки
 * @property onEditRow — обработчик запроса на редактирование строки
 * @property renderSelectedRowActions — действия в ячейке выбранной строки
 * @property resolvedNumbered — признак колонки нумерации
 * @property row — данные строки
 * @property rowCheckboxColumnKey — ключ колонки с чекбоксом строки
 * @property rowIndex — индекс строки в видимом списке
 * @property rowKey — стабильный ключ строки
 * @property rowSelectable — признак, можно ли выбрать строку
 * @property selectGroupAriaLabel — доступное имя чекбокса группы без видимого заголовка
 * @property selectRowAriaLabel — доступное имя чекбокса строки без видимого текста
 * @property size — размер таблицы
 * @property textSize — размер текста ячейки
 * @property toggleGroupKeys — обработчик выбора или снятия группы ключей
 * @property toggleRowKey — обработчик переключения выбора одной строки
 */
type TableBodyRowProps<Row> = {
  actionsColumnKey: Extract<keyof Row, string> | undefined;
  anchorRef: RefObject<HTMLTableRowElement | null>;
  checkable: boolean;
  columns: TableColumn<Row>[];
  editLabel: string | undefined;
  editPanelId: string;
  editRowActive: boolean;
  groupMemberKeys: string[] | undefined;
  groupSelected: boolean;
  isEditAnchor: boolean;
  isSelected: boolean;
  onEditRow: ((row: Row) => void) | undefined;
  renderSelectedRowActions: ((row: Row) => ReactNode) | undefined;
  resolvedNumbered: boolean;
  row: Row;
  rowCheckboxColumnKey: Extract<keyof Row, string> | undefined;
  rowIndex: number;
  rowKey: string;
  rowSelectable: boolean;
  selectGroupAriaLabel: string;
  selectRowAriaLabel: string;
  size: TableStyleProps['size'];
  textSize: TextSizePreset;
  toggleGroupKeys: (memberKeys: string[]) => void;
  toggleRowKey: (rowKey: string) => void;
};

/**
 * TableBodyRow — отображает одну строку тела таблицы.
 */
function TableBodyRow<Row>({
  actionsColumnKey,
  anchorRef,
  checkable,
  columns,
  editLabel,
  editPanelId,
  editRowActive,
  groupMemberKeys,
  groupSelected,
  isEditAnchor,
  isSelected,
  onEditRow,
  renderSelectedRowActions,
  resolvedNumbered,
  row,
  rowCheckboxColumnKey,
  rowIndex,
  rowKey,
  rowSelectable,
  selectGroupAriaLabel,
  selectRowAriaLabel,
  size,
  textSize,
  toggleGroupKeys,
  toggleRowKey,
}: TableBodyRowProps<Row>): ReactNode {
  const selectionLabelId = useId();
  const visibleText = resolveRowVisibleText(row, rowCheckboxColumnKey);
  // Заголовок группы с непустым набором членов получает групповой чекбокс:
  // выбрать или снять всю группу, включая свёрнутые строки.
  const isGroupSelector =
    checkable && !rowSelectable && (groupMemberKeys?.length ?? 0) > 0;
  const { pointerProps } = useLongPress({
    disabled: !onEditRow || editRowActive || !rowSelectable,
    onLongPress: onEditRow ? () => onEditRow(row) : undefined,
  });

  function handleEditRowClick(): void {
    onEditRow?.(row);
  }

  function handleEditRowKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (event.key !== 'ArrowDown') {
      return;
    }

    event.preventDefault();
    onEditRow?.(row);
  }

  return (
    <StyledTableRow
      $editHidden={isEditAnchor}
      ref={isEditAnchor ? anchorRef : undefined}
      size={size}
      {...(pointerProps ?? {})}
    >
      {resolvedNumbered && (
        <TableCell size={size} textAlign="end">
          <Text size={textSize}>{rowIndex + 1}</Text>
        </TableCell>
      )}
      {columns.map((column) => {
        const cellContent = column.renderCell ? (
          column.renderCell(row, rowIndex, { textSize })
        ) : (
          <Text size={textSize}>{String(row[column.key] ?? '')}</Text>
        );
        const isCheckboxColumn = checkable && column.key === rowCheckboxColumnKey;
        const showRowCheckbox = rowSelectable && isCheckboxColumn;
        const showGroupCheckbox = isGroupSelector && isCheckboxColumn;
        const showSelectionCheckbox = showRowCheckbox || showGroupCheckbox;
        const attachment =
          showSelectionCheckbox && visibleText !== ''
            ? resolveSelectionLabel(cellContent, selectionLabelId, visibleText)
            : undefined;
        const columnContent =
          attachment?.attached === true ? attachment.node : cellContent;
        const selectionName: TableCheckboxNameProps =
          attachment?.attached === true && attachment.labelId !== undefined
            ? { ariaLabelledBy: attachment.labelId }
            : {
                ariaLabel: showGroupCheckbox ? selectGroupAriaLabel : selectRowAriaLabel,
              };
        const showRowActionsInColumn =
          actionsColumnKey !== undefined && column.key === actionsColumnKey;
        const leadCheckbox = showSelectionCheckbox && (
          <TableCheckbox
            {...selectionName}
            checked={showGroupCheckbox ? groupSelected : isSelected}
            onToggle={() => {
              if (showGroupCheckbox) {
                toggleGroupKeys(groupMemberKeys ?? []);
                return;
              }

              toggleRowKey(rowKey);
            }}
          />
        );
        const showEditButton =
          showRowActionsInColumn &&
          isSelected &&
          rowSelectable &&
          onEditRow !== undefined;
        const showRowDelete =
          showRowActionsInColumn &&
          renderSelectedRowActions !== undefined &&
          ((isSelected && rowSelectable) || (isGroupSelector && groupSelected));
        const editButton = showEditButton ? (
          <Button
            aria-controls={editPanelId}
            aria-expanded={isEditAnchor}
            aria-haspopup="dialog"
            aria-label={editLabel === undefined ? DEFAULT_TABLE_EDIT_LABEL : undefined}
            size={TABLE_ROW_ACTION_SIZE_PRESET}
            tone="primary"
            onClick={handleEditRowClick}
            onKeyDown={handleEditRowKeyDown}
          >
            {editLabel}
          </Button>
        ) : null;
        const rowDelete = showRowDelete ? renderSelectedRowActions(row) : null;
        const showTrailingActions = editButton !== null || rowDelete !== null;

        const bodyContent =
          (showTrailingActions && (
            <StyledTableCellTrailing>
              {columnContent}
              {editButton}
              {rowDelete}
            </StyledTableCellTrailing>
          )) ||
          columnContent;

        return (
          <TableCell
            ellipsis={column.ellipsis && !showTrailingActions}
            key={column.key}
            nowrap={column.nowrap}
            size={size}
            textAlign={column.align}
          >
            {(leadCheckbox && (
              <StyledTableCellLead>
                {leadCheckbox}
                {bodyContent}
              </StyledTableCellLead>
            )) ||
              bodyContent}
          </TableCell>
        );
      })}
    </StyledTableRow>
  );
}

/**
 * Table — отображает таблицу данных со скроллом, выбором строк и панелями
 * добавления и редактирования.
 *
 * @example
 * <Table
 *   aria-label="Catalog table demo"
 *   columns={columns}
 *   numbered={false}
 *   rows={tableRows}
 *   showBorder
 *   size="normal"
 * />
 * <Table
 *   aria-label="Catalog table demo"
 *   checkable
 *   columns={columns}
 *   editable
 *   getRowKey={(row) => row.rowId}
 *   rowCheckboxColumnKey="product"
 *   rows={tableRows}
 *   selectedKeys={selectedKeys}
 *   onSelectedKeysChange={setSelectedKeys}
 * />
 */
export function Table<Row>(props: TableProps<Row>) {
  const {
    addError,
    addHint = DEFAULT_ADD_HINT,
    addRowActive: addRowActiveProp = DEFAULT_TABLE_ADD_ROW_ACTIVE,
    addRowAriaLabel,
    addRowSource,
    allSelectableKeys: allSelectableKeysProp,
    checkable: checkableProp,
    clearSelectionAriaLabel,
    columns,
    editError,
    editHint = DEFAULT_EDIT_HINT,
    editLabel,
    editRowActive: editRowActiveProp = DEFAULT_TABLE_EDIT_ROW_ACTIVE,
    editRowAriaLabel,
    editRowKey,
    editable = DEFAULT_TABLE_EDITABLE,
    getRowGroupMemberKeys: getRowGroupMemberKeysProp,
    getRowKey,
    hoverHighlight,
    isRowSelectable: isRowSelectableProp,
    numbered,
    onAddCancel,
    onAddRow: onAddRowProp,
    onEditCancel,
    onEditRow: onEditRowProp,
    onSelectedKeysChange,
    renderAddCell,
    renderBulkSelectionActions,
    renderEditCell,
    renderSelectedRowActions,
    rowCheckboxColumnKey: rowCheckboxColumnKeyProp,
    rows,
    selectAllAriaLabel,
    selectGroupAriaLabel,
    selectRowAriaLabel,
    selectedKeys: selectedKeysProp,
    selectedRowActionsColumnKey,
    showBorder,
    size,
    striped,
    ...rest
  } = props;

  const resolvedNumbered = numbered ?? DEFAULT_TABLE_NUMBERED;
  const resolvedAddRowAriaLabel = resolvePhrase(
    addRowAriaLabel,
    DEFAULT_TABLE_ADD_ROW_ARIA_LABEL
  );
  const resolvedEditRowAriaLabel = resolvePhrase(
    editRowAriaLabel,
    DEFAULT_TABLE_EDIT_ROW_ARIA_LABEL
  );
  const resolvedEditLabel =
    editLabel === undefined
      ? DEFAULT_TABLE_EDIT_LABEL
      : editLabel.trim() === ''
        ? undefined
        : editLabel;
  const resolvedSelectAllAriaLabel = resolvePhrase(
    selectAllAriaLabel,
    DEFAULT_TABLE_SELECT_ALL_ARIA_LABEL
  );
  const resolvedClearSelectionAriaLabel = resolvePhrase(
    clearSelectionAriaLabel,
    DEFAULT_TABLE_CLEAR_SELECTION_ARIA_LABEL
  );
  const resolvedSelectRowAriaLabel = resolvePhrase(
    selectRowAriaLabel,
    DEFAULT_TABLE_SELECT_ROW_ARIA_LABEL
  );
  const resolvedSelectGroupAriaLabel = resolvePhrase(
    selectGroupAriaLabel,
    DEFAULT_TABLE_SELECT_GROUP_ARIA_LABEL
  );

  // Проп editable: без него таблица только выводит строки, без добавления,
  // редактирования, панелей и long-press.
  const addRowActive = editable && addRowActiveProp;
  const editRowActive = editable && editRowActiveProp;
  const onAddRow = editable ? onAddRowProp : undefined;
  const onEditRow = editable ? onEditRowProp : undefined;

  const addErrorId = useId();
  const addPanelId = useId();
  const editErrorId = useId();
  const editPanelId = useId();

  const checkable = checkableProp === true;
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const textSize = getTextSize(size ?? DEFAULT_TABLE_SIZE_PRESET);
  const rowCheckboxColumnKey = checkable ? rowCheckboxColumnKeyProp : undefined;
  const fixed = columns.some((column) => column.inlineSize !== undefined);

  const headAnchorRef = useRef<HTMLTableSectionElement>(null);
  const footAnchorRef = useRef<HTMLTableSectionElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const editPanelRef = useRef<HTMLDivElement>(null);
  const editRowAnchorRef = useRef<HTMLTableRowElement>(null);
  const tableRootRef = useRef<HTMLTableElement>(null);
  const headAddButtonRef = useRef<HTMLButtonElement>(null);
  const footAddButtonRef = useRef<HTMLButtonElement>(null);

  const selectedKeys =
    checkable && selectedKeysProp !== undefined ? selectedKeysProp : new Set<string>();
  const isRowSelectable = checkable
    ? (isRowSelectableProp ?? (() => true))
    : () => false;
  const getRowGroupMemberKeys = checkable ? getRowGroupMemberKeysProp : undefined;
  // Универсум выбора: полный список ключей, включая скрытые в свёрнутых группах, если
  // его передал вызывающий код. Иначе только видимые выбираемые строки.
  const allSelectableKeys = checkable
    ? (allSelectableKeysProp ??
      (getRowKey
        ? rows.filter((row) => isRowSelectable(row)).map((row) => getRowKey(row))
        : []))
    : [];
  const allRowsSelected =
    checkable &&
    selectedKeys.size > 0 &&
    allSelectableKeys.length > 0 &&
    allSelectableKeys.every((key) => selectedKeys.has(key));
  const hasBulkSelection = checkable && selectedKeys.size >= BULK_SELECTION_MIN;
  // Галка в шапке и футере стоит, когда доступны групповые действия при двух и более
  // выбранных строках или выбраны все строки таблицы. Случай одной строки: одна из одной
  // считается всеми, поэтому галка ставится и снимается и для единственной строки.
  const headerSelectionActive = hasBulkSelection || allRowsSelected;
  const actionsColumnKey = checkable ? selectedRowActionsColumnKey : undefined;
  const hideHeadAnchor = addRowActive && addRowSource === 'head';
  const hideFootAnchor = addRowActive && addRowSource === 'foot';
  const [showFootHeader, setShowFootHeader] = useState(false);
  const showFootHeaderRow =
    checkable && (showFootHeader || (addRowActive && addRowSource === 'foot'));
  const showAddPanel =
    addRowActive && addRowSource !== undefined && renderAddCell !== undefined;
  const editingRow =
    editRowActive && editRowKey !== undefined
      ? rows.find((row, rowIndex) =>
          checkable && getRowKey
            ? getRowKey(row) === editRowKey
            : String(rowIndex) === editRowKey
        )
      : undefined;
  const showEditPanel =
    editRowActive &&
    editRowKey !== undefined &&
    editingRow !== undefined &&
    renderEditCell !== undefined;
  const addErrorMessage = addError?.trim() ?? '';
  const hasAddError = addErrorMessage !== '';
  const editErrorMessage = editError?.trim() ?? '';
  const hasEditError = editErrorMessage !== '';
  const addCellContext: TableCellRenderContext = {
    addError: hasAddError ? addErrorMessage : undefined,
    addErrorId,
    textSize,
  };
  const editCellContext: TableCellRenderContext = {
    editError: hasEditError ? editErrorMessage : undefined,
    editErrorId,
    textSize,
  };

  const toggleRowKey = (rowKey: string): void => {
    if (!checkable || onSelectedKeysChange === undefined) {
      return;
    }

    const next = new Set(selectedKeys);

    if (next.has(rowKey)) {
      next.delete(rowKey);
    } else {
      next.add(rowKey);
    }

    onSelectedKeysChange(next);
  };

  const toggleAllRows = (): void => {
    if (!checkable || onSelectedKeysChange === undefined) {
      return;
    }

    if (headerSelectionActive) {
      onSelectedKeysChange(new Set());
      return;
    }

    onSelectedKeysChange(new Set(allSelectableKeys));
  };

  // Групповой тоггл: если все члены группы уже выбраны — снять их, иначе добавить.
  // Свёрнутые члены тоже попадают в выбор, потому что memberKeys содержит их ключи.
  const toggleGroupKeys = (memberKeys: string[]): void => {
    if (!checkable || onSelectedKeysChange === undefined || memberKeys.length === 0) {
      return;
    }

    const next = new Set(selectedKeys);
    const allSelected = memberKeys.every((key) => next.has(key));

    for (const key of memberKeys) {
      if (allSelected) {
        next.delete(key);
      } else {
        next.add(key);
      }
    }

    onSelectedKeysChange(next);
  };

  const renderKeywordColumnHeader = (
    column: TableColumn<Row>,
    addSource: TableAddRowSource,
    interactive: boolean
  ): ReactNode => (
    <StyledTableHeaderKeywordBar>
      <StyledTableCellLead>
        {interactive ? (
          <TableCheckbox
            ariaLabel={
              headerSelectionActive
                ? resolvedClearSelectionAriaLabel
                : resolvedSelectAllAriaLabel
            }
            checked={headerSelectionActive}
            onToggle={toggleAllRows}
          />
        ) : (
          <TableHeaderLeadSpacers reserveCheckbox />
        )}
        {(interactive && editable && (
          <Icon
            aria-controls={addPanelId}
            aria-expanded={showAddPanel && addRowSource === addSource}
            aria-haspopup="dialog"
            aria-label={resolvedAddRowAriaLabel}
            as="button"
            disabled={!onAddRow || addRowActive || editRowActive}
            ref={addSource === 'head' ? headAddButtonRef : footAddButtonRef}
            shape="rounded"
            showBorder
            size="tiny"
            tabIndex={onAddRow && !addRowActive && !editRowActive ? undefined : -1}
            onClick={() => {
              onAddRow?.(addSource);
            }}
            onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                onAddRow?.(addSource);
              }
            }}
          >
            <PlusIcon />
          </Icon>
        )) ||
          (!interactive && <TableHeaderLeadSpacers reserveAddButton />) ||
          null}
        <Text size={textSize}>{column.header}</Text>
      </StyledTableCellLead>
      {interactive && hasBulkSelection && renderBulkSelectionActions?.()}
    </StyledTableHeaderKeywordBar>
  );

  const renderHeaderCells = (
    head: boolean,
    addSource: TableAddRowSource,
    interactive: boolean
  ): ReactNode => {
    const headProps: TableCellHeadProps = head ? { head: true, scope: 'col' } : {};

    return (
      <>
        {resolvedNumbered && (
          <TableCell size={size} textAlign="end" {...headProps}>
            <Text size={textSize}>#</Text>
          </TableCell>
        )}
        {columns.map((column) => (
          <TableCell
            ellipsis={column.ellipsis}
            key={column.key}
            nowrap={column.nowrap}
            size={size}
            textAlign={column.headerAlign ?? column.align}
            {...headProps}
          >
            {checkable && column.key === rowCheckboxColumnKey ? (
              renderKeywordColumnHeader(column, addSource, interactive)
            ) : (
              <Text size={textSize}>{column.header}</Text>
            )}
          </TableCell>
        ))}
      </>
    );
  };

  const renderPanelCells = ({
    renderCell,
    reserveAddButton = DEFAULT_TABLE_HEADER_RESERVE_ADD_BUTTON,
  }: {
    renderCell: (column: TableColumn<Row>) => ReactNode;
    reserveAddButton?: boolean;
  }): ReactNode => (
    <>
      {resolvedNumbered && <TableCell size={size} textAlign="end" />}
      {columns.map((column) => {
        const cellContent = renderCell(column);
        const cellBody =
          (checkable && column.key === rowCheckboxColumnKey && (
            <StyledTableCellLead>
              <TableHeaderLeadSpacers
                reserveAddButton={reserveAddButton}
                reserveCheckbox
              />
              {cellContent}
            </StyledTableCellLead>
          )) ||
          cellContent;

        return (
          <TableCell
            key={column.key}
            nowrap={column.nowrap}
            size={size}
            textAlign={column.align}
          >
            {cellBody}
          </TableCell>
        );
      })}
    </>
  );

  const renderAddCells = (): ReactNode =>
    renderPanelCells({
      renderCell: (column) => renderAddCell?.(column, addCellContext),
      reserveAddButton: true,
    });

  const renderEditCells = (row: Row): ReactNode =>
    renderPanelCells({
      renderCell: (column) => renderEditCell?.(column, row, editCellContext),
    });

  const renderColgroup = (): ReactNode => {
    if (!fixed) {
      return null;
    }

    return (
      <colgroup>
        {resolvedNumbered && <StyledTableCol inlineSize={NUMBER_COLUMN_INLINE_SIZE} />}
        {columns.map((column) => (
          <StyledTableCol inlineSize={column.inlineSize} key={column.key} />
        ))}
      </colgroup>
    );
  };

  const addColumnCount = (resolvedNumbered ? 1 : 0) + columns.length;

  const renderErrorRow = (variant: 'add' | 'edit'): ReactNode => {
    const isAdd = variant === 'add';

    return (
      <StyledTableRow size={size}>
        <StyledTablePanelErrorCell colSpan={addColumnCount} size={size}>
          <FieldError
            id={isAdd ? addErrorId : editErrorId}
            placeholder={isAdd ? addHint : editHint}
            reserveErrorSpace
          >
            {isAdd ? addError : editError}
          </FieldError>
        </StyledTablePanelErrorCell>
      </StyledTableRow>
    );
  };

  // Нижняя шапка нужна только при вертикальном переполнении viewport. Сравниваем
  // высоту контента scrollHeight без самого footer с clientHeight: вычитание footer
  // обязательно, иначе показанный footer сам поддерживает переполнение и не исчезает.
  useLayoutEffect(() => {
    if (!checkable) {
      return;
    }

    const viewport = scrollViewportRef.current;
    const table = tableRootRef.current;

    if (!viewport || !table) {
      return;
    }

    function updateFootHeaderVisibility(): void {
      const viewportElement = scrollViewportRef.current;

      if (!viewportElement) {
        return;
      }

      const footElement = footAnchorRef.current;
      const intrinsicScroll =
        viewportElement.scrollHeight - (footElement?.offsetHeight ?? 0);
      const nextShowFootHeader =
        intrinsicScroll > viewportElement.clientHeight + SCROLL_OVERFLOW_THRESHOLD_PX;

      setShowFootHeader((current) =>
        current === nextShowFootHeader ? current : nextShowFootHeader
      );
    }

    updateFootHeaderVisibility();

    const resizeObserver = new ResizeObserver(updateFootHeaderVisibility);

    resizeObserver.observe(viewport);
    resizeObserver.observe(table);
    window.addEventListener('resize', updateFootHeaderVisibility);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateFootHeaderVisibility);
    };
  }, [checkable, columns.length, rows.length]);

  const addAnchorRef = addRowSource === 'head' ? headAnchorRef : footAnchorRef;

  const addPanel = (
    <AnchoredPanel
      anchorRef={addAnchorRef}
      dismissActive={showAddPanel && onAddCancel !== undefined}
      dismissZoneRefs={[panelRef]}
      open={showAddPanel}
      panelRef={panelRef}
      returnFocusRef={addRowSource === 'foot' ? footAddButtonRef : headAddButtonRef}
      onDismiss={() => onAddCancel?.()}
      onOpenFocus={handleTablePanelOpenFocus}
    >
      <StyledTableRowPanel
        $anchorBlockEnd={addRowSource === 'foot'}
        $hasError={hasAddError}
        aria-label={resolvedAddRowAriaLabel}
        aria-modal={true}
        id={addPanelId}
        ref={panelRef}
        role="dialog"
      >
        <StyledTablePanel tableLayout={fixed ? 'fixed' : 'auto'}>
          {renderColgroup()}
          <tbody>
            {addRowSource === 'head' ? (
              <>
                <StyledTableRow size={size}>
                  {renderHeaderCells(true, 'head', false)}
                </StyledTableRow>
                <StyledTableRow size={size}>{renderAddCells()}</StyledTableRow>
                {renderErrorRow('add')}
              </>
            ) : (
              <>
                <StyledTableRow size={size}>{renderAddCells()}</StyledTableRow>
                {renderErrorRow('add')}
                <StyledTableRow data-add-footer size={size}>
                  {renderHeaderCells(false, 'foot', false)}
                </StyledTableRow>
              </>
            )}
          </tbody>
        </StyledTablePanel>
      </StyledTableRowPanel>
    </AnchoredPanel>
  );

  const editPanel =
    showEditPanel && editingRow !== undefined ? (
      <AnchoredPanel
        anchorRef={editRowAnchorRef}
        dismissActive={showEditPanel && onEditCancel !== undefined}
        dismissZoneRefs={[editPanelRef]}
        open={showEditPanel}
        panelRef={editPanelRef}
        returnFocusRef={editRowAnchorRef}
        onDismiss={() => onEditCancel?.()}
        onOpenFocus={handleTablePanelOpenFocus}
      >
        <StyledTableRowPanel
          $hasError={hasEditError}
          aria-label={resolvedEditRowAriaLabel}
          aria-modal={true}
          id={editPanelId}
          ref={editPanelRef}
          role="dialog"
        >
          <StyledTablePanel tableLayout={fixed ? 'fixed' : 'auto'}>
            {renderColgroup()}
            <tbody>
              <StyledTableRow size={size}>{renderEditCells(editingRow)}</StyledTableRow>
              {renderErrorRow('edit')}
            </tbody>
          </StyledTablePanel>
        </StyledTableRowPanel>
      </AnchoredPanel>
    ) : null;

  const table = (
    <>
      <StyledTable
        {...restProps}
        ref={tableRootRef}
        tableLayout={fixed ? 'fixed' : 'auto'}
      >
        {renderColgroup()}
        <StyledTableHead $addHidden={hideHeadAnchor} ref={headAnchorRef}>
          <StyledTableRow size={size}>
            {renderHeaderCells(true, 'head', true)}
          </StyledTableRow>
        </StyledTableHead>
        <StyledTableBody $hoverHighlight={hoverHighlight} $striped={striped}>
          {rows.map((row, rowIndex) => {
            const rowKey = checkable && getRowKey ? getRowKey(row) : String(rowIndex);
            const isSelected = checkable && selectedKeys.has(rowKey);
            const isEditAnchor = editRowActive && editRowKey === rowKey;
            const groupMemberKeys = getRowGroupMemberKeys?.(row);
            const groupSelected =
              (groupMemberKeys?.length ?? 0) > 0 &&
              (groupMemberKeys ?? []).every((key) => selectedKeys.has(key));

            return (
              <TableBodyRow
                actionsColumnKey={actionsColumnKey}
                anchorRef={editRowAnchorRef}
                checkable={checkable}
                columns={columns}
                editLabel={resolvedEditLabel}
                editPanelId={editPanelId}
                editRowActive={editRowActive}
                groupMemberKeys={groupMemberKeys}
                groupSelected={groupSelected}
                isEditAnchor={isEditAnchor}
                isSelected={isSelected}
                key={rowKey}
                renderSelectedRowActions={
                  checkable ? renderSelectedRowActions : undefined
                }
                resolvedNumbered={resolvedNumbered}
                row={row}
                rowCheckboxColumnKey={rowCheckboxColumnKey}
                rowIndex={rowIndex}
                rowKey={rowKey}
                rowSelectable={isRowSelectable(row)}
                selectGroupAriaLabel={resolvedSelectGroupAriaLabel}
                selectRowAriaLabel={resolvedSelectRowAriaLabel}
                size={size}
                textSize={textSize}
                toggleGroupKeys={toggleGroupKeys}
                toggleRowKey={toggleRowKey}
                onEditRow={onEditRow}
              />
            );
          })}
        </StyledTableBody>
        {showFootHeaderRow && (
          <StyledTableFoot $addHidden={hideFootAnchor} ref={footAnchorRef}>
            <StyledTableRow size={size}>
              {renderHeaderCells(false, 'foot', true)}
            </StyledTableRow>
          </StyledTableFoot>
        )}
      </StyledTable>
      {addPanel}
      {editPanel}
    </>
  );

  return (
    <ScrollPort ref={scrollViewportRef} {...layoutProps}>
      <StyledTableClip $showBorder={showBorder}>{table}</StyledTableClip>
    </ScrollPort>
  );
}

export { TableCell, type TableCellAlign } from './table-cell';
export { TableGroupCell } from './table-group-cell';
export { TableInlineField } from './table-inline-field';
export { TableMemberPrefix } from './table-member-prefix';
export { TableNestedCell } from './table-nested-cell';
/* eslint-disable react-refresh/only-export-components -- реэкспорт утилит sizing и дефолтов пропов стилизации Table */
export {
  DEFAULT_TABLE_HOVER_HIGHLIGHT,
  DEFAULT_TABLE_SHOW_BORDER,
  DEFAULT_TABLE_SIZE_PRESET,
  DEFAULT_TABLE_STRIPED,
  computeTableColumnInlineSizes,
  type TableColumnSizeConfig,
} from './table.styles';
