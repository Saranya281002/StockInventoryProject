import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

 apiUrl = 'https://localhost:44359/api/Products';

  constructor(private http: HttpClient) { }

  getProducts() {
  return this.http.get<any[]>(this.apiUrl);
}

  addProduct(product: any) {
    return this.http.post(this.apiUrl, product);
  }

  updateProduct(id: number, updatedProduct: any) {
    return this.http.put(`${this.apiUrl}/${id}`, updatedProduct);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}