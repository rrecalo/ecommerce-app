import { trigger, transition, style, animate, state } from '@angular/animations';
import { StoreService } from './../../services/store.service';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/Product.model';
import { CartService } from 'src/app/services/cart.service';

const ROWS_HEIGHT: {[id: number] : number } = {
  1: 400,
  3: 335,
  4: 350,
}




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]
      ),
      transition(':leave',
        [style({ opacity: 1 }), animate('300ms', style({ opacity: 0 }))]
      )
    ])
  ],
})

export class HomeComponent {

  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  category: string | undefined;
  products: Array<Product> | undefined;
  sort = 'desc';
  count = 10;
  productsSubscription: Subscription | undefined;
  categories: Array<string> | undefined;
  categorySubscription: Subscription | undefined;


  constructor(private cartService: CartService, private storeService : StoreService){}

  ngOnInit() : void {
    this.getProducts();
    this.getCategories();
  }

  getProducts() : void {
    if(this.category){
    this.storeService.getAllProducts(this.count, this.sort, this.category)
    .subscribe((_products) => this.products = _products);
    }
    else {
      this.storeService.getAllProducts(this.count, this.sort, undefined)
    .subscribe((_products) => this.products = _products);
    }
  }

  getCategories() : void {
    this.storeService.getAllCategories().subscribe((_categories) => this.categories = _categories);
  }

  ngOnDestroy() : void {
    if(this.productsSubscription){
      this.productsSubscription.unsubscribe();
    }
    if(this.categorySubscription){
      this.categorySubscription.unsubscribe();
    }
  }

  onColumnsCountChanged(colsNum : number) : void {
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[colsNum];
  }

  onItemCountChanged(itemsCount : number) : void {
      this.count = itemsCount;
      this.getProducts();
  }

  onSortChanged(_sort : string) : void {
    this.sort = _sort;
    this.getProducts();
  }

  // onCategoryFilterChanged(_filter : string) : void {
  //   this.category = _filter;
  // }

  onShowCategory(newCategory : string) : void {
    //console.log(newCategory);
    this.category = newCategory;
    this.getProducts();
  }

  onAddToCart(product: Product) : void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    });
  }

}
