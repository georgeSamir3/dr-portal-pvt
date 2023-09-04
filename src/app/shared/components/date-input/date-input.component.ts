import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DateInputComponent),
    }
  ]
})
export class DateInputComponent implements OnInit {

  @Input() placeholder: string;
  @Input() id: string;
  disabled: boolean = false;

  private onTouchedCallback: () => {};
  private onChangeCallback: (_: any) => {};

  public value: Date;

  constructor() {
  }

  ngOnInit() {}

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public writeValue(obj: any): void {
    this.value = obj;
  }

  public onValueChange(value) {
    this.onChangeCallback(value);
  }

}
