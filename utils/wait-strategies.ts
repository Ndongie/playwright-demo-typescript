import { Locator, expect } from '@playwright/test';
import { logger } from './logger';

export class WaitStrategies {
    /**
     * Wait for all elements matching the locator to be available and visible
     */
    static async waitForAllElements(
        locator: Locator, 
        minCount?: number, 
        maxCount?: number,
        timeout = 10000
    ): Promise<Locator[]> {
        const startTime = Date.now();
        let count: number = 0;
        
        try {
            // Wait for at least one element to be attached
            await locator.first().waitFor({ state: 'attached', timeout });
            count = await locator.count();
            
            if (minCount !== undefined && maxCount !== undefined) {
                // Wait for for count to be greater than or equal to minimum and less than or equal to the maximum
                expect(count).toBeGreaterThanOrEqual(minCount);
                expect(count).toBeLessThanOrEqual(maxCount);
            }
            else if(minCount !== undefined && maxCount == undefined){
                // Wait for for count to be greater than or equal to minimum
                expect(count).toBeGreaterThanOrEqual(minCount);
            }
            else if(minCount == undefined && maxCount !== undefined){
                // Wait for for count to be less than or equal to maximum
                expect(count).toBeLessThanOrEqual(maxCount);
            }
            else {
                // Wait for elements to stabilize (no changes for 1 second)
                await this.waitForStableElementCount(locator, timeout);
            }
            
            // Wait for all elements to be visible
            const elements = await locator.all();
            await Promise.all(
                elements.map(element => 
                    element.waitFor({ state: 'visible', timeout: Math.max(1000, timeout - (Date.now() - startTime)) })
                )
            );
            
            return elements;
            
        } catch (error: any) {
            const currentCount = await locator.count();
            throw new Error(
                `Failed to wait for elements. Expected: ${count || 'stable count'}, ` +
                `Found: ${currentCount}. Error: ${error.message}`
            );
        }
    }
    
    /**
     * Wait for element count to stabilize
     */
    private static async waitForStableElementCount(locator: Locator, timeout = 20000): Promise<void> {
        let stableCount: number | null = null;
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            const currentCount = await locator.count();
            
            if (stableCount === currentCount) {
                // Count remained the same for 1 second, consider it stable
                return;
            }
            
            stableCount = currentCount;
            await locator.page().waitForTimeout(1000);
        }
        
        throw new Error(`Element count did not stabilize within ${timeout}ms`);
    }
    
    /**
     * Wait for all elements to have specific attribute or text
     */
    static async waitForAllElementsToHaveText(
        locator: Locator, 
        expectedCount: number,
        timeout = 10000
    ): Promise<void> {
        await this.waitForAllElements(locator, expectedCount, timeout);
        
        // Get the selector string safely using toString()
        const selectorString = locator.toString();
        
        await locator.page().waitForFunction(
            ({ selector, count }) => {
                const elements = document.querySelectorAll(selector);
                if (elements.length !== count) return false;
                
                return Array.from(elements).every(el => 
                    el.textContent && el.textContent.trim().length > 0
                );
            },
            { selector: selectorString, count: expectedCount },
            { timeout }
        );
    }
}