import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

 apiUrl = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) { }
getHeaders() {
  return {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  };
}
  getProducts() {
  return this.http.get<any[]>(this.apiUrl, this.getHeaders());
}

  addProduct(product: any) {
    return this.http.post(this.apiUrl, product, this.getHeaders());
  }

  updateProduct(id: number, updatedProduct: any) {
    return this.http.put(`${this.apiUrl}/${id}`, updatedProduct, this.getHeaders());
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }
  addStock(data: any) {
  return this.http.post(`${this.apiUrl}/stock`, data, this.getHeaders());
}
removeStock(data: any) {
  return this.http.post(`${this.apiUrl}/stock/remove`, data, this.getHeaders());
}
getAllStock() {
  return this.http.get<any[]>(`${this.apiUrl}/stock/all`, this.getHeaders());
}
getTransactions(productId: number) {
  return this.http.get<any[]>(
    `${this.apiUrl}/${productId}/transactions`,
    this.getHeaders()
  );
}
viewTransactions(productId: number) {
  return this.http.get<any[]>(`${this.apiUrl}/${productId}/transactions`, this.getHeaders());
}
getDashboard() {
  return this.http.get<any>(`${this.apiUrl}/dashboard`, this.getHeaders());
}
}
