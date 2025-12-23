import {
  TableLazyLoadEvent,
  TableRowSelectEvent,
  TableRowUnSelectEvent,
  TableRowExpandEvent,
  TableRowCollapseEvent,
  TableFilterEvent,
  TablePageEvent,
} from 'primeng/table';
import { ColumnConfig, generateColumnConfig } from './column.interface';
import { Signal, TemplateRef } from '@angular/core';
import { TreeTableSortEvent } from 'primeng/treetable';
import { MenuItem } from 'primeng/api';
import {
  AlignFrozenDirection,
  AggregationFunc,
  TableSortMode,
  TableSize,
  TableSelectionMethod,
  TableContextMenu,
} from './tpyes';
import { ContextMenu } from 'primeng/contextmenu';
import { FilterGroup } from './filter-group.interface';

export interface AggCell {
  colSpan: number;
  func: AggregationFunc;
  isFrozen?: boolean;
  alignFrozen?: AlignFrozenDirection;
}
export interface ExportMethods {
  csv?: boolean;
  excel?: boolean;
  pdf?: boolean;
}

export interface TableConfig<TInput = any> {
  // data and structure fields
  dataKey?: string;
  columns: ColumnConfig[];

  // styling fields
  size?: TableSize;
  showGridlines?: boolean;
  stripedRows?: boolean;
  tableStyle?: Object;
  rowStyle?: (input: TInput) => object;
  rowClass?: (input: TInput) => string;

  // pagination fields
  paginator?: boolean;
  rows?: number;
  first?: number;
  showCurrentPageReport?: boolean;
  currentPageReportTemplate?: string;
  onPage?: (event: TablePageEvent) => void;
  rowsPerPageOptions?: number[];
  totalRecords?: number;

  // lazy loading
  isLoading?: boolean;
  lazy?: boolean;
  onLazyLoading?: (input: TableLazyLoadEvent) => void;

  //filters
  onFilter?: (event: TableFilterEvent) => void;
  clearFilters?: boolean;

  // sorting
  sortMode?: TableSortMode;
  onSort?: (event: TreeTableSortEvent) => void;

  // selection
  selectionMethod?: TableSelectionMethod;
  freezeSelection?: boolean;
  onRowSelect?: (event: TableRowSelectEvent) => void;
  onRowUnselect?: (event: TableRowUnSelectEvent<TInput>) => void;

  // expanded rows
  expandable?: boolean;
  expandedRowTempelate?: TemplateRef<any>;
  onExpansion?: (event: TableRowExpandEvent) => void;
  onCollapse?: (event: TableRowCollapseEvent) => void;
  freezeExpansion?: boolean;

  //scrolling
  scrollable?: boolean;
  scrollHeight?: string;

  // aggregation
  aggregationFuncs?: AggCell[][]; // array of fields and there colspans and functions

  // templates
  showCaption?: boolean;
  captionTemplate?: TemplateRef<any>;
  headerTemplate?: TemplateRef<any>;
  bodyTemplate?: TemplateRef<any>;
  showFooter?: boolean;
  footerTemplate?: TemplateRef<any>;
  paginationTemplate?: TemplateRef<any>;

  // caption configuration
  captionTitle?: string;
  showCaptionFilter?: boolean;
  showfilterChips?: boolean;
  showInputSearch?: boolean;
  globalFilterFields?: string[];
  captionActionTemplate?: TemplateRef<any>;

  // virtual scroll
  virtualScroll?: boolean;
  virtualScrollItemSize?: number;

  // reorder columns
  reorderableColumns?: boolean;

  // export options
  exportFilename?: string;
  exportButtons?: ExportMethods;

  importable?:boolean;
  // context menu options
  contextMenu?: boolean;
  contextMenuItems?: TableContextMenu;

  // ✅ NEW: Row grouping configuration

  grouping?: {
    enabled: boolean;
    groupableColumns?: string[]; // ✅ NEW: Specify which column fields can be grouped
  };



  columnResizeable?: boolean; // NEW: Enable/disable column resizing

  filterTemplate?:TemplateRef<any>,

}


export function getTableConfig(tableConfig: TableConfig | undefined): TableConfig | undefined {
  if (!tableConfig) return;
  let processedColumns = generateColumnConfig(tableConfig.columns);
  return {
    first: 0,
    lazy: false,
    paginator:true,
    ...tableConfig,
    columns: processedColumns,
  };
}
