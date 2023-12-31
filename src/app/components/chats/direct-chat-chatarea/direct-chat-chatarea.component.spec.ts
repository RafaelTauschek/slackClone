import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectChatChatareaComponent } from './direct-chat-chatarea.component';

describe('DirectChatChatareaComponent', () => {
  let component: DirectChatChatareaComponent;
  let fixture: ComponentFixture<DirectChatChatareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectChatChatareaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectChatChatareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
