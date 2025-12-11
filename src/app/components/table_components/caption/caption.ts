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
import { NgTemplateOutlet } from '@angular/common';
@Component({
  selector: 'app-caption',
  imports: [
    NgTemplateOutlet,
    InputTextModule,
    ButtonModule,
    ChipModule,
    PopoverModule,
    FloatLabel,
    FormsModule,
  ],
  templateUrl: './caption.html',
  styleUrl: './caption.css',
})
export class Caption {
  table = input.required<Table>();

  actionTemplate = input<TemplateRef<any>>();
  title = input<string>();
  showFilter = input<boolean>();
  showFilterChips = input<boolean>();
  showInputSearch = input<boolean>();
  globalFilterFields = input<string[]>();

  searchValue: string | undefined;

  fieldsVar = computed(() => {
    if (this.globalFilterFields()) {
      return this.globalFilterFields()?.map((f) => {
        return { label: f, var: signal<any>('') };
      });
    }
    return;
  });

  appliedFilters = computed(() => {
    if (this.globalFilterFields()) {
      return this.globalFilterFields()?.map((f) => {
        return { label: f, var: signal<any>('') };
      });
    }
    return;
  });

  clear() {
    this.table().clear();
    this.searchValue = '';
    if (this.fieldsVar()) {
      for (let field of this.fieldsVar()!) {
        field.var.set('');
      }
    }
    if (this.appliedFilters()) {
      for (let field of this.appliedFilters()!) {
        field.var.set('');
      }
    }
  }

  search() {
    if (this.fieldsVar()) {
      for (let field of this.fieldsVar()!) {
        this.table().filter(field.var(), field.label, 'contains');
      }
    }
    if (this.appliedFilters() && this.fieldsVar()) {
      for (let field of this.appliedFilters()!) {
        field.var.set(
          this.fieldsVar()!
            .find((f) => f.label == field.label)
            ?.var()
        );
      }
    }
  }

  clearField(field: string) {
    if (this.fieldsVar()) {
      this.fieldsVar()!
        .find((f) => f.label == field)
        ?.var.set('');
    }

    if (this.appliedFilters()) {
      this.appliedFilters()!
        .find((f) => f.label == field)
        ?.var.set('');
      this.search();
    }
  }
}
