import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "@pages/basePage";
import type { ProductDetails } from "@interfaces/productDetails";
import { normalizeText, parsePrice, exactTextPattern } from "@helpers/textUtils";

/* Encapsulates a single product's detail page (/product/<id>).
   Every product shares this layout (image, name, tags, price, CO2 rating, description, quantity + cart buttons,
   specifications, related products); only the values change, so tests pass the expected values in.
*/
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
		co2Rating: '[data-test="co2-rating-badge"]',
		description: '[data-test="product-description"]',
		decreaseQuantity: '[data-test="decrease-quantity"]',
		quantityInput: '[data-test="quantity"]',
		increaseQuantity: '[data-test="increase-quantity"]',
		addToCart: '[data-test="add-to-cart"]',
		addToFavorites: '[data-test="add-to-favorites"]',
		addToCompare: '[data-test="add-to-compare"]',
		specsTitle: '[data-test="specs-title"]',
		specsTable: '[data-test="product-specs"]',
		specRow: '[data-test="spec-row"]',
		relatedProductName: 'a.card .card-title',
	};

	async verifyProductPageIsReached(): Promise<void> {
		// A product id (ULID) must follow /product/
		await expect(this.page).toHaveURL(/\/product\/[0-9A-Z]+$/);
		await expect(this.page.locator(this.selectors.productName)).toBeVisible({ timeout: this.waits.MEDIUM });

		console.log(`✅ Product page reached. URL now: ${this.page.url()}`);
	}

	/* Presence of every section all product pages share, whatever the product */
	async verifyProductDetailsLayout(): Promise<void> {
		const s = this.selectors;
		await this.verifyProductImageLoaded();

		const sections: Array<[string, Locator]> = [
			['product name', this.page.locator(s.productName)],
			['tags', this.page.locator(s.badge).first()],
			['price', this.page.locator(s.unitPrice)],
			['CO2 rating', this.page.locator(s.co2Rating)],
			['description', this.page.locator(s.description)],
			['decrease quantity button', this.page.locator(s.decreaseQuantity)],
			['quantity input', this.page.locator(s.quantityInput)],
			['increase quantity button', this.page.locator(s.increaseQuantity)],
			['add to cart button', this.page.locator(s.addToCart)],
			['add to favourites button', this.page.locator(s.addToFavorites)],
			['compare button', this.page.locator(s.addToCompare)],
			['specifications title', this.page.locator(s.specsTitle)],
			['specifications table', this.page.locator(s.specsTable)],
			['a specification row', this.page.locator(s.specRow).first()],
			['related products heading', this.page.getByRole('heading', { name: 'Related products' })],
			['a related product', this.page.locator(s.relatedProductName).first()],
		];

		for (const [label, locator] of sections) {
			await expect(locator, `${label} not shown on the product page`).toBeVisible();
		}
		console.log("✅ Product details layout verified");
	}

	/* Layout first, then only the values the caller passed */
	async verifyProductDetails(expected: ProductDetails = {}): Promise<void> {
		await this.verifyProductDetailsLayout();

		if (expected.name !== undefined) {
			await expect(this.page.locator(this.selectors.productName)).toHaveText(expected.name);
		}
		if (expected.price !== undefined) {
			await expect.poll(() => this.getUnitPrice(), { message: 'unit price differs' }).toBe(expected.price);
		}
		for (const tag of expected.tags ?? []) {
			const tagBadge: Locator = this.page.locator(this.selectors.badge).filter({ hasText: exactTextPattern(tag) });
			await expect(tagBadge, `tag "${tag}" not shown`).toBeVisible();
		}
		if (expected.quantity !== undefined) {
			await expect(this.page.locator(this.selectors.quantityInput)).toHaveValue(String(expected.quantity));
		}
		console.log(`✅ Product details verified: ${JSON.stringify(expected)}`);
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
