import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../product';
import { ProductFetchService } from '../product-fetch.service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

    @Input() product: Product;
    id: string;
    imageUrl: string;
    imageHoverUrl: string;
    description: string;
    price: number;

    displayCartEmitter: BehaviorSubject<number>;

    constructor(public productFetch: ProductFetchService) { 
    }

    // ngOnInit guarantees that your bindings are readily available
    ngOnInit(): void {
        this.id = this.product.id;
        this.imageUrl = this.product.imageUrl;
        this.imageHoverUrl = this.product.imageHoverUrl;
        this.description = this.product.description;
        this.price = this.product.price;
        
        this.displayCartEmitter = this.productFetch.getDisplayCartEmitter();
    }

    addProduct(){
        this.productFetch.addToCart(this.id, 1);
        setTimeout(()=>{this.displayCartEmitter.next(0);}, 10);
        
    }

}
