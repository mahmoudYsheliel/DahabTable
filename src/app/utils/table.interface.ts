import { TableLazyLoadEvent } from 'primeng/table';
import { ColumnConfig, generateColumnConfig } from './column.interface';
import { Signal, signal } from '@angular/core';

export interface TableConfig<TInput = any> {
  columns: Signal<ColumnConfig[]>;
  value?: any[];
  tableStyle?: Object;
  isLoading?:boolean;
  size?: 'small' | 'large' | undefined;
  showGridlines?: boolean;
  stripedRows?: boolean;
  rowStyle?: (input: TInput) => object;
  rowClass?: (input: TInput) => string;
  paginator?: boolean;
  rows?: number;
  first?:number;
  showCurrentPageReport?:boolean;
  currentPageReportTemplate?:string;
  onPage?:Function; // not working properly
  rowsPerPageOptions?:number[];
  globalFilterFields?:string[];
  totalRecords?:number;
  lazy?:boolean;
  onLazyLoading?:(input:TableLazyLoadEvent)=>void
  sortType?: 'single' | 'multiple' | undefined;
  clearFilters?:boolean;
}


export function getTableConfig(tableConfig:TableConfig):TableConfig{
  let processedColumns = signal<ColumnConfig[]> (generateColumnConfig(tableConfig.columns()));
  return {
    first:0,
    lazy:false,
    ...tableConfig,
    columns: processedColumns,
  }
}
