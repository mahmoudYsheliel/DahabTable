import { Component,ContentChild,Input,TemplateRef } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-caption',
  imports: [InputTextModule],
  templateUrl: './caption.html',
  styleUrl: './caption.css',
})
export class Caption {
  @Input() dt:any
}
