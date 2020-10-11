import { Component, OnInit } from '@angular/core';
import { ProductFetchService } from '../product-fetch.service';
import { ShopType } from '../shop-type.enum';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CartItem } from '../cart-item';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

    ShopType = ShopType;    // To access enum in HTML
    shopType: ShopType;
    shopTypeEmitter: BehaviorSubject<ShopType>;
    shopTypeSubscription: Subscription;
    cartContents: CartItem[];

    isOpenPromoCode: boolean = false;
    isOpenAddNote: boolean = false;

    constructor(public productFetch: ProductFetchService) { }

    ngOnInit(): void {
        this.shopTypeEmitter = this.productFetch.getShopTypeEmitter();
        this.shopTypeSubscription = this.shopTypeEmitter.subscribe({
            next: (shopType: ShopType) => {
                let element = document.querySelector("#load-marker");
                element.scrollIntoView({ behavior: 'smooth' });
            }
        });
        let body: HTMLElement = document.querySelector("#checkout");
        body.style.opacity = "1";

        this.cartContents = this.productFetch.getCartContents();
    }

    ngOnDestroy() {
        this.shopTypeSubscription.unsubscribe();
    }

    decreaseQuantity(item: CartItem): void {
        this.productFetch.decreaseItemQuantity(1, item);
    }
    increaseQuantity(item: CartItem): void {
        this.productFetch.increaseItemQuantity(1, item);
    }

    checkQuantity(event: KeyboardEvent, item: CartItem): void {
        let value: string = (event.target as HTMLInputElement).value;
        this.productFetch.setItemQuantity(value, item);
        (event.target as HTMLInputElement).value = item.quantity + "";  // updates current value in view
    }

    removeItem(item: CartItem, index: number): void {
        let elementToDelete: HTMLElement = document.querySelector("#item" + index);
        elementToDelete.style.height = "0";
        elementToDelete.style.opacity = "0";

        setTimeout(() => {
            this.productFetch.removeFromCart(item.product.id);
        }, 500);
    }

    loadShop(): void {
        this.shopTypeEmitter.next(ShopType.HomeBody);
    }

    togglePromoCode(): void {
        let promoCodeInputContainer: HTMLElement = document.querySelector("#promo-code-input-container");
        if (this.isOpenPromoCode) {
            promoCodeInputContainer.style.display = "none";
            this.isOpenPromoCode = false;
        } else {
            promoCodeInputContainer.style.display = "flex";
            this.isOpenPromoCode = true;
        }
    }

    toggleAddNote(): void {
        let addNoteInputContainer: HTMLElement = document.querySelector("#add-note-input");
        if (this.isOpenAddNote) {
            addNoteInputContainer.style.display = "none";
            this.isOpenAddNote = false;
        } else {
            addNoteInputContainer.style.display = "block";
            this.isOpenAddNote = true;
        }

    }

    disableNotice(): void {
        let shadow: HTMLElement = document.querySelector("#checkout-notice-shadow");
        let notice: HTMLElement = document.querySelector("#checkout-notice");
        shadow.style.opacity = "0";
        notice.style.opacity = "0";

        setTimeout(() => {
            shadow.style.display = "none";
            notice.style.display = "none";
        }, 500);
    }

    enableNotice() {
        let shadow: HTMLElement = document.querySelector("#checkout-notice-shadow");
        let notice: HTMLElement = document.querySelector("#checkout-notice");
        shadow.style.display = "flex";
        notice.style.display = "flex";
        setTimeout(()=>{shadow.style.opacity = "1"; notice.style.opacity = "1";},1);
        
    }

}
