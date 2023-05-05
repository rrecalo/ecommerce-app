import { Component, OnInit } from '@angular/core';
import { Cart } from './models/Cart.model';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit{
  cart: Cart = { items: []};

  constructor(private cartService : CartService){}

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart) =>{
      this.cart = _cart;
      if(this.cart.items.length > 0)
      localStorage.setItem('cart', JSON.stringify(this.cart));
    });
    if(this.cart.items.length === 0){
      this.cartService.reloadCart(localStorage.getItem('cart'));
      }

  }

  onbeforeunload = (event : any) => {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  };
}
