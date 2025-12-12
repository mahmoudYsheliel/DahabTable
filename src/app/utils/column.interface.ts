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

