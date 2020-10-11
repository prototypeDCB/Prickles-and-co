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
                let background: HTMLElement = document.querySelector("#footer-parent");
                if ( this.isWhiteBackground(shopType) ) {
                    background.style.backgroundColor = "white";
                } else {
                    background.style.backgroundColor = "rgb(237,237,238)";
                }
            }
        });
    }

    loadShop(shopType: ShopType): void {
        this.shopTypeEmitter.next(shopType);
    }

    ngOnDestroy() {
        this.shopTypeSubscription.unsubscribe();
    }

    isWhiteBackground(shopType: ShopType): boolean {
        return shopType === ShopType.Checkout
            || shopType === ShopType.FAQ
            || shopType === ShopType.Privacy
            || shopType === ShopType.Shipping;
    }

}
