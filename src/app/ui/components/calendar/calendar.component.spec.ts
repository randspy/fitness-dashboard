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
    fixture.componentRef.setInput('currentMonthDate', new Date());
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

  it('should update the datepicker when the current month date changes', () => {
    const currentMonthDate = new Date(2024, 10, 1);
    fixture.componentRef.setInput('currentMonthDate', currentMonthDate);
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.innerHTML).toContain('2024');
    expect(fixture.debugElement.nativeElement.innerHTML).toContain('November');
  });

  it('should update the datepicker when dates change', () => {
    const dates = [new Date(2024, 10, 19), new Date(2024, 10, 26)];
    fixture.componentRef.setInput('dates', dates);
    fixture.componentRef.setInput('currentMonthDate', new Date(2024, 10, 1));
    fixture.detectChanges();

    const dateOneSelector = fixture.debugElement.nativeElement.querySelectorAll(
      '.p-datepicker-day-selected',
    );

    expect(dateOneSelector.length).toBe(2);
  });
});
