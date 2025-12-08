import { Component, signal, ViewChild, effect, viewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Product } from './utils/product.interface';
import { generateProducts } from './utils/data_generator';
import { Table } from './components/table/table';
import { ColumnConfig, generateColumnConfig } from './utils/column.interface';
import { getTableConfig, TableConfig } from './utils/table.interface';
import { TemplateRef } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableLazyLoadEvent } from 'primeng/table';
import { BadgeModule } from "primeng/badge";

@Component({
  selector: 'app-root',
  imports: [ButtonModule, Table, SelectModule, TagModule, CommonModule, FormsModule, BadgeModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('DahabTable');
  products: Product[] = generateProducts(20);
  @ViewChild('quantityFilter', { static: true }) quantityFilter!: TemplateRef<any>;
  @ViewChild('customColumnDesign', { static: true }) customColumnDesign!: TemplateRef<any>;

cols= signal<ColumnConfig[]> ( []);
tableConfig = signal<TableConfig>({columns: this.cols});
  // cols= signal<ColumnConfig[]> ( [
  //   { field: 'id', header: 'ID', sortable: false, filterable: false },
  //   { field: 'code', header: 'Code' },
  //   { field: 'name', header: 'Name' },
  //   {
  //     field: 'price',
  //     header: 'Price',
  //     filterType: 'numeric',
  //     columnDesgin: this.customColumnDesign,
  //   },
  //   ]);
  // tableConfig = signal<TableConfig>({
  //     columns: this.cols,
  //     value: this.products,
  //     size: 'small',
  //     showGridlines: true,
  //     stripedRows: true,
  //     isLoading: true,
  //     rowStyle: this.rowStyle,
  //     rowClass: this.rowClass,
  //     paginator: true,
  //     rows: 5,
  //     rowsPerPageOptions: [5, 10, 20],
  //     globalFilterFields: ['id', 'code', 'name'],
  //     showCurrentPageReport: true,
  //     currentPageReportTemplate: '{first} - {last} of {totalRecords}',
  //     lazy:true,
  //     onLazyLoading:(event)=>{ this.simulateAPI(event)},
  //   });

  ngAfterViewInit(): void {
      this.cols.set ( [
    { field: 'id', header: 'ID', sortable: false, filterable: false },
    { field: 'code', header: 'Code' },
    { field: 'name', header: 'Name' },
    {
      field: 'price',
      header: 'Price',
      filterType: 'numeric',
      columnDesgin: this.customColumnDesign,
    },
    ]);
    this.tableConfig.set({
      columns: this.cols,
      value: this.products,
      size: 'small',
      showGridlines: true,
      stripedRows: true,
      isLoading: true,
      rowStyle: this.rowStyle,
      rowClass: this.rowClass,
      paginator: true,
      rows: 5,
      rowsPerPageOptions: [5, 10, 20],
      globalFilterFields: ['id', 'code', 'name'],
      showCurrentPageReport: true,
      currentPageReportTemplate: '{first} - {last} of {totalRecords}',
      lazy:true,
      onLazyLoading:(event)=>{ this.simulateAPI(event)},
      sortType:'multiple',
      clearFilters:true
    })
    }
  constructor() {
    setTimeout(() => {
      this.tableConfig.update(u=>({...u,isLoading:false}));
    }, 1000);
  }

  

  rowClass(product: Product) {
    if (product.id === 4) return 'bg-primary text-primary-contrast';
    return '';
  }

  rowStyle(product: Product) {
    if (product.id === 2) {
      return { fontWeight: 'bold', fontStyle: 'italic' };
    }
    return {};
  }

  colstyle(product: Product) {
        if (product.price === 0) return 'danger';
        else if (product.price > 0 && product.price < 400) return 'warn';
        else return 'success';
    }



  
retrieveData(data: any[] | undefined, rules: TableLazyLoadEvent) {
  if(!data) return
  let result = [...data];

  if (rules.filters) {
    for (const field in rules.filters) {
      const filterArr = rules.filters[field];
      if (!Array.isArray(filterArr) || !filterArr.length) continue;

      const { value } = filterArr[0];
      if (value == null || value === '') continue;

      const v = value.toString().toLowerCase();

      result = result.filter(row => {
        const cell = row[field];
        if (cell == null) return false;
        return cell.toString().toLowerCase().includes(v);
      });
    }
  }
  if (typeof(rules.sortField) =='string') {
    const field = rules.sortField;
    const order = rules.sortOrder ?? 1; // asc = 1, desc = -1

    result.sort((a, b) => {
      const x = a[field];
      const y = b[field];

      if (x == null && y != null) return -1 * order;
      if (x != null && y == null) return 1 * order;

      return x < y ? -1 * order : x > y ? 1 * order : 0;
    });
  }

  const totalItems = result.length;
  const size = rules.rows ?? totalItems;
  const first = rules.first ?? 0;

  const page = Math.floor(first / size) + 1; // convert offset → page number
  const totalPages = Math.ceil(totalItems / size);

  const pagedData = result.slice(first, first + size);

  return {
    data: pagedData,
    page,
    size,
    totalPages,
    totalItems
  };
}

  simulateAPI(event: TableLazyLoadEvent) {
    const res = this.retrieveData(this.products, event);
    if(!res) return
    const first =( res.page-1) * res.size
    this.tableConfig.update((u)=>({...u,first,rows:res.size,value:res.data,totalRecords:res.totalItems}))

  }
 
}
