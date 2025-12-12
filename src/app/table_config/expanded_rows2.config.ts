import { TableConfig } from "../utils/table.interface";

export const SUB_SUB_TABLE_CONFIG:TableConfig = {
  size: 'small',
  dataKey: 'subId',
  columns: [
    { field: 'changedAt', header: 'Changed At' },
    { field: 'oldValue', header: 'Old Value' },
    { field: 'newValue', header: 'New Value' },
  ],
};
