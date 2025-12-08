import { Component,ContentChild,input,Input,TemplateRef } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-caption',
  imports: [InputTextModule, ButtonModule],
  templateUrl: './caption.html',
  styleUrl: './caption.css',
})
export class Caption {
  @Input() dt:any
  clearFilter = input<boolean | undefined>();
  searchValue: string | undefined;
clear(table: Table) {
        table.clear();
        this.searchValue = ''
    }
}
