import { Page, Locator } from "@playwright/test";
import { APP_CONSTANTS } from "@constants/appConstants";

/* Encapsulates the "Show live shop activity" widget (live sales stream), shared across all pages.
   Plain class (extends nothing, imports no page) so BasePage can expose it without a circular import. */
export class LiveActivity {

	readonly page: Page;
	readonly waits = APP_CONSTANTS.TIMEOUTS;

	constructor(page: Page) {
		this.page = page;
	}

	private readonly selectors = {
		toggleButton: '[data-test="live-activity-toggle"]',
		activityWindow: '[data-test="live-activity-window"]',
		closeButton: '[data-test="live-activity-close"]',
		salesCount: '[data-test="live-activity-count"]',
		revenue: '[data-test="live-activity-revenue"]',
		activityItem: '[data-test="live-activity-item"]',
		clearButton: '[data-test="live-activity-clear"]',
	};

	get activityWindow(): Locator {
		return this.page.locator(this.selectors.activityWindow);
	}

	get activityItems(): Locator {
		return this.page.locator(this.selectors.activityItem);
	}

	// The same toggle button opens and closes the window (its aria-label flips Show/Hide)
	async open(): Promise<void> {
		if (await this.activityWindow.isVisible()) return;
		await this.page.locator(this.selectors.toggleButton).click();
		await this.activityWindow.waitFor({ state: 'visible', timeout: this.waits.SHORT });
		console.log("✅ Opened live shop activity");
	}

	async close(): Promise<void> {
		await this.page.locator(this.selectors.closeButton).click();
		await this.activityWindow.waitFor({ state: 'hidden', timeout: this.waits.SHORT });
		console.log("✅ Closed live shop activity");
	}

	async clear(): Promise<void> {
		await this.page.locator(this.selectors.clearButton).click();
		console.log("✅ Cleared live shop activity");
	}

	async getSalesCount(): Promise<number> {
		return Number((await this.page.locator(this.selectors.salesCount).innerText()).trim());
	}

	async getRevenueText(): Promise<string> {
		return (await this.page.locator(this.selectors.revenue).innerText()).trim();
	}
}
