import {
  Directive,
  Input,
  ElementRef,
  HostListener,
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[checkValidity]',
})
export class CheckValidityDirective {
  @Input() elementControl: FormControl;

  constructor(private elementRef: ElementRef) {}

  @HostListener('change', ['$event']) onChange() {
    if (
      this.elementControl.invalid &&
      (this.elementControl.touched || this.elementControl.dirty)
    ) {
      this.elementRef.nativeElement.classList.add('in-valid');
    } else {
      if (this.elementRef.nativeElement.classList.contains('in-valid')) {
        this.elementRef.nativeElement.classList.remove('in-valid');
      }
    }
  }
}
