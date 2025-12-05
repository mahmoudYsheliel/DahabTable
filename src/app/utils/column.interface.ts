import { TemplateRef } from '@angular/core';

export interface ColumnConfig {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'numeric' | 'boolean' | 'date' | 'custom';
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
