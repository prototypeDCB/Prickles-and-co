import { Component, OnInit } from '@angular/core';
import { ShopType } from '../shop-type.enum';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProductFetchService } from '../product-fetch.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

    ShopType = ShopType;    // To access enum in HTML
    shopType: ShopType;
    shopTypeEmitter: BehaviorSubject<ShopType>;
    shopTypeSubscription: Subscription;

    constructor(public productFetch: ProductFetchService) { }

    ngOnInit(): void {
        this.shopTypeEmitter = this.productFetch.getShopTypeEmitter();
        this.shopTypeSubscription = this.shopTypeEmitter.subscribe({
            next: (shopType) => {
                let element = document.querySelector("body");
                element.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    loadShop(shopType: ShopType): void {
        this.shopTypeEmitter.next(shopType);
    }

    ngOnDestroy() {
        this.shopTypeSubscription.unsubscribe();
    }

}
