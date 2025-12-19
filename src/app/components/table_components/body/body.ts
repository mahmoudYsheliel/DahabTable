import { Component, input, TemplateRef, ViewChild, computed, output } from '@angular/core';
import { ColumnConfig } from '../../../utils/column.interface';
import { NgStyle, NgClass, NgTemplateOutlet } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { Tooltip } from "primeng/tooltip";
import { cellErrorMap } from '../../../table_config/column.config';
import { GroupRow } from '../group-row/group-row.component';
import { TableUtils } from '../../../utils/table-utils';
import { Checkbox } from "primeng/checkbox";

@Component({
  selector: 'app-body',
  imports: [
    NgStyle,
    NgClass,
    ButtonModule,
    TableModule,
    FormsModule,
    NgTemplateOutlet,
    InputTextModule,
    Tooltip,
    GroupRow,
],
  templateUrl: './body.html',
  styleUrl: './body.css',
  providers: [MessageService]
})
export class Body {
  table = input<Table>()
  rowClass = input<Function>();
  rowStyle = input<Function>();
  expandable = input<boolean>();
  columns = input<ColumnConfig[]>();
  selectionMethod = input<'checkbox' | 'radiobutton'>();
  freezeExpansion = input<boolean>();
  freezeSelection = input<boolean>();

  // Group mode support
  isGroupMode = input<boolean>(false);
  groupedData = input<any[]>([]);
  groupHeaderTemplate = input<TemplateRef<any> | undefined>(undefined);
  expandedRowTemplate = input<TemplateRef<any> | undefined>(undefined);
  expandedRows = input<Record<string, boolean>>({});
  dataKey = input<string>('id');
  selectedProducts = input<any[]>([]); // ✅ NEW

  // ✅ NEW: Output events for group selection
  onGroupSelect = output<any[]>();
  onGroupUnselect = output<any[]>();
  onGroupRowCreated = output<GroupRow>();

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  cellErrors = cellErrorMap;

  totalColumnCount = computed(() => {
    return TableUtils.getTotalColumnCount(
      this.columns()?.length || 0,
      !!this.expandable(),
      !!this.selectionMethod()
    );
  });

  getClass(item: any): string | undefined {
    return TableUtils.callIfDefined(this.rowClass(), item);
  }

  getStyle(item: any): object | undefined {
    return TableUtils.callIfDefined(this.rowStyle(), item);
  }

  getTooltip(item: any, col: ColumnConfig): string {
    const cellError = this.cellErrors[item.id]?.[col.field || ''];
    const customTooltip = TableUtils.callIfDefined(col.tooltip, item);
    return cellError || customTooltip || '';
  }

  registerGroupRow(groupRow: GroupRow) {
    this.onGroupRowCreated.emit(groupRow);
    return ''; // Return empty string so it doesn't show in UI
  }

  // ✅ NEW: Handle group selection
  handleGroupSelect(items: any[]) {
    this.onGroupSelect.emit(items);
  }

  handleGroupUnselect(items: any[]) {
    this.onGroupUnselect.emit(items);
  }

  onEnter(event: KeyboardEvent) {

    const element = event.target as HTMLElement
    const isEnter = event.code == 'Enter'
    const isShift = event.shiftKey

    const currentTd = element.closest('td')
    if (!currentTd) return

    const allEditables = Array.from(document.querySelectorAll('td[data-editable="true"]'))
    const currentIndex = allEditables.indexOf(currentTd)



    if (currentIndex == -1) return
    let nextTd: Element | null = null

    if (isEnter && !isShift) {
      nextTd = allEditables[currentIndex + 1]
    }
    if (isEnter && isShift) {
      nextTd = allEditables[currentIndex - 1]

    }
    if (!nextTd) return;
    const nextInput = nextTd.querySelector('p-cellEditor')
    if (!nextInput) return;

     setTimeout(()=>{ nextTd.dispatchEvent(new MouseEvent('click',{bubbles:true}))},10)


  }
}
