import { Page, Expect} from "@playwright/test";
import {logger} from "../utils/logger";
import {WaitStrategies} from "../utils/wait-strategies";
import Helpers from "../utils/helpers";

export default class CartPage{
    private page:Page;
    private products:string = "xpath=//tbody/tr/td[2]";
    private orderButton = "xpath=//button[@data-target='#orderModal']";
    private nameField = "css=#name";
    private countryField = "css=#country";
    private cityField = "css=#city";
    private cardField = "css=#card";
    private monthField = "css=#month";
    private yearField = "css=#year";
    private purchaseButton = "xpath=//button[@onclick='purchaseOrder()']";
    private successMessage = ".sweet-alert h2";
    
    constructor(page:Page){
        this.page = page;
    }

    async checkProduct(productName:string):Promise<boolean>{
        logger.info(`Checking if ${productName} is in the cart`)

        let result = false;
        const currentProducts = await Helpers.getProducts(this.page.locator(this.products));
        if(currentProducts.includes(productName)){
            result = true;
            logger.info(`${productName} found in the cart`);
        }

        return result;
    }

    async orderProduct(customerName:string,
        customerCardNumber:string,
        customerCountry?:string,
        customerCity?:string,
        month?:number,
        year?:number
    ):Promise<string>{
        logger.info(`Ordering product for ${customerName}...`);

        const dialogPromise = Helpers.setDialogListener(this.page);
        await this.page.locator(this.orderButton).click(); // Click the order button
        await this.page.locator(this.nameField).fill(customerName); // Enter the customer name
        await this.page.locator(this.cardField).fill(customerCardNumber); // Enter the customer credit card number
        await this.page.locator(this.purchaseButton).click(); // click the purchase button
        
        const result = await Helpers.waitForDialog(dialogPromise, this.page);
        return result;
    }

    async getOrderMessage(): Promise<string>{
        logger.info("Getting the message for a successful order");
        const message: string = await this.page.locator(this.successMessage).textContent().then((text) => {
            if(text !== null){
                return text.trim();
            }
            else{
                return "";
            }
        });

        logger.info(`Message found ${message}`);
        return message;
    }
}