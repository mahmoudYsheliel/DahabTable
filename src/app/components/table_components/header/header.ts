import { Component, input, TemplateRef, ViewChild, computed } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ColumnConfig } from '../../../utils/column.interface';
import { TableUtils } from '../../../utils/table-utils';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [TableModule], // ✅ TableModule includes p-tableHeaderCheckbox
})
export class Header {
  selectionMethod = input<'checkbox' | 'radiobutton'>();
  expandable = input<boolean>();
  freezeSelection = input<boolean>();
  freezeExpansion = input<boolean>();
  
  // Group mode support
  isGroupMode = input<boolean>(false);
  groupField = input<string>('');
  columns = input<ColumnConfig[]>([]);
  
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  
  // Computed: Get group field header
  groupFieldHeader = computed(() => {
    const field = this.groupField();
    return field ? TableUtils.getFieldHeader(field, this.columns()) : '';
  });
  
  // Computed: Calculate total column count
  totalColumnCount = computed(() => {
    return TableUtils.getTotalColumnCount(
      this.columns().length,
      !!this.expandable(),
      !!this.selectionMethod()
    );
  });
}
