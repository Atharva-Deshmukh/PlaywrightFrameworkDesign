import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "@pages/basePage";
import { normalizeText, parsePrice } from "@helpers/textUtils";

/* Encapsulates a single product's detail page (/product/<id>) */
export class ProductPage extends BasePage {

	constructor(page: Page) {
		super(page);
	}

	/* The detail page reuses data-test="product-name" from the home page cards, hence the h1 scope.
	   The only `a.card` elements on this page are the related-product tiles.
	*/
	selectors = {
		productName: 'h1[data-test="product-name"]',
		unitPrice: '[data-test="unit-price"]',
		productImage: 'img.figure-img',
		badge: 'span.badge',
		relatedProductName: 'a.card .card-title',
	};

	async verifyProductPageIsReached(): Promise<void> {
		// A product id (ULID) must follow /product/
		await expect(this.page).toHaveURL(/\/product\/[0-9A-Z]+$/);
		await expect(this.page.locator(this.selectors.productName)).toBeVisible({ timeout: this.waits.MEDIUM });

		console.log(`✅ Product page reached. URL now: ${this.page.url()}`);
	}

	async getProductName(): Promise<string> {
		return normalizeText(await this.page.locator(this.selectors.productName).innerText());
	}

	async getUnitPrice(): Promise<number> {
		return parsePrice(await this.page.locator(this.selectors.unitPrice).innerText());
	}

	async verifyProductNameContains(text: string): Promise<void> {
		await expect(this.page.locator(this.selectors.productName)).toContainText(text, { ignoreCase: true });
	}

	/* Passes when any badge (category, brand, ...) contains the text */
	async verifyAnyBadgeContains(text: string): Promise<void> {
		const matchingBadge: Locator = this.page.locator(this.selectors.badge).filter({ hasText: text }).first();
		await expect(matchingBadge, `no badge containing "${text}"`).toBeVisible();
	}

	/* Not just present in the DOM: the file must have a src and must actually have been decoded by the browser */
	async verifyProductImageLoaded(): Promise<void> {
		const image: Locator = this.page.locator(this.selectors.productImage);

		await expect(image).toBeVisible();
		await expect(image).toHaveAttribute('src', /\S+/);
		await expect.poll(
			() => image.evaluate(el => (el as HTMLImageElement).naturalWidth),
			{ message: 'product image has not loaded (naturalWidth is 0)', timeout: this.waits.MEDIUM }
		).toBeGreaterThan(0);
	}

	async verifyRelatedProductsContain(text: string): Promise<void> {
		const relatedNames: Locator = this.page.locator(this.selectors.relatedProductName);
		await expect(relatedNames.first(), 'no related products rendered').toBeVisible({ timeout: this.waits.MEDIUM });

		const names: string[] = (await relatedNames.allTextContents()).map(normalizeText);
		const offenders: string[] = names.filter(name => !name.toLowerCase().includes(text.toLowerCase()));
		expect(offenders, `related products not containing "${text}"`).toEqual([]);
	}
}
