import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "@pages/basePage";
import type { RentalItem } from "@interfaces/rentalItem";
import { normalizeText } from "@helpers/textUtils";

/* Encapsulates the rentals page (list of rentable equipment) */
export class RentalsPage extends BasePage {

	constructor(page: Page) {
		super(page);
	}

	selectors = {
		rentalCard: '.card',
		cardTitle: '.card-title',
		cardText: '.card-text',
	};

	async verifyRentalsPageIsReached(): Promise<void> {
		// Resolved against baseURL (playwright.config.ts)
		await expect(this.page).toHaveURL("/rentals");
		await this.page.locator(this.selectors.cardTitle).first().waitFor({ state: 'visible', timeout: this.waits.SHORT });

		console.log(`✅ Rentals page reached. URL now: ${this.page.url()}`);
	}

	async verifyRentalCard(item: RentalItem): Promise<void> {
		const card: Locator = this.page
			.locator(this.selectors.rentalCard)
			.filter({ has: this.page.locator(this.selectors.cardTitle).getByText(item.title, { exact: true }) });

		await expect(card.locator(this.selectors.cardTitle)).toHaveText(item.title);
		await expect(card.locator(this.selectors.cardText)).toHaveText(normalizeText(item.description));
		console.log(`✅ Rental verified: ${item.title}`);
	}
}
