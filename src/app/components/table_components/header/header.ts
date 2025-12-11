// app-header.component.ts
import { Component, input, TemplateRef, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [TableModule],
})
export class Header {
  table = input.required<Table>();
  selectionMethod = input< 'checkbox' | 'radiobutton' >()
  expandable = input<boolean>()
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

}
