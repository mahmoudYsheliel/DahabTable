import { Component, input, TemplateRef, ViewChild, signal, output } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { NgTemplateOutlet } from '@angular/common'; // ✅ Already imported but not added to @Component imports
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-row',
  standalone: true,
  imports: [
    BadgeModule, 
    ButtonModule, 
    TableModule, 
    CheckboxModule, 
    FormsModule,
    NgTemplateOutlet // ✅ ADD THIS
  ],
  templateUrl: './group-row.html'
})
export class GroupRow {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  
  headerTemplate = input.required<TemplateRef<any>>();
  columnsInput = input.required<any[]>();
  selectedItems = input<any[]>([]);
  
  onGroupSelect = output<any[]>();
  onGroupUnselect = output<any[]>();
  
  isExpanded = signal<boolean>(false);
  groupSelected = false;
  
  toggleExpand() {
    this.isExpanded.set(!this.isExpanded());
  }
  
  onGroupSelectChange(event: any, items: any[]) {
    if (event.checked) {
      this.onGroupSelect.emit(items);
    } else {
      this.onGroupUnselect.emit(items);
    }
  }
  
  updateCheckboxState(items: any[]) {
    const selected = this.selectedItems();
    if (!items || items.length === 0) {
      this.groupSelected = false;
      return;
    }
    
    const allSelected = items.every(item => 
      selected.some(sel => sel.id === item.id)
    );
    
    this.groupSelected = allSelected;
  }
}
