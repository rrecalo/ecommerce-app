import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.css']
})
export class StripeComponent {

  pageToView: string | undefined;

  constructor(private router : Router, private cartService : CartService){
  }

  ngOnInit() : void {
    this.determineURL();
  }

  determineURL() : void{
    this.pageToView = this.router.url.split('/')[2];
    console.log(this.pageToView);
    if(this.pageToView === "success"){
      this.cartService.checkoutCart();
    }
  }

}
