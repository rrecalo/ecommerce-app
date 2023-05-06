import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/Cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart = new BehaviorSubject<Cart>({items : []});

  constructor(private _snackBar: MatSnackBar) {}

  addToCart(item: CartItem) : void {
    const items = [...this.cart.value.items];

    const itemInCart = items.find((_item) => _item.id === item.id);

    if(itemInCart){
      itemInCart.quantity +=1;
    }
    else{
      items.push(item);
    }

    this.cart.next({items});
    this._snackBar.open('1 item added to cart.', 'Ok', { duration: 3000});
  }

  getTotal(items: Array<CartItem>) : number {
    return items.map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  clearCart() : void {
    localStorage.removeItem('cart');
    this.cart.next({ items: [] });
    this._snackBar.open('Your cart was cleared.', 'Ok', { duration: 3000});
  }

  checkoutCart() : void {
    localStorage.removeItem('cart');
    this.cart.next({ items: [] });
    this._snackBar.open('Checkout Successful!', 'Ok', { duration: 3000});
  }

  removeFromCart(item : CartItem, update = true) : Array<CartItem> {
    const filteredItems = this.cart.value.items.filter((_item) => _item.id !== item.id);
    if(update){
    this.cart.next({ items: filteredItems });
    this._snackBar.open('1 item removed from cart.', 'Ok', { duration: 3000});
    }
    return filteredItems;
  }

  reduceQuantity(item : CartItem) : void {
    let itemForRemoval: CartItem | undefined;
    let filteredItems = this.cart.value.items.map((_item) =>{
      if(_item.id === item.id){
        _item.quantity--;

        if(_item.quantity === 0){
          itemForRemoval = item;
        }
      }
      return _item;
    });

    if(itemForRemoval){
      filteredItems = this.removeFromCart(itemForRemoval, false);
    }

    this.cart.next({ items: filteredItems });
    this._snackBar.open('1 item removed from cart.', 'Ok', { duration: 3000});


  }

  saveCart(){
  }

  reloadCart(items: string | undefined | null) : void {
    //console.log(items);
    if(items){
    let reloadedItems = JSON.parse(items);
    this.cart.next({ items : reloadedItems.items });
    }
  }


}
