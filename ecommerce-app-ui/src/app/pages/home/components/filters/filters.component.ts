import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';



interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

interface CategoryNode {
  name: string,
  children? : CategoryNode[],
}

let TREE_DATA: CategoryNode[] = [
  {
    name : 'Categories',
    children : [
      // {
      //   name: 'pants',
      //   children: [],
      // },
      // {
      //   name: 'shoes',
      //   children: [],
      // }
    ]
  }


];

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
})
export class FiltersComponent{

  private _transformer = (node: CategoryNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
  }

  @Output() showCategory = new EventEmitter<string>();
  category: string | undefined = "view all";

  @Input() categories: Array<string> | undefined;

  @ViewChild('tree') tree: any;

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnChanges(){
    let c = this.categories?.map((_category) => <CategoryNode>{name: _category, children: []});
    //c = c?.concat()
    c?.unshift({name: "view all", children: []});
    TREE_DATA[0].children = c;
    this.dataSource.data = TREE_DATA;
    this.tree.treeControl.expandAll();
  }

  ngAfterViewInit(){
  }

  onShowCategory(category: string) : void {
    if(category !== "Categories"){
      if(category === "view all"){
        this.category = category;
        this.showCategory.emit(undefined);
      }
      else{
      this.category = category;
      this.showCategory.emit(category);
      }
    }

  }




}
