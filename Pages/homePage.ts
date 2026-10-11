import { Page, expect } from "@playwright/test";
import { APP_CONSTANTS } from "../appConstants";

/* Encapsulates the storefront home page (product catalog) */
export class HomePage {

	readonly page: Page;
	constructor(page: Page) {
		this.page = page;
	}

	readonly waits = APP_CONSTANTS.TIMEOUTS;

	selectors = {
		productName: '[data-test="product-name"]',
		outOfStockBadge: '[data-test="out-of-stock"]',
	};

	async verifyHomePageIsReached(): Promise<void> {
		// Resolved against baseURL (playwright.config.ts)
		await expect(this.page).toHaveURL("/");

		// List of tools (products) must be loaded for the page to be considered reached
		const productCards = this.page.locator(this.selectors.productName);
		await productCards.first().waitFor({ state: 'visible', timeout: this.waits.SHORT });
		await expect(productCards).not.toHaveCount(0);

		console.log(`✅ Home page reached: ${this.page.url()}`);
	}
}
