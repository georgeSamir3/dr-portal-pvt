import { Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.list.currentValue?.some(l => l.download)){
      this.isDownloadable = true;
    }
    if(changes.list.currentValue?.some(l => l.upload)){
      this.isUploadable = true;
    }
  }

  ngOnInit(): void {
  }

  @Input() list:any[];
  @Input() headers: string[];
  @Input() isResponsive: boolean = true;
  @Input() isDownloadable: boolean = false;
  @Input() isUploadable: boolean = false;
  @Input() routeTo:string[];
  @Output() rowSelected:EventEmitter<any> = new EventEmitter();
  @Output() downloadClicked:EventEmitter<any> = new EventEmitter();
  @Output() viewFilesClicked:EventEmitter<any> = new EventEmitter();

  compare = (v1: string | number, v2: string | number) =>
    v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

  rowClicked(rowData:any)
  {
    this.rowSelected.emit(rowData);
  }

  ondownloadClicked(event, rowData:any)
  {
    this.downloadClicked.emit({event, rowData});
  }

  onviewFilesClicked(event, rowData:any)
  {
    this.viewFilesClicked.emit({event, rowData});
  }

  isArray(item:any){
    return Array.isArray(item);
  }
}
