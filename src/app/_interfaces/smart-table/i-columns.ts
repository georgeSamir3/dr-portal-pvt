import { PipeTransform, TemplateRef } from "@angular/core";

export interface ISmartTableColumn {
  prop: string,
  name: string,
  pipe?: PipeTransform,
  cellTemplate?: TemplateRef<any>,
  sortable?: boolean,
  width?: number,
  minWidth?: number
}
