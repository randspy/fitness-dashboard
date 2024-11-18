import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from './select.component';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

interface Suggestion {
  id: string;
  name: string;
}

@Component({
  template: `
    <form [formGroup]="form">
      <fit-select
        [formControl]="selectControl"
        [label]="label"
        [optionLabel]="optionLabel"
        [filterBy]="filterBy"
        [suggestions]="suggestions"
        [errorMessage]="errorMessage"
        [showError]="showError"
      ></fit-select>
    </form>
  `,
})
class TestComponent {
  selectControl = new FormControl('', Validators.required);
  form = new FormGroup({
    selectControl: this.selectControl,
  });
  label = '';
  optionLabel = 'name';
  filterBy = 'name';
  suggestions: Suggestion[] = [];
  errorMessage = '';
  showError = false;
}

describe('SelectComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent, FormsModule, ReactiveFormsModule],
      declarations: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set input id', () => {
    component.label = 'Test Label';
    fixture.detectChanges();

    expect(selectElement().id).toEqual('test-uuid');
    expect(labelElement().attributes['for'].value).toBe('test-uuid');
  });

  it('should render label when provided', () => {
    component.label = 'Test Label';
    fixture.detectChanges();

    expect(labelElement().textContent).toContain('Test Label');
  });

  it('should not render label when not provided', () => {
    component.label = '';
    fixture.detectChanges();

    expect(labelQuery()).toBeNull();
  });

  it('should show already set value', async () => {
    console.log('start');
    const item = { id: '1', name: 'Test Item' };
    component.suggestions = [item];
    fixture.detectChanges();

    component.selectControl.setValue(item.id);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(selectQuery().componentInstance.value).toBe(item);
  });

  it('should not show a value not in suggestions', async () => {
    component.suggestions = [];
    fixture.detectChanges();

    component.selectControl.setValue('1');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(selectQuery().componentInstance.value).toBeUndefined();
  });

  it('should show error message when showError is true', () => {
    component.showError = true;
    component.errorMessage = 'Error occurred';
    fixture.detectChanges();

    expect(errorElement().textContent).toContain('Error occurred');
  });

  it('should not show error message when showError is false', () => {
    component.showError = false;
    component.errorMessage = 'Error occurred';
    fixture.detectChanges();

    expect(errorQuery()).toBeNull();
  });

  it('should apply error styling to input', () => {
    component.showError = true;
    fixture.detectChanges();

    expect(selectElement().classList.contains('ng-invalid')).toBe(true);
    expect(selectElement().classList.contains('ng-touched')).toBe(true);
    expect(selectElement().classList.contains('ng-dirty')).toBe(true);
  });

  it('should not apply error styling to input when showError is false', () => {
    component.showError = false;
    fixture.detectChanges();

    expect(selectElement().classList.contains('ng-invalid')).toBe(false);
    expect(selectElement().classList.contains('ng-touched')).toBe(false);
    expect(selectElement().classList.contains('ng-dirty')).toBe(false);
  });

  it('should select item from dropdown', async () => {
    const item = { id: '1', name: 'Test Item' };
    component.suggestions = [item];
    fixture.detectChanges();

    changeItem(item);
    fixture.detectChanges();

    expect(component.selectControl.value).toEqual(component.suggestions[0].id);
  });

  it('should validate the form control', () => {
    const item = { id: '1', name: 'Test Item' };
    component.suggestions = [item];
    fixture.detectChanges();

    changeItem(item);
    fixture.detectChanges();

    expect(component.form.valid).toBeTruthy();
  });

  it('should not validate the form control', () => {
    changeItem(null);
    fixture.detectChanges();

    expect(component.form.valid).toBeFalsy();
  });

  const selectQuery = () => {
    return fixture.debugElement.query(By.css('p-select'));
  };

  const selectElement = () => {
    return fixture.debugElement.query(By.css('p-select')).nativeElement;
  };

  const labelQuery = () => {
    return fixture.debugElement.query(By.css('label'));
  };

  const labelElement = () => {
    return labelQuery().nativeElement;
  };

  const errorQuery = () => {
    return fixture.debugElement.query(By.css('p'));
  };

  const errorElement = () => {
    return errorQuery().nativeElement;
  };

  const changeItem = (item: Suggestion | null) => {
    const select = selectQuery();
    const selectInstance = select.componentInstance;
    selectInstance.writeValue(item);
    selectInstance.ngModel = item;
    select.triggerEventHandler('onChange');
  };
});
