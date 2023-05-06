import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';
import { StripeComponent } from './pages/stripe/stripe.component';

const routes: Routes = [
  {path: '',
  redirectTo: 'home',
  pathMatch: 'full'},
  {
  path: 'home',
  component : HomeComponent,
  },
  {
  path: 'cart',
  component : CartComponent,
  },
  {
    path: 'stripe/success',
    component : StripeComponent,
  },
  {
    path: 'stripe/cancel',
    component : StripeComponent,
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
