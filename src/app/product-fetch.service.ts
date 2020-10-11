import { Injectable, EventEmitter } from '@angular/core';
import { Product } from './product';
import { ShopType } from './shop-type.enum';
import { ProductData } from './product-data';
import { Subject, Observable, of, BehaviorSubject } from 'rxjs';
import { CartItem } from './cart-item';

@Injectable({
    providedIn: 'root'
})
export class ProductFetchService {
    static readonly NUM_CACTI = 6;
    static readonly NUM_PLANTS = 6;
    static readonly NUM_SUCCULENTS = 6;
    static readonly PATH_CACTI = "assets/images/plants/cacti/cactus";
    static readonly PATH_PLANTS = "assets/images/plants/plants/plant";
    static readonly PATH_SUCCULENTS = "assets/images/plants/succulents/succulent";

    static readonly TITLE_CACTI = "HAVE YOURSELF A CACTUS";
    static readonly TITLE_PLANTS = "THE WORLD NEEDS MORE PLANTS";
    static readonly TITLE_SUCCULENTS = "WE LOVE SUCCULENTS";
    static readonly TITLE_ALL = "EVERYTHING THAT GROWS IN OUR GARDEN";

    static readonly SUBTITLE_CACTI = "I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. I’m a great place for you to tell a story and let your users know a little more about you.";
    static readonly SUBTITLE_PLANTS = "I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. I’m a great place for you to tell a story and let your users know a little more about you.";
    static readonly SUBTITLE_SUCCULENTS = "I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. I’m a great place for you to tell a story and let your users know a little more about you.";
    static readonly SUBTITLE_ALL = "I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. I’m a great place for you to tell a story and let your users know a little more about you.";


    static readonly CATEGORY_NAME_CACTI = "CACTI";
    static readonly CATEGORY_NAME_PLANTS = "PLANTS";
    static readonly CATEGORY_NAME_SUCCULENTS = "SUCCULENTS";
    static readonly CATEGORY_NAME_ALL = "SHOP ALL";


    static readonly BACKGROUND_STYLING_CACTI = {
        'background-repeat': 'no-repeat',
        'background-position': 'center center',
        'background-image': 'url("assets/images/plants/cacti/cactus-background.png")',
        '-webkit-background-size': 'cover',
        '-moz-background-size': 'cover',
        '-o-background-size': 'cover',
        'background-size': 'cover',
    }
    static readonly BACKGROUND_STYLING_PLANTS = {
        'background-repeat': 'no-repeat',
        'background-position': 'center center',
        'background-image': 'url("assets/images/plants/plants/plant-background.png")',
        '-webkit-background-size': 'cover',
        '-moz-background-size': 'cover',
        '-o-background-size': 'cover',
        'background-size': 'cover',
    }
    static readonly BACKGROUND_STYLING_SUCCULENTS = {
        'background-repeat': 'no-repeat',
        'background-position': 'center center',
        'background-image': 'url("assets/images/plants/succulents/succulent-background.png")',
        '-webkit-background-size': 'cover',
        '-moz-background-size': 'cover',
        '-o-background-size': 'cover',
        'background-size': 'cover',
    }
    static readonly BACKGROUND_STYLING_ALL = {
        'background-repeat': 'no-repeat',
        'background-position': 'center center',
        'background-image': 'url("assets/images/plants/all/all-background.png")',
        '-webkit-background-size': 'cover',
        '-moz-background-size': 'cover',
        '-o-background-size': 'cover',
        'background-size': 'cover',
    }

    private cacti: Product[] = [];
    private plants: Product[] = [];
    private succulents: Product[] = [];
    private all: Product[] = [];
    // [{product, quantity}...]
    private cartContents: CartItem[] = [];

    private shopType: ShopType;
    private shopTypeEmitter: BehaviorSubject<ShopType>;
    private displayCartEmitter: BehaviorSubject<number>;

    constructor() {
        this.shopType = ShopType.HomeBody;
        this.shopTypeEmitter = new BehaviorSubject<ShopType>(ShopType.HomeBody);
        this.displayCartEmitter = new BehaviorSubject<number>(0);
        this.shopTypeEmitter.subscribe({
            next: (shopType) => this.shopType = shopType
        });
        this.generateCacti();
        this.generatePlants();
        this.generateSucculents();
        this.all = this.cacti.concat(this.plants, this.succulents);
        /*
        this.addToCart("cactus1", 1);
        this.addToCart("cactus2", 2);
        this.addToCart("cactus3", 1);
        this.addToCart("cactus1", 4);
        this.addToCart("cactus4", 4);
        this.addToCart("cactus5", 4);
        this.addToCart("cactus6", 4);
        console.log("CartContents", this.cartContents);
        */
    }

    checkQuantity() {

    }
    
    setItemQuantity(value: string, item: CartItem): void {
        /*let isValid: boolean;
        if(!isNaN(parseInt(value))){
            let valueInt = parseInt(value);
            if (valueInt >= 1 && valueInt <= 9999) { item.quantity = valueInt; }
            isValid = valueInt >= 1 && valueInt <= 9999;
        } else {
            isValid = false;
        }

        return isValid;*/
        let valueInt: number = parseInt(value);
        if (valueInt >= 1 && valueInt <= 9999) { item.quantity = valueInt; }
    }
    increaseItemQuantity(increment: number, item: CartItem): void {
        if (item.quantity <= (9999 - increment)) {
            item.quantity += increment;
        }
    }

    decreaseItemQuantity(decrement: number, item: CartItem): void {
        if (item.quantity >= (1 + decrement)) {
            item.quantity -= decrement;
        }
    }

    getCartContents(): CartItem[] {
        return this.cartContents;
    }

    getCartTotalPrice(): number {
        let price = 0;
        this.cartContents.forEach((item) => {
            price += item.product.price * item.quantity;
        });
        return price;
    }

    addToCart(id: string, quantity: number): void {

        let index = this.cartContents.findIndex(element => element.product.id === id);
        if (index != -1) { // if product is already added
            // just update quantity
            this.cartContents[index].quantity += quantity;
        } else {    // add product
            let product = this.all.find(element => element.id === id);
            this.cartContents.push({ product: product, quantity: quantity });
        }
    }

    removeFromCart(id: string): void {
        let index = this.cartContents.findIndex(element => element.product.id === id);
        if (index != -1)
            this.cartContents.splice(index, 1); // removes one item starting from index
    }

    getShopTypeEmitter(): BehaviorSubject<ShopType> {
        return this.shopTypeEmitter;
    }

    getShopType(): ShopType {
        return this.shopType;
    }

    setShopType(shopType: ShopType) {
        this.shopType = shopType;
    }

    getDisplayCartEmitter(): BehaviorSubject<number> {
        return this.displayCartEmitter;
    }

    getData(): Observable<ProductData> {
        //console.log("Sending data of type", this.shopType);
        let dataPackage: ProductData;
        switch (this.shopType) {
            case ShopType.Cacti: {
                dataPackage = {
                    title: ProductFetchService.TITLE_CACTI,
                    subtitle: ProductFetchService.SUBTITLE_CACTI,
                    category: ProductFetchService.CATEGORY_NAME_CACTI,
                    style: ProductFetchService.BACKGROUND_STYLING_CACTI,
                    products: this.cacti
                };
            }
                break;
            case ShopType.Plants: {
                dataPackage = {
                    title: ProductFetchService.TITLE_PLANTS,
                    subtitle: ProductFetchService.SUBTITLE_PLANTS,
                    category: ProductFetchService.CATEGORY_NAME_PLANTS,
                    style: ProductFetchService.BACKGROUND_STYLING_PLANTS,
                    products: this.plants
                };
            }

                break;
            case ShopType.Succulents: {
                dataPackage = {
                    title: ProductFetchService.TITLE_SUCCULENTS,
                    subtitle: ProductFetchService.SUBTITLE_SUCCULENTS,
                    category: ProductFetchService.CATEGORY_NAME_SUCCULENTS,
                    style: ProductFetchService.BACKGROUND_STYLING_SUCCULENTS,
                    products: this.succulents
                };
            }

                break;
            case ShopType.All: {
                dataPackage = {
                    title: ProductFetchService.TITLE_ALL,
                    subtitle: ProductFetchService.SUBTITLE_ALL,
                    category: ProductFetchService.CATEGORY_NAME_ALL,
                    style: ProductFetchService.BACKGROUND_STYLING_ALL,
                    products: this.all
                };
            }

                break;
        }
        return of(dataPackage);
    }

    generateCacti(): void {
        this.cacti = [];
        for (let i = 1; i <= ProductFetchService.NUM_CACTI; i++) {
            let product: Product = {
                id: "cactus" + i,
                imageUrl: ProductFetchService.PATH_CACTI + i + ".png",
                imageHoverUrl: ProductFetchService.PATH_CACTI + i + "-hover.png",
                description: "I'm a product",
                price: this.randomNumFromInterval(10, 30),
            }

            // currently only one image has hover background image
            if (i != 4) {
                product.imageHoverUrl = undefined;
            }
            this.cacti.push(product);
        }
    }

    generatePlants(): void {
        this.plants = [];
        for (let i = 1; i <= ProductFetchService.NUM_PLANTS; i++) {
            let product: Product = {
                id: "plant" + i,
                imageUrl: ProductFetchService.PATH_PLANTS + i + ".png",
                imageHoverUrl: ProductFetchService.PATH_PLANTS + i + "-hover.png",
                description: "I'm a product",
                price: this.randomNumFromInterval(10, 30),
            }

            // currently only one image has hover background image
            if (i != 2) {
                product.imageHoverUrl = undefined;
            }
            this.plants.push(product);
        }
    }

    generateSucculents(): void {
        this.succulents = [];
        for (let i = 1; i <= ProductFetchService.NUM_SUCCULENTS; i++) {
            let product: Product = {
                id: "succulent" + i,
                imageUrl: ProductFetchService.PATH_SUCCULENTS + i + ".png",
                imageHoverUrl: ProductFetchService.PATH_SUCCULENTS + i + "-hover.png",
                description: "I'm a product",
                price: this.randomNumFromInterval(10, 30),
            }

            // currently only one image has hover background image
            if (i != 3) {
                product.imageHoverUrl = undefined;
            }
            this.succulents.push(product);
        }
    }

    randomNumFromInterval(min, max): number { // min and max included 
        return Math.random() * (max - min + 1) + min;
    }
}
