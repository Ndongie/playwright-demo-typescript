import { test as base, Page } from '@playwright/test';
import { logger } from '../../utils/logger';
import HomePage from '../../pages/HomePage';

logger.info('🔧 test-hooks.ts is being loaded and executed');

export const test = base.extend<{
    homePage: HomePage;
    autoSetup: void;
}>({
    // HomePage fixture - provides HomePage instance to tests
    homePage: async ({ page, baseURL }, use) => {
        logger.info('🏠 Initializing HomePage');
        //page.context().newPage();
        const homePage = new HomePage(page);
        
        // Navigate to base URL when homepage is requested
        const currentURL = page.url();
        if (baseURL) {
            logger.info(`🌐 Navigating from ${currentURL} to base URL: ${baseURL}`);
            await page.goto(baseURL);
            await page.waitForSelector('body', { state: 'visible' });
            logger.info('✅ Base URL navigation completed');
        }
        
        // Provide the HomePage instance to tests
        await use(homePage);
        
        logger.info('✅ HomePage fixture completed');
        
    },

    // Auto setup fixture - runs automatically for setup/teardown
    autoSetup: [async ({ page }, use) => {
        logger.info('🔄 BEFORE TEST: Running automatic setup');
        logger.info('🚀 Test is starting with custom setup');
        
        // Execute the test
        await use();
        
        // Cleanup actions
        logger.info('🏁 AFTER TEST: Running automatic cleanup');
        //page.context().close();
        logger.info('✅ Test completed with cleanup');
    }, { auto: true }],
});

logger.info('✅ test-hooks.ts loaded successfully');
export { expect } from '@playwright/test';