import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'fit-datepicker',
  standalone: true,
  imports: [DatePickerModule, FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './datepicker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DatepickerComponent,
      multi: true,
    },
  ],
})
export class DatepickerComponent implements ControlValueAccessor {
  label = input('');
  errorMessage = input('');
  showError = input(false);
  styleClass = input('');

  value = signal('');
  disabled = signal(false);
  dateFormat = signal('');
  // dateFormat has only yy for year, if we set it to yyyy then the year will be displayed twice
  // on the selection, but we want the placeholder to be yyyy
  placeholder = computed(() => this.dateFormat().replace('yy', 'yyyy'));

  inputId = signal('');

  constructor() {
    this.dateFormat.set(this.getDateFormat());
    this.inputId.set(crypto.randomUUID());
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onDateChange(value: string): void {
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
  }

  private getDateFormat(): string {
    const formats: Record<string, string> = {
      'en-US': 'mm/dd/yy',
      'de-DE': 'dd.mm.yy',
      'ja-JP': 'yy/mm/dd',
      'zh-CN': 'yy/mm/dd',
      'ko-KR': 'yy/mm/dd',
      'pt-BR': 'dd/mm/yy',
      'ru-RU': 'dd.mm.yy',
      'nl-NL': 'dd-mm-yy',
      'tr-TR': 'dd.mm.yy',
    };

    return formats[navigator.language] || 'dd/mm/yy';
  }
}
