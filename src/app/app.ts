import {
  Component,
  signal,
  ViewChild,
  effect,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Product } from './utils/product.interface';
import { generateProducts } from './utils/data_generator';
import { Table } from './components/table/table';
import { ColumnConfig } from './utils/column.interface';
import { TableConfig } from './utils/table.interface';
import { TemplateRef } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, Table, SelectModule, TagModule, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('DahabTable');
  products: Product[] = generateProducts(20);
  @ViewChild('quantityFilter', { static: true }) quantityFilter!: TemplateRef<any>;

  cols: ColumnConfig[] = [
    { field: 'id', header: 'ID' },
    { field: 'code', header: 'Code' },
    { field: 'name', header: 'Name', sortable: true },
    { field: 'price', header: 'Price', sortable: true, filterTemplate: this.quantityFilter },
  ];
  constructor() {
    effect(() => {
      const priceCol = this.cols.find((c) => c.field === 'price');
      if (priceCol) {
        priceCol.filterTemplate = this.quantityFilter; // now quantityFilter is defined
      }
    });
  }

  tableConfig: TableConfig = {
    columns: this.cols,
    value: this.products,
    size: 'small',
    showGridlines: true,
    stripedRows: true,
    rowStyle: this.rowStyle,
    rowClass: this.rowClass,
    paginator: true,
    rows: 5,
    rowsPerPageOptions: [5, 10, 20],
    globalFilterFields: ['id', 'code', 'name'],
  };

  rowClass(product: Product) {
    if (product.id === 4) return 'bg-primary text-primary-contrast';
    return '';
  }

  rowStyle(product: Product) {
    if (product.id === 6) {
      return { fontWeight: 'bold', fontStyle: 'italic' };
    }
    return {};
  }
}
