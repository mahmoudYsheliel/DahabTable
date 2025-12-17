import { Component, computed, signal, input, model, ViewChild, ViewChildren, QueryList } from '@angular/core';
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
import { GroupRow } from '../table_components/group-row/group-row.component';
import { TableUtils } from '../../utils/table-utils';
import { ChangeDetectorRef } from '@angular/core';


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
  groupRowComponents = signal<GroupRow[]>([]);

  // Table config and data
  tableConfig = model<TableConfig>();
  data = model<any[]>([]);

  // Selected and expanded rows
  selectedProducts = model<any[]>([]);
  expandedRows = model<Record<string, boolean>>({});

  // Table config with default values
  generatedTC = computed(() => ({ ...getTableConfig(this.tableConfig()) }));

  // Context menu properties
  selectedRowForContextMenu: any = null;
  contextMenuItems = signal<MenuItem[]>([]);

  // Grouping state
  currentGroupField = signal<string | null>(null);
  filteredData = signal<any[]>([]);
  
  // Computed grouped data from filtered data
  groupedData = computed(() => {
    const field = this.currentGroupField();
    if (!field) return [];
    
    const dataToGroup = this.filteredData().length > 0 
      ? this.filteredData() 
      : this.data();
    
    return TableUtils.groupDataByField(dataToGroup, field);
  });


  rerender = signal(true)


  // Map holding old values for edited cells
  private editingValues = new Map<string, any>();

  /**
   * Handle edit initialization - KEEP (uses component state)
   */
  onEditInit(event: any) {
    console.log(4)
    const { data, field } = event;
    const key = TableUtils.generateEditKey(data, field, this.generatedTC().dataKey || 'id');
    this.editingValues.set(key, data[field]);
  }

  /**
   * Handle edit completion - KEEP (uses component state + calls callbacks)
   */
  onEditComplete(event: any) {
    console.log(5)
    const { data, field } = event;
    console.log({event})
    console.log(this.generatedTC().columns)
    console.log(field)
    const col = TableUtils.findColumn(this.generatedTC().columns || [], field);
    console.log(col)
    if (!col) return;

    const key = TableUtils.generateEditKey(data, field, this.generatedTC().dataKey || 'id');
    const oldValue = this.editingValues.get(key);
    const newValue = data[field];

    console.log(oldValue , newValue , col.columnEditMethod)
    if (oldValue !== newValue && col.columnEditMethod) {
      col.columnEditMethod({ data, newValue, oldValue });
    }
    this.editingValues.delete(key);
    this.rerender.set(true)
  }

  /**
   * Update context menu - KEEP (uses component state + calls callbacks)
   */
  updateContextMenu() {
    if (!this.generatedTC().contextMenuItems || !this.selectedRowForContextMenu) {
      this.contextMenuItems.set([]);
      return;
    }

    const items = this.generatedTC().contextMenuItems!(this.selectedRowForContextMenu);
    this.contextMenuItems.set(items);
  }

  /**
   * Handle group field change - KEEP (manages component state)
   */
  onGroupFieldChange(field: string | null) {
    this.currentGroupField.set(field);
    
    if (!field) {
      this.filteredData.set([]);
    } else {
      const current = this.table?.filteredValue || this.data();
      this.filteredData.set(current);
    }
  }

  /**
   * Handle filter change - KEEP (manages component state + calls callbacks)
   */
  onFilterChange(event: any) {
    if (this.currentGroupField()) {
      this.filteredData.set(event.filteredValue || []);
    }
    
    if (this.generatedTC().onFilter) {
      this.generatedTC().onFilter!(event);
    }
  }

  /**
   * Handle sort change - KEEP (manages component state + calls callbacks)
   */
  onSortChange(event: any) {
    if (this.currentGroupField()) {
      const sortedData = this.table?.filteredValue || this.table?.value || [];
      this.filteredData.set([...sortedData]);
    }
    
    if (this.generatedTC().onSort) {
      this.generatedTC().onSort!(event);
    }
  }
  registerGroupRow(groupRow: GroupRow) {
  const current = this.groupRowComponents();
  if (!current.includes(groupRow)) {
    this.groupRowComponents.set([...current, groupRow]);
  }
}

/**
 * Expand all groups
 */
expandAllGroups() {
  const groups = this.groupRowComponents();
  if (groups.length === 0) {
    console.warn('No group rows registered yet');
    return;
  }
  groups.forEach(row => row.isExpanded.set(true));
}

/**
 * Collapse all groups
 */
collapseAllGroups() {
  const groups = this.groupRowComponents();
  if (groups.length === 0) {
    console.warn('No group rows registered yet');
    return;
  }
  groups.forEach(row => row.isExpanded.set(false));
}

  /**
   * Select items in a group - SIMPLIFIED (uses utility)
   */
  handleGroupSelect(items: any[]) {
    const newSelection = TableUtils.addToSelection(
      this.selectedProducts(),
      items,
      this.generatedTC().dataKey || 'id'
    );
    this.selectedProducts.set(newSelection);
  }

  /**
   * Unselect items in a group - SIMPLIFIED (uses utility)
   */
  handleGroupUnselect(items: any[]) {
    const newSelection = TableUtils.removeFromSelection(
      this.selectedProducts(),
      items,
      this.generatedTC().dataKey || 'id'
    );
    this.selectedProducts.set(newSelection);
  }

  /**
   * Safe function caller - SIMPLIFIED (uses utility)
   */
  undefiendHandler(func: Function | undefined, input: any) {
    return TableUtils.callIfDefined(func, input);
  }
}
