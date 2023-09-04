import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input() placeholder: string;
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  searchString: string;
  searchedValue: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  onSearch(){
    if(this.searchString.trim() != this.searchedValue.trim()){
      this.searchedValue = this.searchString.trim();
      this.search.emit(this.searchedValue);
    }
  }

  onKeyup(event){
    if(!this.searchString.trim() && (this.searchedValue.trim() != this.searchString.trim())){
      this.onSearch();
    }
  }
}
