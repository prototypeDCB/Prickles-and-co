import { Component, OnInit } from '@angular/core';
import { ShopType } from '../shop-type.enum';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProductFetchService } from '../product-fetch.service';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

    questions = [
        { q: "How do I add a new question?", a: "To add a new question go to app settings and press \"Manage Questions\" button." },
        { q: "Can I insert pictures in my FAQ?", a: "Yes! To add a picture follow these simple steps:<br>&nbsp;&nbsp;&nbsp;&nbsp;1.Enter App Settings<br>&nbsp;&nbsp;&nbsp;&nbsp;2.Click the \"Manage Questions\" button<br>&nbsp;&nbsp;&nbsp;&nbsp;3.Click on the question you would like to attach a picture to<br>&nbsp;&nbsp;&nbsp;&nbsp;4.When editing your answer, click on the picture icon and then add an image from your library" },
        { q: "Can I insert a video in my FAQ?", a: "Yes! Users can add video from YouTube or Vimeo with ease:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. Enter App Settings<br>&nbsp;&nbsp;&nbsp;&nbsp;2. Click the \"Manage Questions\" button<br>&nbsp;&nbsp;&nbsp;&nbsp;3. Click on the question you would like to attach a video to<br>&nbsp;&nbsp;&nbsp;&nbsp;4. When editing your answer, click on the video icon and then paste the YouTube or Vimeo video URL<br>&nbsp;&nbsp;&nbsp;&nbsp;5. That's it! A thumbnail of your video will appear in answer text box" },
        { q: "How do I edit or remove the \"FAQ title\"?", a: "The FAQ title can be adjusted in the settings tab of the App Settings. You can also remove the title by unchecking its checkbox in the settings tab." },

    ];

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
        let body:HTMLElement = document.querySelector("#faq-container");
        body.style.opacity = "1";
    }

    ngOnDestroy(){
        this.shopTypeSubscription.unsubscribe();
    }


    toggleQuestion(elementId: string) {
        console.log("clicked ", elementId);
        let container: HTMLElement = document.querySelector("#" + elementId);
        let answer: HTMLElement = container.querySelector(".answer");
        //let question: HTMLElement = container.querySelector(".question");
        let openIndicator: HTMLElement = container.querySelector(".open-indicator");
        //question.classList.toggle("active");
        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
            openIndicator.innerHTML = "+";
        } else {
            answer.style.maxHeight = answer.scrollHeight + "px";
            openIndicator.innerHTML = "-";
        }

    }
}
