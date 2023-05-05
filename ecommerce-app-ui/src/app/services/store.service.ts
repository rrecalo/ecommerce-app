import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/Product.model';
import { Observable } from 'rxjs';

const STORE_BASE_URL = "https://fakestoreapi.com";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private httpClient: HttpClient) { }

  getAllProducts(limit = 12, sort='desc', category: string | undefined) : Observable<Array<Product>> {
    if(category){
      return this.httpClient.get<Array<Product>>(
        `${STORE_BASE_URL}/products/category/${category}?sort=${sort}&limit=${limit}`);
    }
    return this.httpClient.get<Array<Product>>(
      `${STORE_BASE_URL}/products?sort=${sort}&limit=${limit}`);

  }

  //getProductsInCategory(limit = 12, sort='desc', category : string) : Observable<Array<Product>> {}

  getAllCategories() : Observable<Array<string>>{
    return this.httpClient.get<Array<string>>(
        `${STORE_BASE_URL}/products/categories`);

  }

}
