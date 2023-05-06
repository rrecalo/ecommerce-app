import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/models/Cart.model';
import { CartService } from 'src/app/services/cart.service';

const STRIPE_REQUEST_SERVER_URL = "https://rr-ecommerce-api.azurewebsites.net/Checkout/Checkout";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent {

  cart: Cart = {  items: [{
    product: "https://via.placeholder.com/150",
    name: "sneakers",
    price: 150,
    quantity: 1,
    id: 1,
  },
  {
    product: "https://via.placeholder.com/150",
    name: "jacket",
    price: 175,
    quantity: 3,
    id: 1,
  }
  ]};

  dataSource : Array<CartItem> = [];
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action',
  ];

  ngOnInit() : void {
    this.dataSource = this.cart.items;
    this.cartService.cart.subscribe((_cart: Cart) => {
        this.cart = _cart;
        this.dataSource = this.cart.items;
    });
  }

  constructor(private cartService : CartService, private http: HttpClient){}

  getTotal(items: Array<CartItem>) : number {
    return this.cartService.getTotal(items);
  }

  onClearCart() : void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem) : void {
    this.cartService.removeFromCart(item);
  }

  onAddQuantity(item: CartItem) : void {
    this.cartService.addToCart(item);
  }

  onReduceQuantity(item: CartItem) : void {
    this.cartService.reduceQuantity(item);
  }

  onCheckout() : void {
    console.log(this.cart.items);
    this.http.post(STRIPE_REQUEST_SERVER_URL,
      //items: JSON.stringify(this.cart.items)
      // {
      //   "items" : [
      //     {
      //       "product": "string",
      //       "name": "string",
      //       "price": 0,
      //       "quantity": 0,
      //       "id": "string"
      //     }
      //   ]
      // }
      { "items" : this.cart.items}
    ).subscribe(async (res: any ) =>{
      //console.log(res);
      let stripe = await loadStripe('pk_test_51N44OYDf3xaTX0tLNUjMpD3XOM265eolQC7kPganvyKIizgULjgjdmc9b2EmgUrA5Vd6HEuaVFsGnBSZXoNIsCSN00v5QgK9nU');
      let a = stripe?.redirectToCheckout({
        sessionId: res.id
      })
      console.log(a);
    });
  }

}
