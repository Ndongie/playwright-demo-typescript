import Helpers from "../utils/helpers";
import { logger } from "../utils/logger";
import { Page } from "@playwright/test";

export default class LoginPage {
    private page: Page;
    private usernameField = "#loginusername";
    private passwordField = "#loginpassword";
    private loginButton = "button[onclick='logIn()']";

    constructor(page: Page) {
        this.page = page;
    }

    async login(username: string, password: string): Promise<string> {
        logger.info(`Logging in user: ${username}`);
        
        // Set up dialog listener
        const dialogPromise = Helpers.setDialogListener(this.page);

        // Perform login actions
        await this.page.locator(this.usernameField).fill(username);
        await this.page.locator(this.passwordField).fill(password);
        await this.page.locator(this.loginButton).click();

        // Wait for dialog with timeout
        const result = await Helpers.waitForDialog(dialogPromise, this.page);
        return result;
    }
}