import { Component, Input } from '@angular/core';
import { ColumnConfig } from '../../../utils/column.interface';

@Component({
  selector: 'app-body',
  imports: [],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class Body {
  @Input() column?:ColumnConfig
  @Input() data: any
}
