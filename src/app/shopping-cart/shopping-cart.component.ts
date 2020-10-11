import { Component, OnInit } from '@angular/core';
import { ProductFetchService } from '../product-fetch.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CartItem } from '../cart-item';
import { ShopType } from '../shop-type.enum';

@Component({
    selector: 'app-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

    static readonly ANIMATION_DELAY: number = 500;  //milliseconds 
    static readonly CART_POSITION_HIDDEN: string = "-30vw";  //milliseconds 
    isVisible: boolean = true;  // with initial subscription it becomes false
    cartContents: CartItem[];
    displayCartEmitter: BehaviorSubject<number>;
    displayCartSubscription: Subscription;

    shopTypeEmitter: BehaviorSubject<ShopType>;
    shopTypeSubscription: Subscription;

    constructor(public productFetch: ProductFetchService) { }

    ngOnInit(): void {
        this.displayCartEmitter = this.productFetch.getDisplayCartEmitter();
        this.displayCartSubscription = this.displayCartEmitter.subscribe({
            next: (num: number) => {
                this.toggleCart();
            }
        });
        this.shopTypeEmitter = this.productFetch.getShopTypeEmitter();
        this.cartContents = this.productFetch.getCartContents();
        this.productFetch.addToCart("cactus1", 1);
        this.productFetch.addToCart("cactus2", 5);
        this.productFetch.addToCart("cactus3", 5);
        this.productFetch.addToCart("cactus4", 5);
    }

    ngOnDestroy() {
        this.displayCartSubscription.unsubscribe();
    }

    toggleCart() {
        if (this.isVisible) {
            this.hideCart();
        } else {
            this.showCart();
        }
    }

    decreaseQuantity(item: CartItem): void {
        this.productFetch.decreaseItemQuantity(1,item);
    }
    increaseQuantity(item: CartItem): void {
        this.productFetch.increaseItemQuantity(1,item);
    }

    checkQuantity(event: KeyboardEvent, item: CartItem): void {
        let value: string = (event.target as HTMLInputElement).value;
        this.productFetch.setItemQuantity(value, item);
        (event.target as HTMLInputElement).value = item.quantity + "";  // updates current value in view
    }
    showCart(): void {
        let container = document.getElementById("shopping-container");
        let cartContainer = document.getElementById("right-shopping-container");
        let cart = document.getElementById("right-shopping");

        container.style.top = "0";  // puts component in view
        container.style.backgroundColor = "rgba(0,0,0,0.5)";

        // fade effect
        setTimeout(() => {
            cart.style.opacity = "1";
        }, ShoppingCartComponent.ANIMATION_DELAY);

        cartContainer.style.right = "0";

        this.isVisible = true;
    }

    hideCart(): void {
        let viewportWidth = document.documentElement.clientWidth;
        // needed for proper animation 
        let cartContainerPosition = viewportWidth > 810 ? "-30vw" : "-100vw";
        let container = document.getElementById("shopping-container");
        let cartContainer = document.getElementById("right-shopping-container");
        let cart = document.getElementById("right-shopping");

        container.style.backgroundColor = "rgba(0,0,0,0)";

        // fade effect
        cart.style.opacity = "0";

        // first fade, then move cart
        setTimeout(() => {
            cartContainer.style.right = cartContainerPosition;
        }, 200
        );    // fade delay

        setTimeout( // takes component out of view
            () => { container.style.top = "100vh"; },
            ShoppingCartComponent.ANIMATION_DELAY + 200
        );

        this.isVisible = false;
    }

    showRemoveItem(element: HTMLElement): void {
        let removeItemButton: HTMLElement = element.querySelector(".remove-item");
        removeItemButton.style.opacity = "1";
    }

    hideRemoveItem(element: HTMLElement): void {
        let removeItemButton: HTMLElement = element.querySelector(".remove-item");
        if (document.documentElement.clientWidth > 810) {
            removeItemButton.style.opacity = "0";
        }
    }

    removeItem(item: CartItem): void {
        this.productFetch.removeFromCart(item.product.id);
    }

    loadShop(): void {
        this.shopTypeEmitter.next(ShopType.Checkout);
    }


}
