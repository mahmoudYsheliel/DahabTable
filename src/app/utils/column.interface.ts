import { TemplateRef } from "@angular/core";

export interface ColumnConfig {
  field: string;
  header: string;
  sortable?:boolean;
  filterable?: boolean;
  filterTemplate?:TemplateRef<any>;


}
