import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePickerMonthChangeEvent } from 'primeng/datepicker';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('dates', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit month change event', () => {
    let emittedEvent: DatePickerMonthChangeEvent | undefined;

    component.monthChanged.subscribe((event) => {
      emittedEvent = event;
    });

    const monthChangeEvent: DatePickerMonthChangeEvent = {
      month: 11,
      year: 2024,
    };

    const datepicker = fixture.debugElement.query(By.css('p-datepicker'));
    datepicker.triggerEventHandler('onMonthChange', monthChangeEvent);

    expect(emittedEvent).toEqual(monthChangeEvent);
  });
});
