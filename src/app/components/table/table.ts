import {
  Component,
  Input,
  TemplateRef,
  ContentChild,
  effect,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectModule } from 'primeng/select';
import { TableConfig } from '../../utils/table.interface';
import { NgTemplateOutlet, NgStyle, NgClass } from '@angular/common';
import { Caption } from '../table_components/caption/caption';
import { Footer } from '../table_components/footer/footer';
import { Header } from '../table_components/header/header';
import { Body } from '../table_components/body/body';
@Component({
  selector: 'app-table',
  imports: [
    TableModule,
    TooltipModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    SelectModule,
    NgTemplateOutlet,
    Caption,
    Footer,
    Header,
    Body,
    NgStyle,
    NgClass
],
  templateUrl: './table.html',
  styleUrl: './table.css',
  host: { class: 'ignore-wrapper' },
})
export class Table {
  @Input() tableConfig: TableConfig = {};

  @ContentChild('defaultHeader', { static: false }) defaultHeader?: TemplateRef<any>;

  // Important: Use @ContentChild to read projected templates
  @ContentChild('captionTemplate', { static: false }) captionTemplate?: TemplateRef<any>;
  @ContentChild('headerTemplate', { static: false }) headerTemplate!: TemplateRef<any>;
  @ContentChild('bodyTemplate', { static: false }) bodyTemplate?: TemplateRef<any>;
  @ContentChild('footerTemplate', { static: false }) footerTemplate?: TemplateRef<any>;

  constructor() {
    effect(() => {
      this.addAttributes();
    });
  }
  addAttributes() {
    this.tableConfig.value?.forEach((v) => {
      console.log(v.id);
      v._sytle = this.undefiendHandler(this.tableConfig.rowStyle, v);
      v._class = this.undefiendHandler(this.tableConfig.rowClass, v);
    });
    console.log(this.tableConfig?.columns)
 
  }
  undefiendHandler(func: Function | undefined, input: any) {
    if (func != undefined) {
      return func(input);
    }
    return undefined;
  }
}
