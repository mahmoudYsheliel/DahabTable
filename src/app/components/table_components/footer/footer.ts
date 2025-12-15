import { Component, input, TemplateRef, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { AggCell } from '../../../utils/table.interface';

@Component({
  selector: 'app-footer',
  imports: [TableModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  aggregation = input<AggCell[][]>();
  table = input.required<Table>();
  
  isGroupMode = input<boolean>(false);
  groupedData = input<any[]>([]);

  @ViewChild('footerTemplate', { static: true }) template!: TemplateRef<any>;

  /**
   * Get actual data (flatten groups if needed)
   */
  private getActualData(): any[] {
    // ✅ If in group mode, flatten the grouped data
    if (this.isGroupMode() && this.groupedData().length > 0) {
      const flattened = this.groupedData().flatMap(group => {
        // Each group has an 'items' array
        return group.items || [];
      });
      return flattened;
    }
    
    // ✅ Normal mode - use filtered or all data
    return this.table().filteredValue || this.table().value || [];
  }

  /**
   * Execute aggregation function with actual data
   */
  executeAggregation(func: any): any {
    // If func is not a function, return empty
    if (typeof func !== 'function') {
      return '';
    }

    try {
      // ✅ Get the actual flattened data
      const data = this.getActualData();
      
      console.log('Footer data for aggregation:', data); // Debug
      
      // Call the function with the data
      const result = func(data);
      
      console.log('Aggregation result:', result); // Debug
      
      // Return the result (could be string, number, etc.)
      return result !== undefined && result !== null ? result : '';
    } catch (error) {
      console.error('Error executing aggregation function:', error);
      return '';
    }
  }
}
