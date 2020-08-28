import { Component, OnInit } from '@angular/core';
import { ProductFetchService } from '../product-fetch.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CartItem } from '../cart-item';

@Component({
    selector: 'app-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

    static readonly ANIMATION_DELAY: number = 500;  //milliseconds 
    static readonly CART_MIN_WIDTH: number = 300;
    static readonly CART_WIDTH: number = 20;
    isVisible: boolean = true;  // with initial subscription it becomes false
    cartContents: CartItem[];
    displayCartEmitter: BehaviorSubject<number>;
    displayCartSubscription: Subscription;

    constructor(public productFetch: ProductFetchService) { }

    ngOnInit(): void {
        this.displayCartEmitter = this.productFetch.getDisplayCartEmitter();
        this.displayCartSubscription = this.displayCartEmitter.subscribe({
            next: (num: number) => {
                this.toggleCart();
            }
        });
        this.cartContents = this.productFetch.getCartContents();
        //this.productFetch.addToCart("cactus1", 1);
        //this.productFetch.addToCart("cactus2", 5);
        //this.productFetch.addToCart("cactus3", 5);
        //this.productFetch.addToCart("cactus4", 5);
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
        if (item.quantity > 1) {
            item.quantity--;
        }
    }
    increaseQuantity(item: CartItem): void {
        if (item.quantity < 9999) {
            item.quantity++;
        }
    }

    checkQuantity(event: KeyboardEvent, item: CartItem): void {
        let onlyNumbers = RegExp("^0*(?:[1-9][0-9]?|9999)$");
        let value: string = (event.target as HTMLInputElement).value;
        if (!onlyNumbers.test(value)) {
            (event.target as HTMLInputElement).value = item.quantity + "";
        } else {
            item.quantity = parseInt(value, 10);
        }


    }
    showCart(): void {
        let container = document.getElementById("shopping-container");
        let shadow = document.getElementById("left-shadow");
        let cart = document.getElementById("right-shopping");
        container.style.top = "0";  // puts component in view
        shadow.style.backgroundColor = "rgba(0,0,0,0.5)";
        cart.style.padding = "60px 30px 30px 30px";

        // fade effect
        setTimeout(() => {
            let children = cart.children;
            console.log("Children", children.length);
            for (let i = 0; i < children.length; i++) {
                let item: HTMLElement = children.item(i) as HTMLElement;
                item.style.opacity = "1";
            }
        }, ShoppingCartComponent.ANIMATION_DELAY);

        setTimeout(
            () => { cart.style.minWidth = ShoppingCartComponent.CART_MIN_WIDTH + "px"; },
            ShoppingCartComponent.ANIMATION_DELAY
        );
        cart.style.width = ShoppingCartComponent.CART_WIDTH + "vw";

        this.isVisible = true;
    }

    hideCart(): void {
        let container = document.getElementById("shopping-container");
        let shadow = document.getElementById("left-shadow");
        let cart = document.getElementById("right-shopping");
        shadow.style.backgroundColor = "rgba(0,0,0,0)";

        

        // fade effect
        let children = cart.children;
        for (let i = 0; i < children.length; i++) {
            let item: HTMLElement = children.item(i) as HTMLElement;
            item.style.opacity = "0";
        }
        // first fade, then decrease width
        setTimeout(()=>{
            cart.style.minWidth = "0";
            cart.style.width = "0";
        }, 200
        );    // fade delay

        setTimeout(
            () => { cart.style.padding = "0" },
            ShoppingCartComponent.ANIMATION_DELAY - 300 + 200
        );

        
        setTimeout( // takes component out of view
            () => { container.style.top = "100vh"; },
            ShoppingCartComponent.ANIMATION_DELAY + 200
        );


        this.isVisible = false;
    }

    showRemoveItem(element: HTMLElement): void{
        let removeItemButton: HTMLElement = element.querySelector(".remove-item");
        removeItemButton.style.opacity = "1";
    }

    hideRemoveItem(element: HTMLElement): void {
        let removeItemButton: HTMLElement = element.querySelector(".remove-item");
        removeItemButton.style.opacity = "0";
    }

    removeItem(item: CartItem): void{
        this.productFetch.removeFromCart(item.product.id);
    }


}
