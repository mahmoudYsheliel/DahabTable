import { Component, computed, signal, input, model, ViewChild } from '@angular/core';
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
import { NgTemplateOutlet } from '@angular/common';
import { Caption } from '../table_components/caption/caption';
import { Footer } from '../table_components/footer/footer';
import { Header } from '../table_components/header/header';
import { Body } from '../table_components/body/body';
import { getTableConfig } from '../../utils/table.interface';
import { BadgeModule } from 'primeng/badge';
import { FormsModule } from '@angular/forms';
import { ContextMenuModule, ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-table',
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
    ContextMenuModule,
  ],
  templateUrl: './table.html',
  styleUrl: './table.css',
  host: { class: 'ignore-wrapper' },
})
export class DahabTable {
  @ViewChild('dt') table!: Table;
  @ViewChild('cm') cm!: ContextMenu;

  // table config and data
  tableConfig = input<TableConfig>();
  data = model<any[]>([]);

  //selected and expanded rows
  selectedProducts = model<any[]>([]);
  expandedRows = model<Record<string, boolean>>({});

  // table config with default values to be used later
  generatedTC = computed(() => ({ ...getTableConfig(this.tableConfig()) }));

  // context menu properities
  selectedRowForContextMenu: any = null;
  contextMenuItems = signal<MenuItem[]>([]);

  // map holding old values for edited cells to undo edits
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

    if (oldValue !== newValue && col.columnEditMethod) {
       col.columnEditMethod({ data, newValue, oldValue });
    }

    this.editingValues.delete(key);
  }

  updateContextMenu() {
    if (!this.generatedTC().contextMenuItems || !this.selectedRowForContextMenu) {
      this.contextMenuItems.set([]);
      return;
    }

    const items = this.generatedTC().contextMenuItems!(this.selectedRowForContextMenu);
    this.contextMenuItems.set(items);
  }

  undefiendHandler(func: Function | undefined, input: any) {
    if (func != undefined) {
      return func(input);
    }
    return undefined;
  }
}
