import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

dashboardData: any = {};
 constructor(private productService: ProductService) {}

ngOnInit() {
  this.productService.getDashboard().subscribe(data => {
    this.dashboardData = data;
  });
}

}
