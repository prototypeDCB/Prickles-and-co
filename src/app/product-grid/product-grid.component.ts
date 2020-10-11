import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../product';
import { ProductFetchService } from '../product-fetch.service';
import { ShopType } from '../shop-type.enum';
import { ProductData } from '../product-data';
import { Subscription, BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-product-grid',
    templateUrl: './product-grid.component.html',
    styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent implements OnInit {

    ShopType = ShopType;
    shopTypeEmitter: BehaviorSubject<ShopType>;
    shopTypeSubscription: Subscription;
    productData: ProductData;
    shopType: ShopType;

    title: string;
    subtitle: string;
    categoryName: string;
    stylingObj: Object;
    products: Product[];

    constructor(public productFetch: ProductFetchService) {

    }

    ngOnInit(): void {
        this.shopTypeEmitter = this.productFetch.getShopTypeEmitter();

        this.shopTypeSubscription = this.shopTypeEmitter.subscribe({
            next: (shopType) => {
                this.shopType = shopType;
                if (this.shopType === ShopType.All
                    || this.shopType === ShopType.Cacti
                    || this.shopType === ShopType.Plants
                    || this.shopType === ShopType.Succulents) {
                    let body: HTMLElement = document.querySelector("#product-page");

                    this.loadData();
                    body.style.transition = "none";
                    body.style.opacity = "0";

                }
            }
        });
        // the first time the component is loaded, the event is missed, so you have to call again
        // if you change store type after that, the loading is handled in the subscribe function
        this.loadData();
        let body: HTMLElement = document.querySelector("#product-page");

    }

    ngOnDestroy() {
        this.shopTypeSubscription.unsubscribe();
    }

    loadData(): void {
        this.productFetch.getData().subscribe(productData => {
            this.productData = productData;
            this.title = this.productData.title;
            this.subtitle = this.productData.subtitle;
            this.categoryName = this.productData.category;
            this.stylingObj = this.productData.style;
            this.products = this.productData.products;
        });
        let body: HTMLElement = document.querySelector("#product-page");

        setTimeout(() => {
            body.style.transition = "opacity 0.5s ease";
            body.style.opacity = "1";
        }, 200);

    }

    loadShop(shopType: ShopType): void {
        this.shopTypeEmitter.next(shopType);
    }

    scrollToProducts() {
        let element = document.getElementById("scroll-marker");
        element.scrollIntoView({ behavior: 'smooth' });
    }
}
