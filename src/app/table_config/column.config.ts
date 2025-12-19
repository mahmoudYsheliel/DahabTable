import { TemplateRef } from '@angular/core';
import { ColumnConfig } from '../utils/column.interface';
import { Product } from '../utils/product.interface';
import { MessageService } from 'primeng/api';

export const cellErrorMap: Record<string, Record<string, string>> = {};
export function getColumnConfig(
  customColumnDesign: TemplateRef<any> | undefined,
  customActionColumn: TemplateRef<any> | undefined,
  messageService: MessageService
): ColumnConfig[] {
  return [
    { field: 'id', header: 'ID', sortable: false, filterable: false, isFrozen: true },
    { field: 'code', header: 'Code',resizable:false},
    {
      field: 'name',
      header: 'Name',
      columnEditable: true,
      columnEditMethod: (event: any) =>
        onNameEdit(event.data, event.newValue, event.oldValue, messageService),
      columnClass: 'column-class',
      tooltip: (rowData: Product) => {
        return rowData.name;
      },
    },
    {
      field: 'categoryType',
      header: 'Category Type',
      width: '200px',
    },
    {
      field: 'price',
      header: 'Price',
      filterType: 'numeric',
      columnDesgin: customColumnDesign,
      columnEditable: true,
      columnEditMethod: (event: any) =>
        onPriceEdit(event.data, event.newValue, event.oldValue, messageService),
      isFrozen: true,
      alignFrozen: 'right',
    },
    {
      field: '',
      header: 'Action',
      filterable: false,
      sortable: false,
      columnDesgin: customActionColumn,
      isFrozen: true,
      alignFrozen: 'right',
    },
  ];
}

function onPriceEdit(
  product: Product,
  newValue: any,
  oldValue: any,
  messageService: MessageService
) {
  let severity = 'error';
  let summary = 'Update Failed';
  let detail = `price successfully updated from "${oldValue}" to "${newValue}"`;
  product.price = oldValue;
  if (newValue < 0) {
    detail = 'Price cannot be negative!';
  } else if (isNaN(newValue)) {
    detail = 'Price must be a number!';
  } else if (!newValue) {
    detail = 'Price can not be empty !';
  } else {
    product.price = newValue;
    severity = 'success';
    summary = 'Cell Updated';
  }

  messageService.add({
    severity,
    summary,
    detail,
    life: 3000,
  });
}

function onNameEdit(
  product: Product,
  newValue: any,
  oldValue: any,
  messageService: MessageService
) {
  let severity = 'error';
  let summary = 'Update Failed';
  let detail = `name successfully updated from "${oldValue}" to "${newValue}"`;
  product.name = oldValue;

  if (newValue.length < 3) {
    detail = 'Product name must be at least 3 characters!';
  } else {
    product.name = newValue;
    severity = 'success';
    summary = 'Cell Updated';
  }
  if (!cellErrorMap[product.id]) {
    cellErrorMap[product.id] = {};
  }

  cellErrorMap[product.id]['name'] = detail;
  console.log(cellErrorMap);
  setTimeout(()=>{
    cellErrorMap[product.id]['name'] = ''
  },5000)

  messageService.add({
    severity,
    summary,
    detail,
    life: 3000,
  });
}
