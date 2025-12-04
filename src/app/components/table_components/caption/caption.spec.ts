import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Caption } from './caption';

describe('Caption', () => {
  let component: Caption;
  let fixture: ComponentFixture<Caption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Caption]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Caption);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
