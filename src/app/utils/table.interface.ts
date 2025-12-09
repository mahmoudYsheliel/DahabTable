import {
  TableLazyLoadEvent,
  TableRowSelectEvent,
  TableRowUnSelectEvent,
  TableRowExpandEvent,
  TableRowCollapseEvent,
} from 'primeng/table';
import { ColumnConfig, generateColumnConfig } from './column.interface';
import { Signal, signal, TemplateRef } from '@angular/core';

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
  onPage?: Function; // not working properly
  rowsPerPageOptions?: number[];
  totalRecords?: number;

  // lazy loading
  isLoading?: boolean;
  lazy?: boolean;
  onLazyLoading?: (input: TableLazyLoadEvent) => void;

  //filters
  globalFilterFields?: string[];
  clearFilters?: boolean;

  // sorting
  sortType?: 'single' | 'multiple';

  // selection
  selectionMethod?: 'checkbox';
  onRowSelect?: (event: TableRowSelectEvent) => void;
  onRowUnselect?: (event: TableRowUnSelectEvent<TInput>) => void;

  // expanded rows
  expandable?: boolean;
  childTableConfig?: TableConfig;
  expandedRowTempelate?: TemplateRef<any>;
  onExpansion?: (event: TableRowExpandEvent) => void;
  onCollapse?: (event: TableRowCollapseEvent) => void;


  // templates
  showCaption?: boolean
  captionTemplate?: TemplateRef<any>;
  headerTemplate?: TemplateRef<any>;
  bodyTemplate?: TemplateRef<any>;
  showFooter?: boolean
  footerTemplate?: TemplateRef<any>;
  paginationTemplate?: TemplateRef<any>;
}

export function getTableConfig(tableConfig: TableConfig | undefined): TableConfig | undefined {
  if (!tableConfig) return
  let processedColumns =generateColumnConfig(tableConfig.columns);
  return {
    first: 0,
    lazy: false,
    ...tableConfig,
    columns: processedColumns,
  };
}
