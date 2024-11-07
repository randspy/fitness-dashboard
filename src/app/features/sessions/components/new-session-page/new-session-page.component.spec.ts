import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSessionPageComponent } from './new-session-page.component';

describe('NewSessionPageComponent', () => {
  let component: NewSessionPageComponent;
  let fixture: ComponentFixture<NewSessionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSessionPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewSessionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
