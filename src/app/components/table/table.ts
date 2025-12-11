import {
  Component,
  TemplateRef,
  ContentChild,
  effect,
  computed,
  signal,
  input,
  model,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { TableModule, Table } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectModule } from 'primeng/select';
import { TableConfig } from '../../utils/table.interface';
import { NgTemplateOutlet, NgStyle, NgClass } from '@angular/common';
import { Caption } from '../table_components/caption/caption';
import { Footer } from '../table_components/footer/footer';
import { Header } from '../table_components/header/header';
import { Body } from '../table_components/body/body';
import { getTableConfig } from '../../utils/table.interface';
import { BadgeModule } from 'primeng/badge';
import { MessageService } from 'primeng/api';
import { ColumnConfig } from '../../utils/column.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  // selector: 'table-checkbox-selection-demo',

  imports: [
    TableModule,
    TooltipModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    SelectModule,
    NgTemplateOutlet,
    Caption,
    Header,
    Body,
    BadgeModule,
    FormsModule,
    Footer,
  ],
  templateUrl: './table.html',
  styleUrl: './table.css',
  host: { class: 'ignore-wrapper' },
  providers: [MessageService],
})
export class DahabTable {
  @ViewChild('dt') table!: Table;

  tableConfig = input<TableConfig>();
  data = model<any[]>([]);
  generatedTC = computed(() => ({ ...getTableConfig(this.tableConfig()) }));

  selectedProducts = model<any[]>([]);
  expandedRows = model<Record<string, boolean>>({});

  constructor(private messageService: MessageService) {}

  private editingValues = new Map<string, any>();
  onEditInit(event: any) {
    const { data, field } = event;
    const key = `${data[this.generatedTC().dataKey || 'id']}-${field}`;
    this.editingValues.set(key, data[field]);
  }

  onEditComplete(event: any) {
    const { data, field } = event;
    const col = this.generatedTC().columns?.find((c) => c.field === field);

    if (!col) return;

    const key = `${data[this.generatedTC().dataKey || 'id']}-${field}`;
    const oldValue = this.editingValues.get(key);
    const newValue = data[field];

    // Skip if no change
    if (oldValue === newValue) {
      this.editingValues.delete(key);
      return;
    }

    let result = { success: true, message: '' };

    // ✅ Call custom method and get result
    if (col.columnEditMethod) {
      const methodResult = col.columnEditMethod({ data, field, newValue, oldValue });

      // If method returns an object, use it
      if (methodResult && typeof methodResult === 'object') {
        result = methodResult;
      }
    }

    // ✅ If validation failed, revert the value
    if (!result.success) {
      data[field] = oldValue; // Revert to old value

      this.messageService.add({
        severity: 'error',
        summary: 'Update Failed',
        detail: result.message || `${col.header || field} change was rejected`,
        life: 3000,
      });

      this.editingValues.delete(key);
      return;
    }

    // ✅ If validation passed, show success message

    this.messageService.add({
      severity: 'success',
      summary: 'Cell Updated',
      detail:
        result.message || `${col.header || field} changed from "${oldValue}" to "${newValue}"`,
      life: 3000,
    });

    this.editingValues.delete(key);
  }

  undefiendHandler(func: Function | undefined, input: any) {
    if (func != undefined) {
      return func(input);
    }
    return undefined;
  }
}
