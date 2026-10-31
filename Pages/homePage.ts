import { Page, Locator, expect } from "@playwright/test";
import { APP_CONSTANTS } from "@constants/appConstants";

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
		checkBoxLocator: '[type="checkbox"]',
		ecoFriendlyCheckbox: '[data-test="eco-friendly-filter"]',
		individualProductCard: '.card',
		ecoBadge: '[data-test="eco-badge"]',
	};

	async verifyHomePageIsReached(): Promise<void> {
		// Resolved against baseURL (playwright.config.ts)
		await expect(this.page).toHaveURL("/");

		// List of tools (products) must be loaded for the page to be considered reached
		const productCards: Locator = this.page.locator(this.selectors.productName).first();
		await productCards.waitFor({ state: 'visible', timeout: this.waits.SHORT });
		await expect(productCards).not.toHaveCount(0);

		console.log(`✅ Home page reached. URL now: ${this.page.url()}`);
	}

	async clickCategoryCheckbox(categoryLabel: string): Promise<void> {
		const checkbox: Locator = this.page
			.locator('label')
			.filter({ hasText: categoryLabel })
			.locator(this.selectors.checkBoxLocator);

		await this.clickCheckBoxAndWaitForProductsToLoad(checkbox);
		console.log(`✅ Clicked checkbox for category: ${categoryLabel}`);
	}

	async clickEcoFriendlyFilter(): Promise<void> {
		const checkbox: Locator = this.page.locator(this.selectors.ecoFriendlyCheckbox);

		await this.clickCheckBoxAndWaitForProductsToLoad(checkbox);
		console.log("✅ Toggled eco-friendly filter");
	}

	/* Clicks checkbox and waits for the product grid to refresh by inspecting on a network call.
	   The listener must be armed before the click, otherwise the /products response (which can
	   resolve in well under a second) may arrive before we start watching for it.
	*/
	private async clickCheckBoxAndWaitForProductsToLoad(checkbox: Locator): Promise<void> {

		const UrlPatternToWait: RegExp = /\/products(\?|$)/;

		/* Start listening before clicking: Playwright registers the network listener here, and it
		   is live and watching every response that flows through the page's network layer from
		   this point on - so the response caught below is guaranteed to be the one this click
		   triggers, not an earlier, already-resolved /products call.
		*/
		const responsePromise = this.page.waitForResponse(
			res => UrlPatternToWait.test(res.url()) && res.status() === 200,
			{ timeout: this.waits.SHORT }
		);

		await checkbox.click();

		/* Doesn't initiate anything new - just pauses until the promise armed above (which may
		   have already resolved, or may still be in flight) settles and hands back the response
		*/
		await responsePromise;
	}
}