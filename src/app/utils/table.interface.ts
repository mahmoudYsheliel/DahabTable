import { ColumnConfig } from './column.interface';

export interface TableConfig<TInput = any> {
  columns?: ColumnConfig[];
  value?: any[];
  tableStyle?: Object;
  size?: 'small' | 'large' | undefined;
  showGridlines?: boolean;
  stripedRows?: boolean;
  rowStyle?: (input: TInput) => object;
  rowClass?: (input: TInput) => string;
  paginator?: boolean;
  rows?: number;
  rowsPerPageOptions?:number[];
  globalFilterFields?:string[];
}
