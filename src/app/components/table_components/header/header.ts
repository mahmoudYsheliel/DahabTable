// app-header.component.ts
import { Component, input } from '@angular/core';
import { ColumnConfig } from '../../../utils/column.interface';
import { TableModule } from "primeng/table";

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [TableModule]
})
export class Header {
   column= input.required<ColumnConfig>();

}
