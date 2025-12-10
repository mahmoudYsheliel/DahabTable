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
import { Signal, signal, TemplateRef } from '@angular/core';
import { TreeTableSortEvent } from 'primeng/treetable';


type Func = (data:any[])=>any
export interface AggCell {
  colSpan:number,
  func:Func
}
export interface TableConfig<TInput = any> {
  // data and structure fields
  dataKey?: string;
  columns: ColumnConfig[];

  // styling fields
  size?: 'small' | 'large';
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
  onPage?: (event:TablePageEvent) => void; // not working properly
  rowsPerPageOptions?: number[];
  totalRecords?: number;

  // lazy loading
  isLoading?: boolean;
  lazy?: boolean;
  onLazyLoading?: (input: TableLazyLoadEvent) => void;

  //filters
  globalFilterFields?: string[];
  onFilter?: (event:TableFilterEvent) => void;
  clearFilters?: boolean;

  // sorting
  sortMode?: 'single' | 'multiple';
  onSort?: (event:TreeTableSortEvent) => void;

  // selection
  selectionMethod?: 'checkbox'| 'radiobutton';
  onRowSelect?: (event: TableRowSelectEvent) => void;
  onRowUnselect?: (event: TableRowUnSelectEvent<TInput>) => void;

  // expanded rows
  expandable?: boolean;
  expandedRowTempelate?: TemplateRef<any>;
  onExpansion?: (event: TableRowExpandEvent) => void;
  onCollapse?: (event: TableRowCollapseEvent) => void;

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

  // virtual scroll
  virtualScroll?: boolean;
  virtualScrollItemSize?: number;

  // reorder columns
  reorderableColumns?: boolean;
}



export function getTableConfig(tableConfig: TableConfig | undefined): TableConfig | undefined {
  if (!tableConfig) return;
  let processedColumns = generateColumnConfig(tableConfig.columns);
  return {
    first: 0,
    lazy: false,
    ...tableConfig,
    columns: processedColumns,
  };
}
