import { FormGroup, FormArray } from '@angular/forms';

export function markFormAsTouched(formGroup: FormGroup | FormArray) {
  Object.values(formGroup.controls).forEach((control) => {
    if (control instanceof FormGroup || control instanceof FormArray) {
      markFormAsTouched(control);
    } else {
      control.markAsTouched();
    }
  });
}
