import {logger} from "../utils/logger";
import Helpers from "../utils/helpers";
import {Page} from "@playwright/test";
import ProductPage from "./ProductPage";
import LoginPage from "./LoginPage";
import CartPage from "./CartPage";

export enum PRODUCT_CATEGORIES{
    "ALL",
    "PHONES",
    "LAPTOPS",
    "MONITORS"
};

export default class Homepage{
    private page: Page;
    private loginMenu = "css=#login2";
    private logoutButton = "css=#logout2";
    private carts = "css=.card";
    private categories = "css=a[id='itemc']";
    private products = "css=.card-block h4 a";
    private previuosButton = "css=#prev2";
    private nextButton = "xpath=//button[@id='next2'][1]";
    private cartMenu = "#cartur";

    constructor(page:Page){
        this.page = page;
        logger.info("Homepage successfully initialized");
    }
    
    async getProductsList(productCategory: PRODUCT_CATEGORIES): Promise<string[]>{
        logger.info(`Getting products in the category ${productCategory}`);
        let products:string[] = [];
        let currentProducts:string[]= [];

        switch(productCategory){
            case PRODUCT_CATEGORIES.ALL:
                currentProducts = await this.getProductsList(PRODUCT_CATEGORIES.PHONES);
                products.push(...currentProducts);

                currentProducts = await this.getProductsList(PRODUCT_CATEGORIES.LAPTOPS);
                products.push(...currentProducts);

                currentProducts = await this.getProductsList(PRODUCT_CATEGORIES.MONITORS);
                products.push(...currentProducts);
                break;

            case PRODUCT_CATEGORIES.PHONES:
                await this.page.locator(this.categories).nth(0).click();
                currentProducts = await Helpers.getProducts(this.page.locator(this.products));
                products.push(...currentProducts);
                break;

            case PRODUCT_CATEGORIES.LAPTOPS:
                await this.page.locator(this.categories).nth(1).click();
                currentProducts = await Helpers.getProducts(this.page.locator(this.products));
                products.push(...currentProducts);
                break;
                
            case PRODUCT_CATEGORIES.MONITORS:
                await this.page.locator(this.categories).nth(2).click();
                currentProducts = await Helpers.getProducts(this.page.locator(this.products));
                products.push(...currentProducts);
                break;    
        }
        
        return products;
       
    };

    async selectProduct(productName: string, PHONES: PRODUCT_CATEGORIES): Promise<ProductPage>{
        logger.info(`Selecting the product: ${productName}`);

        try {
            // Check if product exists and get its category and index under that category
            const categoriesArray = [PRODUCT_CATEGORIES.PHONES, PRODUCT_CATEGORIES.LAPTOPS, PRODUCT_CATEGORIES.MONITORS];

            //identify the category
            let productCategory: PRODUCT_CATEGORIES;
            for(let i=0; i < categoriesArray.length; i++){
                const products = await this.getProductsList(categoriesArray[i]);

                if(products.includes(productName)){
                    productCategory = categoriesArray[i];
                    logger.info(`Product: ${productName} found in category: ${productCategory}`);

                    //Identify the product under a given category and select it
                    let productIndex:number;
                    const categoryProducts = await this.getProductsList(productCategory);

                    for(let j=0; i<categoryProducts.length; j++){
                        const product = categoryProducts[j];

                        if(product.includes(productName)){
                            logger.info(`Product: ${productName} found in category: ${productCategory} at position: ${j}`);
                            logger.info(`Selecting the product`);
                            await this.page.locator(this.carts).nth(j).click();
                            logger.info(`${product} successfully selected`)
                        }
                        break;
                    }
                    break;
                }
            }
        } catch (error) {
            logger.warn(`${error}`);
        }

        return new ProductPage(this.page);
    }

    async clickLoginMenu():Promise<LoginPage>{
        logger.info("Clicking the login menu.....");
        await this.page.locator(this.loginMenu).click();
        logger.info("login menu successfully clicked");
        return new LoginPage(this.page);
    }

     async gotoCart():Promise<CartPage>{
            logger.info(`Going to the cart. Clicking the cart menu.....`);
            await this.page.locator(this.cartMenu).click();
            logger.info("Cart menu successfully clicked");
            return new CartPage(this.page);
    }
}