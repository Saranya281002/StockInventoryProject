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

    this.categories = [...new Set(data.map(p => p.category))];

    this.updatePagination();
  });
}

showForm = false;
isEditMode = false;
editProductId: number | null = null;
searchText: string = '';
selectedCategory: string = '';
categories: string[] = [];
currentPage: number = 1;
itemsPerPage: number = 5;
paginatedProducts: any[] = [];

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
  this.productService.addProduct(this.newProduct).subscribe({
  next: () => {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filterProducts();
    });
  },
  error: (err) => {
    console.log("ERROR:", err);
    alert("Something went wrong!");
  }
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
  if (confirm("Are you sure you want to delete this product?")) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.productService.getProducts().subscribe(data => {
        this.products = data;
        this.filterProducts();
      });
    });
  }
}
filterProducts() {
  this.filteredProducts = this.products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(this.searchText.toLowerCase());

    const matchesCategory =
      this.selectedCategory === '' || p.category === this.selectedCategory;

    return matchesSearch && matchesCategory;
  });

  this.currentPage = 1; // reset page
  this.updatePagination();
}
clearFilters() {
  this.searchText = '';
  this.selectedCategory = '';
  this.filteredProducts = this.products;
  this.updatePagination();
}
updatePagination() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;

  this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
}
nextPage() {
  this.currentPage++;
  this.updatePagination();
}

prevPage() {
  this.currentPage--;
  this.updatePagination();
}
}
