import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionPageComponent } from './session-page.component';
import { provideRouter } from '@angular/router';

describe('SessionPageComponent', () => {
  let component: SessionPageComponent;
  let fixture: ComponentFixture<SessionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a link to the new exercise page', () => {
    const link = fixture.nativeElement.querySelector('fit-link');
    expect(link).toBeTruthy();
    expect(link.getAttribute('link')).toBe('new');
  });
});
