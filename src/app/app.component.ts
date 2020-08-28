import { Component, Output, EventEmitter } from '@angular/core';
import { ShopType } from './shop-type.enum';
import { ProductFetchService } from './product-fetch.service';
import { BodyComponent } from './body/body.component';
import { ProductGridComponent } from './product-grid/product-grid.component';
import { Subscription, BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'prickles-and-co';

    shopTypeEmitter: BehaviorSubject<ShopType>;
    shopTypeSubscription: Subscription;
    private productCategory: ShopType;

    constructor(public productFetch: ProductFetchService) {
    }

    ngOnInit(): void {
        this.shopTypeEmitter = this.productFetch.getShopTypeEmitter();
        this.shopTypeSubscription = this.shopTypeEmitter.subscribe({
            next: (shopType) => { this.productCategory = shopType; }
        });
    }


    ngOnDestroy() {
        this.shopTypeSubscription.unsubscribe();
    }

    isHomeBody() {
        return this.productCategory === ShopType.HomeBody
            || this.productCategory === ShopType.About
            || this.productCategory == ShopType.Contact;

    }

    isCacti() {
        return this.productCategory === ShopType.Cacti;
    }

    isPlants() {
        return this.productCategory === ShopType.Plants;
    }

    isSucculents() {
        return this.productCategory === ShopType.Succulents;
    }

    isAll() {
        return this.productCategory === ShopType.All;
    }

    isProductType() {
        return (this.isCacti() || this.isPlants() || this.isSucculents() || this.isAll());
    }

    isFaq() {
        return this.productCategory === ShopType.FAQ;
    }

    isShippingOrPrivacy() {
        return this.productCategory === ShopType.Shipping
            || this.productCategory === ShopType.Privacy;
    }
}
