import { TemplateRef } from '@angular/core';
import { CellEditor } from 'primeng/table';

export interface ColumnConfig {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'numeric' | 'boolean' | 'date' | 'custom';
  columnDesgin?: TemplateRef<any>;
  columnEditable?: boolean;
  columnEditMethod?: (event: { data: any,  field: string, newValue: any, oldValue: any }) =>  { success: boolean, message: string } | void;
  // filterTemplate?: TemplateRef<any>;
}

export function generateColumnConfig(columnConfigs: ColumnConfig[]) {
  let newConfigList:ColumnConfig[] = []
  for (let columnConfig of columnConfigs){
    newConfigList.push({
      filterable:true,
      sortable:true,
      filterType:'text',
      ...columnConfig
    })
  }
  return newConfigList
}

