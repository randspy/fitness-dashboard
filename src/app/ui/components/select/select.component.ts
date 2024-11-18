import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { SelectModule } from 'primeng/select';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'fit-select',
  standalone: true,
  imports: [SelectModule, FormsModule],
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent<T extends { id: string }>
  implements ControlValueAccessor
{
  label = input('');
  optionLabel = input<string>('');
  filterBy = input<string>('');
  suggestions = input<T[]>([]);
  errorMessage = input('');
  showError = input(false);
  inputId = signal(crypto.randomUUID());

  value = signal<T | undefined>({ id: 'rr' } as T);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(this.suggestions().find((s) => s.id === value));
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputChange(): void {
    this.onChange(this.value()?.id ?? '');
    this.onTouched();
  }
}
