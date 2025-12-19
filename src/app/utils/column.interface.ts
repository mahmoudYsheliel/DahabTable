import { TemplateRef } from '@angular/core';
import { AlignFrozenDirection, TableEditCellFunc, TableFilterType } from './tpyes';


export interface ColumnConfig {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: TableFilterType;
  columnDesgin?: TemplateRef<any>;
  columnEditable?: boolean;
  columnEditMethod?: TableEditCellFunc;
  isFrozen?:boolean;
  alignFrozen?: AlignFrozenDirection;
  columnStyle?: object;
  columnClass?: string;
  tooltip?:(rowData:any)=>void
  width?: string;  // NEW: Column width (e.g., '150px', '20%')
  resizable?: boolean;  // NEW: Enable/disable resizing per column
  // filterTemplate?: TemplateRef<any>;
}

export function generateColumnConfig(columnConfigs: ColumnConfig[]) {
  let newConfigList:ColumnConfig[] = []
  for (let columnConfig of columnConfigs){
    newConfigList.push({
      filterable:false,
      sortable:false,
      filterType:'text',
      resizable: true,
      ...columnConfig
    })
  }
  return newConfigList
}

