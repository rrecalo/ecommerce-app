import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-products-header',
  templateUrl: './products-header.component.html',
})
export class ProductsHeaderComponent {
  sort = 'desc';
  itemShowCount = 10;
  columnCount = 3;
  @Output() itemCountChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<string>();
  @Output() columnsCountChange = new EventEmitter<number>();


  onSortUpdated(newSort : string) : void {
    this.sort = newSort;
    this.sortChange.emit(newSort);
  }

  onShowCountUpdated(newCount : number) : void {
    this.itemShowCount = newCount;
    this.itemCountChange.emit(newCount);
  }

  onColumnsUpdated(colsNum : number) : void {
    this.columnCount = colsNum;
    this.columnsCountChange.emit(colsNum);
  }

}
