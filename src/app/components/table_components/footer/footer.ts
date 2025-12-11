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
  table = input.required<Table>();
  aggregation = input<AggCell[][]>();

  @ViewChild('footerTemplate', { static: true }) template!: TemplateRef<any>;
}
