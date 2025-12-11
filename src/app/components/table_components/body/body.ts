import { Component, input, Input, TemplateRef, ViewChild } from '@angular/core';
import { ColumnConfig } from '../../../utils/column.interface';
import { Table } from 'primeng/table';
import { NgStyle, NgClass,NgTemplateOutlet } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ChangeDetectorRef } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-body',
  imports: [NgStyle, NgClass, ButtonModule,TableModule,FormsModule,NgTemplateOutlet,InputTextModule],
  templateUrl: './body.html',
  styleUrl: './body.css',
  providers:[MessageService]
})
export class Body {
  rowClass = input<Function>();
  rowStyle = input<Function>();
  expandable = input<boolean>();
  columns= input<ColumnConfig[]>()
  selectionMethod = input<'checkbox' | 'radiobutton'>()
  freezeExpansion = input<boolean>()
  freezeSelection = input<boolean>()
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  constructor(private messageService: MessageService, private cdr: ChangeDetectorRef) {}

 
  getClass(v: any) {
    return this.undefiendHandler(this.rowClass, v);
  }
  getStyle(v: any) {
    return this.undefiendHandler(this.rowStyle, v);
  }
  undefiendHandler(func: Function | undefined, input: any) {
    if (func != undefined) {
      return func(input);
    }
    return undefined;
  }

  

}
