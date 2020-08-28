import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ShopType } from '../shop-type.enum';
import { BodyComponent } from '../body/body.component';
import { ProductGridComponent} from '../product-grid/product-grid.component';
import { ProductFetchService } from '../product-fetch.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    
    ShopType = ShopType;    // To access enum in HTML
    shopTypeEmitter: BehaviorSubject<ShopType>;
    displayCartEmitter: BehaviorSubject<number>;
    private banner1: string = "We deliver to your doorstep";
    private banner2: string = "Call us now! 123-456-7890";

    private dropdownTimeout;   // used to handle shop type dropdown

    constructor(public productFetch: ProductFetchService ) {
        setInterval(this.changeBannerText(this.banner1, this.banner2), 3000);
    }

    ngOnInit(): void {
        // keep dropdown in place
        window.onresize = this.positionDropdown;
        this.shopTypeEmitter = this.productFetch.getShopTypeEmitter();
        this.displayCartEmitter = this.productFetch.getDisplayCartEmitter();
    }

    toggleDisplayCart(){
        this.displayCartEmitter.next(0);
    }

    loadShop(shopType: ShopType): void {
        this.shopTypeEmitter.next(shopType);
    }

    changeBannerText(bannerString1: string, bannerString2: string) {
        return function () {
            let currentContents = document.getElementById("message").innerHTML;
            if (currentContents === bannerString1) {
                document.getElementById("message").innerHTML = bannerString2;
            } else {
                document.getElementById("message").innerHTML = bannerString1;
            }
        }

    }
    showDropdown(){
        if(this.dropdownTimeout){
            clearTimeout(this.dropdownTimeout);
            this.dropdownTimeout = undefined;
        }
        let id = "shop-dropdown";
        let dropdown = document.getElementById(id);
        dropdown.style.maxHeight = dropdown.scrollHeight + "px";
        
    }
    hideDropdown(){
        let id ="shop-dropdown";
        this.dropdownTimeout = setTimeout(function(){
            let dropdown = document.getElementById(id);
            dropdown.style.maxHeight = null;
        },500);
    }
    
    positionDropdown() {    // to keep dropdown in place
        let left = document.getElementById("menu-shop").getBoundingClientRect().left;
        document.getElementById("shop-dropdown").style.left = left + "px";
    }

}

