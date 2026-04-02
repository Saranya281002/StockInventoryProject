import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
constructor(private productService: ProductService) {}
products: any[] = [];
filteredProducts: any[] = [];
ngOnInit() {
  this.productService.getProducts().subscribe(data => {
    this.products = data;
    this.filteredProducts = data;
  });
}

showForm = false;
isEditMode = false;
editProductId: number | null = null;
searchText: string = '';
selectedCategory: string = '';


newProduct: any = {
  name: '',
  category: '',
  price: null
};

toggleForm() {
  this.showForm = !this.showForm;
}

addProduct() {
  debugger
if (this.isEditMode && this.editProductId !== null) {
  this.productService.updateProduct(this.editProductId, this.newProduct).subscribe(() => {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filterProducts();
    });
  });
} else {
  this.productService.addProduct(this.newProduct).subscribe(() => {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filterProducts();
    });
  });
}
  this.newProduct = { name: '', category: '', price: null };
  this.showForm = false;
  this.filterProducts();
}

editProduct(product: any) {
  debugger
  this.showForm = true;
  this.isEditMode = true;
  this.editProductId = product.id;
  this.newProduct = { ...product };
  this.filterProducts();
}
deleteProduct(id: number) {
  this.productService.deleteProduct(id).subscribe(() => {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filterProducts();
    });
  });
}
filterProducts() {
  this.filteredProducts = this.products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(this.searchText.toLowerCase());
    const matchesCategory = this.selectedCategory 
      ? p.category === this.selectedCategory 
      : true;
    return matchesSearch && matchesCategory;
  });
}
}
