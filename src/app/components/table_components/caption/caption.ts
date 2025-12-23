import {
  Component,
  computed,
  ContentChild,
  input,
  Input,
  signal,
  TemplateRef,
  output,
  model,
  Signal,
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Table } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { PopoverModule } from 'primeng/popover';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { ColumnConfig } from '../../../utils/column.interface';
import { TooltipModule } from 'primeng/tooltip';
import * as XLSX from 'xlsx';
import { TableConfig } from '../../../utils/table.interface';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FilterGroup } from '../../../utils/filter-group.interface';
@Component({
  selector: 'app-caption',
  imports: [
    InputIconModule,
    IconFieldModule,
    NgTemplateOutlet,
    InputTextModule,
    ButtonModule,
    ChipModule,
    PopoverModule,
    FormsModule,
    SelectModule,
    TooltipModule,
  ],
  templateUrl: './caption.html',
  styleUrl: './caption.css',
})
export class Caption {
  table = input.required<Table>();
  filterTemplate = input<TemplateRef<any>>();
  globalFilterConfig = model<FilterGroup[] | undefined | null>()

  rerender = model()

  tableConfig = model<TableConfig>()
  data = model<any[]>()
  importable = model<boolean>()
  actionTemplate = input<TemplateRef<any>>();
  title = input<string>();
  showFilter = input<boolean>();
  showFilterChips = input<boolean>();
  showInputSearch = input<boolean>();
  globalFilterFields = input<string[]>();

  exportButtons = input<{ csv?: boolean; excel?: boolean; pdf?: boolean }>();
  exportFilename = input<string>('export');
  exportData = input<any[]>([]);

  // ✅ Grouping configuration
  groupingEnabled = input<boolean>(false);
  columns = input<ColumnConfig[]>([]);
  groupableColumns = input<string[]>([]); // ✅ NEW: Specific columns allowed for grouping

  // ✅ Add these outputs
  onExpandAll = output<void>();
  onCollapseAll = output<void>();

  // ✅ Internal grouping state
  selectedGroupField = signal<string | null>(null);

  // ✅ Available fields for grouping (computed from columns and config)
  availableGroupFields = computed(() => {
    const groupable = this.groupableColumns();

    // If specific groupable columns are provided, filter by those
    if (groupable && groupable.length > 0) {
      return this.columns()
        .filter(col => col.field && groupable.includes(col.field))
        .map(col => ({
          field: col.field!,
          header: col.header || col.field!
        }));
    }

    // Otherwise, use all sortable columns (default behavior)
    return this.columns()
      .filter(col => col.field && col.sortable !== false)
      .map(col => ({
        field: col.field!,
        header: col.header || col.field!
      }));
  });

  // ✅ Get selected group header name
  selectedGroupHeader = computed(() => {
    if (!this.selectedGroupField()) return '';
    const field = this.availableGroupFields().find(
      f => f.field === this.selectedGroupField()
    );
    return field?.header || '';
  });

  // ✅ Output event for group field change
  onGroupFieldChange = output<string | null>();




  clear() {
    this.table()?.clear();
    if (!this.globalFilterConfig()) return
    this.globalFilterConfig()?.forEach(gf => gf.value.set(''))
  }

  search() {
    if (this.globalFilterConfig()) {
      this.globalFilterConfig()?.forEach(gf => this.table()?.filter(gf.value(), gf.field, gf.filterMethod))

    }
  }

  clearField(gf: FilterGroup) {
    gf.value.set('')
     this.table()?.filter(gf.value(), gf.field, gf.filterMethod)

  }

  // ✅ Handle group field selection
  onGroupChange(field: string | null) {
    this.selectedGroupField.set(field);
    this.onGroupFieldChange.emit(field);
  }

  // Export to CSV
  exportCSV() {
    this.table()?.exportCSV();
  }

  // Export to Excel
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.exportData());
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, this.exportFilename());
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE,
        });
        module.default.saveAs(
          data,
          fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  }

  // Export to PDF
  exportPDF() {
    Promise.all([
      import('jspdf'),
      import('jspdf-autotable')
    ]).then(([jsPDFModule, autoTableModule]) => {
      try {
        const jsPDF = jsPDFModule.default;
        const autoTable = autoTableModule.default;

        const doc = new jsPDF();

        const columns = this.table()?.columns?.map((col: any) => col.header) || [];
        const rows = this.exportData().map((item: any) =>
          (this.table()?.columns || []).map((col: any) => item[col.field])
        );

        autoTable(doc, {
          head: [columns],
          body: rows,
          startY: 20,
          theme: 'grid',
          styles: {
            fontSize: 10,
            cellPadding: 5,
          },
          headStyles: {
            fillColor: [33, 128, 141],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
          }
        });

        doc.save(this.exportFilename() + '.pdf');
      } catch (error) {
        console.error('PDF export error:', error);
      }
    }).catch(error => {
      console.error('Failed to load PDF libraries:', error);
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;

      // Read workbook
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // First sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const data: Object[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: '',      // keep empty cells
        raw: true        // keep numbers as numbers
      });
      const keys = Object.keys(data[0])

      const colConfig: ColumnConfig[] = keys.map(e => { return { field: e, header: e.toUpperCase() } })
      this.tableConfig.set({ columns: colConfig })
      this.data.set(data)
    };

    reader.readAsArrayBuffer(file);

  }


  searchInput(event: any) {

    this.table().filterGlobal(event.target.value, 'contains');
    setTimeout(() => { this.rerender.set(true) }, 500)
  }

}
