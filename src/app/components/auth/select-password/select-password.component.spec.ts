import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPasswordComponent } from './select-password.component';

describe('SelectPasswordComponent', () => {
  let component: SelectPasswordComponent;
  let fixture: ComponentFixture<SelectPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
