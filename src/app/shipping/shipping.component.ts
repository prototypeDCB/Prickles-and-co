import { Component, OnInit } from '@angular/core';
import { ShopType } from '../shop-type.enum';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProductFetchService } from '../product-fetch.service';


@Component({
    selector: 'app-shipping',
    templateUrl: './shipping.component.html',
    styleUrls: ['./shipping.component.css']
})
export class ShippingComponent implements OnInit {

    ShopType = ShopType;    // To access enum in HTML
    shopType: ShopType;
    shopTypeEmitter: BehaviorSubject<ShopType>;
    shopTypeSubscription: Subscription;

    constructor(public productFetch: ProductFetchService) { }

    finalSections;
    shippingSections = [
        { t: "SHIPPING POLICY", p: "I’m a shipping policy section. I’m a great place to update your customers about your shipping methods, packaging and costs. Use plain, straightforward language to build trust and make sure that your customers stay loyal!" },
        { t: "RETURN POLICY", p: "I’m a return policy section. I’m a great place to let your customers know what to do in case they’ve changed their mind about their purchase, or if they’re dissatisfied with a product. Having a straightforward refund or exchange policy is a great way to build trust and reassure your customers that they can buy with confidence." },
        { t: "PAYMENT METHOD", p: "I’m a payment methods section. I’m a great place to give your customers as many details as possible about how they can pay for your stunning products. Make sure your use clear language so they enjoy their online shopping experience and stay loyal!" },
        { t: "WHOLESALE INQUIRIES", p: "I’m a wholesale inquiries section. I’m a great place to inform other retailers about how they can sell your stunning products. Use plain language and give as much information as possible in order to promote your business and take it to the next level!" }
    ];
    privacySections = [
        { t: "PRIVACY POLICY", p: "I’m a privacy policy section. I’m a great place to inform your customers about how you use, store, and protect their personal information. Add details such as how you use third-party banking to verify payment, the way you collect data or when will you contact users after their purchase was completed successfully.<br><br>Your user’s privacy is of the highest importance to your business, so take the time to write an accurate and detailed policy. Use straightforward language to gain their trust and make sure they keep coming back to your site!"},
        { t: "SAFETY SECURITY", p: "I’m a safety and security section. I’m a great place to inform your customers about how you use, store, and protect their personal information. Add details such as how you use third-party banking to verify payment, the way you collect data or when will you contact users after their purchase was completed successfully.<br><br>Your user’s security is of the highest importance to your business, so take the time to write an accurate and detailed policy. Use straightforward language to gain their trust and make sure they keep coming back to your site!"}
    ];

    ngOnInit(): void {
        this.shopTypeEmitter = this.productFetch.getShopTypeEmitter();
        this.shopTypeSubscription = this.shopTypeEmitter.subscribe({
            next: (shopType) => {
                let element = document.querySelector("body");
                element.scrollIntoView({ behavior: 'smooth' });
                this.finalSections = (shopType === ShopType.Shipping) ? this.shippingSections : this.privacySections;
            }
        });
    }

    ngOnDestroy() {
        this.shopTypeSubscription.unsubscribe();
    }

    isShipping() {
        return this.productFetch.getShopType() == ShopType.Shipping;
    }

    isPrivacy() {
        return this.productFetch.getShopType() == ShopType.Privacy;
    }

}
