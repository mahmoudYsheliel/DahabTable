import { Component, computed, effect, input, model, signal, TemplateRef, ViewChild } from '@angular/core';
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
  table = input<Table>();
  rerender = model()

  isGroupMode = input<boolean>(false);
  groupedData = input<any[]>([]);

  @ViewChild('footerTemplate', { static: true }) template!: TemplateRef<any>;

  /**
   * Get actual data (flatten groups if needed)
   */

  aggResults = signal<Record<number, Record<number, any>>>({})
  constructor() {
    effect(() => {
      if (this.rerender()) {
        const results: Record<number, Record<number, any>> = {}
        if (!this.aggregation()!) return
        for (let rowIndex = 0; rowIndex < this.aggregation()!.length; rowIndex++) {
          const row = this.aggregation()![rowIndex]
          for (let cellIndex = 0; cellIndex < row.length; cellIndex++) {
            if (!results[rowIndex]) results[rowIndex] = {}

            results[rowIndex][cellIndex] = this.executeAggregation(row[cellIndex].func)
          }
        }
        this.aggResults.set(results)
        this.rerender.set(false)
      }

    })
  }
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
    return this.table()?.filteredValue || this.table()?.value || [];
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

      // console.log('Footer data for aggregation:', data); // Debug

      // Call the function with the data
      const result = func(data);

      // console.log('Aggregation result:', result); // Debug

      // Return the result (could be string, number, etc.)
      return result !== undefined && result !== null ? result : '';
    } catch (error) {
      console.error('Error executing aggregation function:', error);
      return '';
    }
  }
}
