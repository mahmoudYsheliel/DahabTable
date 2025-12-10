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
} from '@angular/core';
import { TableModule,Table } from 'primeng/table';
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
    NgStyle,
    NgClass,
    BadgeModule,
    Footer
  ],
  templateUrl: './table.html',
  styleUrl: './table.css',
  host: { class: 'ignore-wrapper' },
})
export class DahabTable {
  @ViewChild('dt') table!: Table;

  tableConfig = input<TableConfig>();
  data = model<any[]>([]);
  generatedTC = computed(() => ({ ...getTableConfig(this.tableConfig()) }));

  selectedProducts = model<any[]>([]);
  expandedRows = model<Record<string, boolean>>({});

  getClass(v: any) {
    return this.undefiendHandler(this.generatedTC().rowClass, v);
  }
  getStyle(v: any) {
    return this.undefiendHandler(this.generatedTC().rowStyle, v);
  }
  undefiendHandler(func: Function | undefined, input: any) {
    if (func != undefined) {
      return func(input);
    }
    return undefined;
  }
  
}
