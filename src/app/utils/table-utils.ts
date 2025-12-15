export class TableUtils {
  /**
   * Group data by a specific field
   */
  static groupDataByField(data: any[], field: string): any[] {
    const groups = new Map<any, any[]>();
    
    data.forEach(item => {
      const key = item[field];
      const groupKey = key !== null && key !== undefined ? key : '(Empty)';
      
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(item);
    });

    const sortedGroups = Array.from(groups.entries()).sort((a, b) => {
      const keyA = String(a[0]).toLowerCase();
      const keyB = String(b[0]).toLowerCase();
      return keyA.localeCompare(keyB);
    });

    return sortedGroups.map(([key, items]) => ({
      groupKey: key,
      groupField: field,
      items: items,
      count: items.length,
    }));
  }

  /**
   * Calculate total column count including expansion/selection columns
   */
  static getTotalColumnCount(
    columnsCount: number,
    hasExpansion: boolean,
    hasSelection: boolean
  ): number {
    let count = columnsCount;
    
    if (hasExpansion) count++;
    if (hasSelection) count++;
    
    return count;
  }

  /**
   * Get header name for a field from columns config
   */
  static getFieldHeader(field: string, columns: any[]): string {
    const column = columns.find(col => col.field === field);
    return column?.header || field;
  }

  /**
   * Safe function call handler
   */
  static callIfDefined(func: Function | undefined, input: any): any {
    return func ? func(input) : undefined;
  }

  // ✅ NEW: Selection utilities

  /**
   * Add items to selection if not already selected
   */
  static addToSelection(
    currentSelection: any[],
    itemsToAdd: any[],
    dataKey: string = 'id'
  ): any[] {
    const newSelection = [...currentSelection];
    
    itemsToAdd.forEach(item => {
      const exists = newSelection.some(sel => sel[dataKey] === item[dataKey]);
      if (!exists) {
        newSelection.push(item);
      }
    });
    
    return newSelection;
  }

  /**
   * Remove items from selection
   */
  static removeFromSelection(
    currentSelection: any[],
    itemsToRemove: any[],
    dataKey: string = 'id'
  ): any[] {
    const itemIds = itemsToRemove.map(item => item[dataKey]);
    return currentSelection.filter(sel => !itemIds.includes(sel[dataKey]));
  }

  /**
   * Check if all items are selected
   */
  static areAllSelected(
    items: any[],
    selectedItems: any[],
    dataKey: string = 'id'
  ): boolean {
    if (!items || items.length === 0) return false;
    
    return items.every(item =>
      selectedItems.some(sel => sel[dataKey] === item[dataKey])
    );
  }

  // ✅ NEW: Edit utilities

  /**
   * Generate edit key for tracking edits
   */
  static generateEditKey(data: any, field: string, dataKey: string = 'id'): string {
    return `${data[dataKey]}-${field}`;
  }

  /**
   * Find column by field name
   */
  static findColumn(columns: any[], field: string): any | undefined {
    return columns.find(col => col.field === field);
  }
}
