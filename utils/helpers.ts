import {logger} from "../utils/logger";
import { Locator, Page } from "@playwright/test";
import {WaitStrategies} from "../utils/wait-strategies";

export default class Helpers{

    static async getProducts(locator: Locator):Promise<string[]>{
           logger.info("Getting the list of products");
            
            const elements = await WaitStrategies.waitForAllElements(locator);
            
            const textPromises = elements.map(async (element) => {
                const text = await element.textContent();
                return text ? text.trim() : '';
            });
    
            const textArray = await Promise.all(textPromises);
            const listOfProducts = textArray.filter(text => text !== ''); // Remove empty strings
    
            logger.info(`Number of product: ${elements.length}`)
            logger.info(`List of products found: ${listOfProducts}`);
            return listOfProducts;
    }

    static async setDialogListener(page:Page): Promise<string>{
        logger.info("Setting up dialog listener")
        // Set up dialog listener
        return new Promise<string>((resolve) => {
            page.once('dialog', async (dialog) => {
                const message = dialog.message();
                logger.info(`Alert text found:${message}`);
                await dialog.dismiss();
                resolve(message);
            });
        });
    }

    static async waitForDialog(promise: Promise<string>, page:Page): Promise<string>{
         // Wait for dialog with timeout
        try {
            const alertMessage = await Promise.race([
                promise,
                new Promise<string>((_, reject) => 
                    setTimeout(() => reject(new Error('NO_ALERT')), 10000)
                )
            ]);
            return alertMessage;
        } catch (error) {
            // If no dialog. assume faillure
            await page.waitForTimeout(1000);
            logger.info(`No alert found: ${error}`);
            return "NO_ALERT";
        }
    }

}