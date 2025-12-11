import { Component, signal, ViewChild, effect, NgZone, computed } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Product } from './utils/product.interface';
import { generateProducts } from './utils/data_generator';
import { DahabTable } from './components/table/table';
import { ColumnConfig } from './utils/column.interface';
import { AggCell, TableConfig } from './utils/table.interface';
import { TemplateRef } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { retrieveData } from './utils/simulate_api';

@Component({
  selector: 'app-root',
  imports: [
    ButtonModule,
    DahabTable,
    SelectModule,
    TagModule,
    CommonModule,
    FormsModule,
    BadgeModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('DahabTable');
  @ViewChild('dahabTable') table!: Table;
  products: Product[] = generateProducts(20);
  data = signal(this.products);
  @ViewChild('customColumnDesign', { static: true }) customColumnDesign?: TemplateRef<any>;
  @ViewChild('customActionColumn', { static: true }) customActionColumn?: TemplateRef<any>;
  @ViewChild('rowExpanssionTemp', { static: true }) rowExpanssionTemp?: TemplateRef<any>;
  @ViewChild('subRowExpanssionTemp', { static: true }) subRowExpanssionTemp?: TemplateRef<any>;

  @ViewChild('captionTemplate', { static: false }) captionTemplate?: TemplateRef<any>;
  @ViewChild('headerTemplate', { static: false }) headerTemplate?: TemplateRef<any>;
  @ViewChild('bodyTemplate', { static: false }) bodyTemplate?: TemplateRef<any>;
  @ViewChild('footerTemplate', { static: false }) footerTemplate?: TemplateRef<any>;
  @ViewChild('captionActionTemplate', { static: false }) captionActionTemplate?: TemplateRef<any>;

  cols: ColumnConfig[] = [];
  tableConfig = signal<TableConfig>({ columns: this.cols });

  selectedRows = signal<any[]>([]);
  subTableConfig: TableConfig = { columns: [] };
  subSubTableConfig: TableConfig = { columns: [] };
  agg:AggCell[][] = [
    [
      {
        func: () => {
          return 'Sum';
        },
        colSpan: 3,
        isFrozen:true,
        alignFrozen:'left'
      },
      {
        func:()=>{},
        colSpan:2
      },
      {
        func: this.aggSum,
        colSpan: 2,
        isFrozen:true,
        alignFrozen: 'right'
      },
    ],

    [
      {
        func: () => {
          return 'Av';
        },
        colSpan: 3,
        isFrozen:true,
        alignFrozen:'left'
      },
      {
        func:()=>{},
        colSpan:2
      },
      {
        func: this.aggAv,
        colSpan: 2,
        isFrozen:true,
        alignFrozen:'right'
      },
    ],
  ];
  ngAfterViewInit(): void {
    this.cols = [
      { field: 'id', header: 'ID', sortable: false, filterable: false,isFrozen:true },
      { field: 'code', header: 'Code' },
      {
        field: 'name',
        header: 'Name',
        columnEditable: true,
        columnEditMethod: (event: any) =>
          this.onCellEdit(event.data, event.field, event.newValue, event.oldValue),
      },
      {
        field: 'price',
        header: 'Price',
        filterType: 'numeric',
        columnDesgin: this.customColumnDesign,
        columnEditable: true,
        columnEditMethod: (event: any) =>
          this.onCellEdit(event.data, event.field, event.newValue, event.oldValue),
      isFrozen:true,
      alignFrozen:'right'
      },
      {
        field: '',
        header: 'Action',
        filterable: false,
        sortable: false,
        columnDesgin: this.customActionColumn,
        isFrozen:true,
        alignFrozen:'right'
      },
    ];
    this.subTableConfig = {
      size: 'small',
      dataKey: 'subId',
      columns: [
        { field: 'subId', header: 'ID', sortable: true },
        { field: 'description', header: 'Description', filterable: true },
        { field: 'amount', header: 'Amount', filterable: true, filterType: 'numeric' },
      ],
      expandable: true,
      expandedRowTempelate: this.subRowExpanssionTemp,
    };
    this.subSubTableConfig = {
      size: 'small',
      dataKey: 'subId',
      columns: [
        { field: 'changedAt', header: 'Changed At' },
        { field: 'oldValue', header: 'Old Value' },
        { field: 'newValue', header: 'New Value' },
      ],
    };
    this.tableConfig.set({
      tableStyle:{'min-width':'800px'},
      dataKey: 'id',
      columns: this.cols,
      size: 'small',
      showGridlines: true,
      stripedRows: true,
      isLoading: true,
      rowStyle: this.rowStyle,
      rowClass: this.rowClass,
      paginator: true,
      rows: 100,
      rowsPerPageOptions: [5, 10, 20, 50, 100, 200],
      
      showCurrentPageReport: true,
      currentPageReportTemplate: '{first} - {last} of {totalRecords}',
      lazy: false,
      onLazyLoading: (event) => {
        this.simulateAPI(event);
      },
      sortMode: 'multiple',
      clearFilters: true,
      selectionMethod: 'checkbox',
      onRowSelect: this.logValue,
      onRowUnselect: this.logValue,

      expandable: true,
      expandedRowTempelate: this.rowExpanssionTemp,
      onCollapse: this.logValue,
      onExpansion: this.logValue,

      showCaption: true,
      showFooter: true,

      scrollable: true,
      scrollHeight: '500px',

      onFilter: this.logValue,
      onSort: this.logValue,
      onPage: this.logValue,

      aggregationFuncs: this.agg,

      reorderableColumns: true,

      captionTitle: 'Products',
      showCaptionFilter: true,
      showfilterChips: true,
      showInputSearch:true,
      globalFilterFields: ['id', 'code', 'name'],
      captionActionTemplate: this.captionActionTemplate,

      freezeExpansion:true,
      freezeSelection:true,
      
    });
  }

  constructor() {
    setTimeout(() => {
      this.tableConfig.update((u) => ({ ...u, isLoading: false }));
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

  simulateAPI(event: TableLazyLoadEvent) {
    console.log(event);
    const res = retrieveData(this.products, event);
    if (!res) return;
    const first = (res.page - 1) * res.size;
    this.data.set(res.data);
    this.tableConfig.update((u) => ({
      ...u,
      first,
      rows: res.size,
      totalRecords: res.totalItems,
    }));
  }

  aggSum(data: Product[]) {
    return data.reduce((sum, prod) => {
      return sum + prod.price;
    }, 0);
  }

  aggAv(data: Product[]) {
    if (data.length < 1) return 0;
    return (
      data.reduce((sum, prod) => {
        return sum + prod.price;
      }, 0) / data.length
    );
  }
  onCellEdit(product: any, field: string, newValue: any, oldValue: any) {
    // Validation example 1: Check if price is negative
    if (field === 'price' && newValue < 0) {
      return {
        success: false,
        message: 'Price cannot be negative!',
      };
    }

    // Validation example 2: Check if name is too short
    if (field === 'name' && newValue.length < 3) {
      return {
        success: false,
        message: 'Product name must be at least 3 characters!',
      };
    }

    // Update the value
    product[field] = newValue;

    console.log(`Cell edited: ${field} = ${newValue} from ${oldValue}`, product);

    // Return success with custom message
    return {
      success: true,
      message: `${field} successfully updated from "${oldValue}" to "${newValue}"`,
    };
  }

  logValue(value: any) {
    console.log(value);
  }
  logSelected() {
    console.log(this.selectedRows());
  }
}
