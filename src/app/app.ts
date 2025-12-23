import { Component, computed, signal, ViewChild } from '@angular/core';
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
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { retrieveData } from './utils/simulate_api';
import { getSubTableConfig } from './table_config/expanded_rows.config';
import { SUB_SUB_TABLE_CONFIG } from './table_config/expanded_rows2.config';
import { getColumnConfig } from './table_config/column.config';
import { getInitialTableConfig } from './table_config/table.config';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FilterGroup } from './utils/filter-group.interface';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';

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
    ToastModule,
    InputTextModule,
    FloatLabel
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [MessageService],
})
export class App {
  protected readonly title = signal('DahabTable');

  products: Product[] = generateProducts(20);
  data = signal(this.products);

  // components passed to the table and column configuration
  @ViewChild('dahabTable') table!: Table;
  @ViewChild('customColumnDesign', { static: true }) customColumnDesign?: TemplateRef<any>;
  @ViewChild('customActionColumn', { static: true }) customActionColumn?: TemplateRef<any>;
  @ViewChild('rowExpanssionTemp', { static: true }) rowExpanssionTemp?: TemplateRef<any>;
  @ViewChild('subRowExpanssionTemp', { static: true }) subRowExpanssionTemp?: TemplateRef<any>;

  @ViewChild('captionTemplate', { static: false }) captionTemplate?: TemplateRef<any>;
  @ViewChild('headerTemplate', { static: false }) headerTemplate?: TemplateRef<any>;
  @ViewChild('bodyTemplate', { static: false }) bodyTemplate?: TemplateRef<any>;
  @ViewChild('footerTemplate', { static: false }) footerTemplate?: TemplateRef<any>;
  @ViewChild('captionActionTemplate', { static: false }) captionActionTemplate?: TemplateRef<any>;

  @ViewChild('filterTemplate', { static: false }) filterTemplate?: TemplateRef<any>;


  // column, table, subtable configuration intialization
  cols: ColumnConfig[] = [];
  tableConfig = signal<TableConfig>({ columns: this.cols });
  subTableConfig: TableConfig = { columns: [] };
  subSubTableConfig: TableConfig = { columns: [] };
  // selected rows
  selectedRows = signal<any[] | any>(undefined);


  globalFilterId = signal('')
  globalFilterCode = signal('')
  globalFilterConfig = signal<FilterGroup[]>(
   [{ field: 'id', header: 'ID', value:this.globalFilterId, filterMethod: 'contains' },
    { field: 'code', header: 'Code', value:  this.globalFilterCode, filterMethod: 'contains' }
    ]
  )

  ngAfterViewInit(): void {
    // after rendering, templates are defiened and added to the configs
    this.products[0].name =
      'very long text very long text very long text very long text very long text very long text very long text very long text';
    this.cols = getColumnConfig(
      this.customColumnDesign,
      this.customActionColumn,
      this.messageService
    );

    this.subTableConfig = getSubTableConfig(this.subRowExpanssionTemp);

    this.subSubTableConfig = SUB_SUB_TABLE_CONFIG;


    this.tableConfig.set(
      getInitialTableConfig(
        this.cols,
        this.simulateAPI,
        this.captionActionTemplate && undefined,
        this.rowExpanssionTemp,
        this.filterTemplate,
        this.logValue,
        this.logValue,
        this.logValue,
        this.logValue,
        this.logValue,
        this.logValue,
        this.logValue
      )
    );
  }

  constructor(private messageService: MessageService) {
    setTimeout(() => {
      this.tableConfig.update((u) => ({ ...u, isLoading: false }));
    }, 1000);
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

  logValue(value: any) {
    console.log(value);
  }
  logSelected() {
    console.log(this.selectedRows());
  }
}
