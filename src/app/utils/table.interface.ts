import { TableLazyLoadEvent } from 'primeng/table';
import { ColumnConfig } from './column.interface';

export interface TableConfig<TInput = any> {
  columns?: ColumnConfig[];
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
}


export function getTableConfig(tableConfig:TableConfig):TableConfig{
  return {
    first:0,
    lazy:false,
    ...tableConfig
  }
}
