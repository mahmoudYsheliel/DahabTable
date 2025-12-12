import { TemplateRef } from "@angular/core";
import { TableConfig } from "../utils/table.interface";

export function getSubTableConfig(subRowExpanssionTemp:TemplateRef<any> | undefined):TableConfig {
  return {
    size: 'small',
    dataKey: 'subId',
    columns: [
      { field: 'subId', header: 'ID', sortable: true },
      { field: 'description', header: 'Description', filterable: true },
      { field: 'amount', header: 'Amount', filterable: true, filterType: 'numeric' },
    ],
    expandable: true,
    expandedRowTempelate: subRowExpanssionTemp,
  };
}
