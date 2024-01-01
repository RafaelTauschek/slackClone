import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPofileDialogComponent } from './user-pofile-dialog.component';

describe('UserPofileDialogComponent', () => {
  let component: UserPofileDialogComponent;
  let fixture: ComponentFixture<UserPofileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPofileDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPofileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
