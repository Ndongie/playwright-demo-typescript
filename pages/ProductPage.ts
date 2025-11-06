import { Page } from "@playwright/test";
import {logger} from "../utils/logger";
import CartPage from "./CartPage";
import Helpers from "../utils/helpers";

export default class ProductPage{
    private page:Page;
    private productTitle = "css=#tbodyid h2";
    private productPrice = "css=#tbodyid h3";
    private addToCartButton = "xpath=//div[@class='row']/div/a";
    private cartMenu = "css=#cartur";

    constructor(page:Page){
        this.page = page;
    }

    async getProductTitle():Promise<string>{
        logger.info(`Getting the title of the product...`)
        const title = await this.page.locator(this.productTitle).textContent().then((text) => {
            if(text !== null){
                return text.trim();
            }
            else{
                return "";
            }
        });

        logger.info(`Product title found: ${title}`);
        return title;
    }

    async addToCart(productName:string): Promise<string>{
        logger.info(`Adding ${productName} to cart...`);
   
        // Set up dialog listener
        const dialogPromise = Helpers.setDialogListener(this.page);
        await this.page.locator(this.addToCartButton).click();
        const result = await Helpers.waitForDialog(dialogPromise, this.page);
        logger.info(`${productName} successfully added to cart`);
        return result;
    }

    async gotoCart():Promise<CartPage>{
        logger.info(`Going to the cart. Clicking the cart menu.....`);
        await this.page.locator(this.cartMenu).click();
        logger.info("Cart menu successfully clicked");
        return new CartPage(this.page);
    }
}