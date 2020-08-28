import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ShopType } from '../shop-type.enum';
import { ProductFetchService } from '../product-fetch.service';
import { Subscription, BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-body',
    templateUrl: './body.component.html',
    styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

    ShopType = ShopType;    // To access enum in HTML
    shopType: ShopType;
    shopTypeEmitter: BehaviorSubject<ShopType>;
    shopTypeSubscription: Subscription;

    constructor(public productFetch: ProductFetchService) { }

    ngOnInit(): void {
        this.shopTypeEmitter = this.productFetch.getShopTypeEmitter();
        this.shopTypeSubscription = this.shopTypeEmitter.subscribe({
            next: (shopType: ShopType) => {
                this.shopType = shopType;
                if (shopType === ShopType.About) {
                    let element = document.getElementById("about-scroll-marker");
                    element.scrollIntoView({ behavior: 'smooth' });
                } else if (shopType === ShopType.Contact){
                    let element = document.getElementById("requests-marker");
                    element.scrollIntoView({ behavior: 'smooth' });
                }else{
                    let element = document.querySelector("body");
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        let body: HTMLElement = document.querySelector("#body");
        body.style.opacity = "1";
    }

    ngOnDestroy(){
        this.shopTypeSubscription.unsubscribe();
    }
    loadShop(shopType: ShopType): void {
        this.shopTypeEmitter.next(shopType);
    }

}
