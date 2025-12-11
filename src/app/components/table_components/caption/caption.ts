import {
  Component,
  computed,
  ContentChild,
  input,
  Input,
  signal,
  TemplateRef,
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Table } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { PopoverModule } from 'primeng/popover';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-caption',
  imports: [InputTextModule, ButtonModule, ChipModule, PopoverModule, FloatLabel, FormsModule],
  templateUrl: './caption.html',
  styleUrl: './caption.css',
})
export class Caption {
  table = input.required<Table>();
  searchValue: string | undefined;

  fields = ['code', 'name', 'id'];

  fieldsVar = computed(() => {
    return this.fields.map((f) => {
      return { label: f, var: signal<any>('') };
    });
  });

  appliedFilters = computed(() => {
    return this.fields.map((f) => {
      return { label: f, var: signal<any>('') };
    });
  });

  clear() {
    this.table().clear();
    this.searchValue = '';
    for (let field of this.fieldsVar()) {
      field.var.set('');
    }
    for (let field of this.appliedFilters()) {
      field.var.set('');
    }
  }

  search() {
    for (let field of this.fieldsVar()) {
      this.table().filter(field.var(), field.label, 'contains');
    }
    for (let field of this.appliedFilters()) {
      field.var.set(
        this.fieldsVar()
          .find((f) => f.label == field.label)
          ?.var()
      );
    }
  }

  clearField(field: string) {
    this.fieldsVar()
      .find((f) => f.label == field)
      ?.var.set('');
    this.appliedFilters()
      .find((f) => f.label == field)
      ?.var.set('');
      this.search()
  }
}
