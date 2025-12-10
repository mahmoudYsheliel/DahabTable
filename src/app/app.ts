import { Component, signal, ViewChild, effect, NgZone } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Product } from './utils/product.interface';
import { generateProducts } from './utils/data_generator';
import { DahabTable } from './components/table/table';
import { ColumnConfig } from './utils/column.interface';
import { TableConfig } from './utils/table.interface';
import { TemplateRef } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableLazyLoadEvent, TableRowSelectEvent, TableRowUnSelectEvent } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, DahabTable, SelectModule, TagModule, CommonModule, FormsModule, BadgeModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('DahabTable');
  products: Product[] = generateProducts(20);
  @ViewChild('customColumnDesign', { static: true }) customColumnDesign!: TemplateRef<any>;
  @ViewChild('rowExpanssionTemp', { static: true }) rowExpanssionTemp!: TemplateRef<any>;
  @ViewChild('subRowExpanssionTemp', { static: true }) subRowExpanssionTemp!: TemplateRef<any>;

  @ViewChild('captionTemplate', { static: false }) captionTemplate?: TemplateRef<any>;
  @ViewChild('headerTemplate', { static: false }) headerTemplate?: TemplateRef<any>;
  @ViewChild('bodyTemplate', { static: false }) bodyTemplate?: TemplateRef<any>;
  @ViewChild('footerTemplate', { static: false }) footerTemplate?: TemplateRef<any>;

  cols: ColumnConfig[] = [];
  tableConfig = signal<TableConfig>({ columns: this.cols });

  selectedRows = signal<any[]>([]);
  subTableConfig: TableConfig = { columns: [] };

  agg = [
    [
      {
        func: () => {
          return 'Sum';
        },
        colSpan: 5,
      },
      {
        func: this.aggSum,
        colSpan: 1,
      },
    ],

    [
      {
        func: () => {
          return 'Av';
        },
        colSpan: 5,
      },
      {
        func: this.aggAv,
        colSpan: 1,
      },
    ],
  ];
  ngAfterViewInit(): void {
    this.cols = [
      { field: 'id', header: 'ID', sortable: false, filterable: false },
      { field: 'code', header: 'Code' },
      { field: 'name', header: 'Name' },
      {
        field: 'price',
        header: 'Price',
        filterType: 'numeric',
        columnDesgin: this.customColumnDesign,
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
      childTableConfig: {
        size: 'small',
        columns: [
          { field: 'changedAt', header: 'Changed At' },
          { field: 'oldValue', header: 'Old Value' },
          { field: 'newValue', header: 'New Value' },
        ],
      },
      expandedRowTempelate: this.subRowExpanssionTemp,
    };
    this.tableConfig.set({
      dataKey: 'id',
      columns: this.cols,
      size: 'small',
      showGridlines: true,
      stripedRows: true,
      isLoading: true,
      rowStyle: this.rowStyle,
      rowClass: this.rowClass,
      paginator: true,
      rows: 10,
      rowsPerPageOptions: [5, 10, 20],
      globalFilterFields: ['id', 'code', 'name'],
      showCurrentPageReport: true,
      currentPageReportTemplate: '{first} - {last} of {totalRecords}',
      lazy: false,
      onLazyLoading: (event) => {
        this.simulateAPI(event);
      },
      sortType: 'multiple',
      clearFilters: true,
      selectionMethod: 'checkbox',
      onRowSelect: (event: TableRowSelectEvent) => {
        console.log(event);
      },
      onRowUnselect: (event: TableRowUnSelectEvent<Product>) => {
        console.log(event);
      },

      expandable: true,
      expandedRowTempelate: this.rowExpanssionTemp,
      onCollapse: (event: any) => {
        console.log(event);
      },
      onExpansion: (event: any) => {
        console.log(event);
      },
      childTableConfig: this.subTableConfig,
      showCaption: true,
      showFooter: true,

      scrollable: true,
      scrollHeight: '500px',

      onFilter: (event: any) => {
        event;
        console.log(event);
      },
      onSort: (event: any) => {
        console.log(event);
      },
      onPage: (event: any) => {
        console.log(event);
      },

      aggregationFuncs: this.agg,
    });
  }

  constructor(private zone: NgZone) {
    effect(() => {
      const sel = this.selectedRows();
      if (sel.length === 3) {
        this.zone.runOutsideAngular(() => {
          requestAnimationFrame(() => {
            this.selectedRows.update((u) => [u[1], u[2]]);
          });
        });
      }
    });
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

  retrieveData(data: any[] | undefined, rules: TableLazyLoadEvent) {
    if (!data) return;
    let result = [...data];

    if (rules.filters) {
      for (const field in rules.filters) {
        const filterArr = rules.filters[field];
        if (!Array.isArray(filterArr) || !filterArr.length) continue;

        const { value } = filterArr[0];
        if (value == null || value === '') continue;

        const v = value.toString().toLowerCase();

        result = result.filter((row) => {
          const cell = row[field];
          if (cell == null) return false;
          return cell.toString().toLowerCase().includes(v);
        });
      }
    }
    if (typeof rules.sortField == 'string') {
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
      totalItems,
    };
  }

  simulateAPI(event: TableLazyLoadEvent) {
    console.log(event);
    const res = this.retrieveData(this.products, event);
    if (!res) return;
    const first = (res.page - 1) * res.size;
    this.tableConfig.update((u) => ({
      ...u,
      first,
      rows: res.size,
      value: res.data,
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
}
