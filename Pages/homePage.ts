import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "@pages/basePage";
import { SortField, SortDirection } from "@constants/sortOptions";
import type { SortOption } from "@interfaces/sortOption";
import { Co2Rating, co2RatingRank, toCo2Rating } from "@constants/co2Rating";
import { normalizeText, parsePrice } from "@helpers/textUtils";

/* Encapsulates the storefront home page (product catalog) */
export class HomePage extends BasePage {

	constructor(page: Page) {
		super(page);
	}

	selectors = {
		productName: '[data-test="product-name"]',
		outOfStockBadge: '[data-test="out-of-stock"]',
		checkBoxLocator: '[type="checkbox"]',
		ecoFriendlyCheckbox: '[data-test="eco-friendly-filter"]',
		individualProductCard: '.card',
		ecoBadge: '[data-test="eco-badge"]',
		productPrice: '[data-test="product-price"]',
		activeCo2Letter: '[data-test="co2-rating-badge"] .co2-letter.active',
		sortDropdown: '[data-test="sort"]',
		sortCompleted: '[data-test="sorting_completed"]',
		searchInput: '[data-test="search-query"]',
		searchSubmit: '[data-test="search-submit"]',
		searchCompleted: '[data-test="search_completed"]',
		searchCaption: '[data-test="search-caption"]',
	};

	/*  Restoring storageState only pre-loads cookies and localStorage into a new 
        context. context.newPage() still gives you about:blank, and nothing opens the app for you.
    */
	async navigateToHome(): Promise<void> {
		await this.page.goto('/');
		await this.verifyHomePageIsReached();
	}

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

	/* The products API is called with the HTTP QUERY method and a JSON body (e.g. {"sort":"name,asc"}),
	   so the URL alone can't tell calls apart - the body is inspected as well.
	   Must be called BEFORE the action that triggers the request (see clickCheckBoxAndWaitForProductsToLoad).
	*/
	private waitForApiResponse(urlPattern: RegExp, bodyMatches: (body: Record<string, unknown>) => boolean) {
		return this.page.waitForResponse(
			res => {
				if (!urlPattern.test(res.url()) || res.status() !== 200) {
					return false;
				}
				try {
					return bodyMatches(JSON.parse(res.request().postData() ?? '{}'));
				} catch {
					return false;
				}
			},
			{ timeout: this.waits.SHORT }
		);
	}

	/* Selects the option in the sort dropdown and waits for the /products response carrying that sort.
	   Note: re-selecting the already active option fires no request, so this would time out.
	*/
	async sortBy(option: SortOption): Promise<void> {
		const responsePromise = this.waitForApiResponse(/\/products$/, body => body.sort === option.value);

		await this.page.locator(this.selectors.sortDropdown).selectOption({ value: option.value });
		await responsePromise;

		await expect(this.page.locator(this.selectors.sortCompleted)).toBeVisible();
		console.log(`✅ Sorted by: ${option.label}`);
	}

	async getProductCardCount(): Promise<number> {
		return this.page.locator(this.selectors.individualProductCard).count();
	}

	async getProductNames(): Promise<string[]> {
		const names: string[] = await this.page
			.locator(this.selectors.individualProductCard)
			.locator(this.selectors.productName)
			.allTextContents();
		return names.map(normalizeText);
	}

	async getProductPrices(): Promise<number[]> {
		const prices: string[] = await this.page
			.locator(this.selectors.individualProductCard)
			.locator(this.selectors.productPrice)
			.allTextContents();
		return prices.map(parsePrice);
	}

	async getProductCo2Ratings(): Promise<Co2Rating[]> {
		const cardCount: number = await this.getProductCardCount();
		const letters: string[] = await this.page
			.locator(this.selectors.individualProductCard)
			.locator(this.selectors.activeCo2Letter)
			.allTextContents();

		// Exactly one active letter per card, otherwise ratings would silently shift against names/prices
		expect(letters, 'every product card must have exactly one active CO₂ rating').toHaveLength(cardCount);
		return letters.map(toCo2Rating);
	}

	/* Values of the sorted-on field for every card on the current page, in display order.
	   Strings are lower-cased (the API sorts case-insensitively) and ratings become their rank (A=0 ... E=4).
	*/
	private async getSortKeys(field: SortField): Promise<Array<string | number>> {
		switch (field) {
			case SortField.NAME:
				return (await this.getProductNames()).map(name => name.toLowerCase());
			case SortField.PRICE:
				return this.getProductPrices();
			case SortField.CO2_RATING:
				return (await this.getProductCo2Ratings()).map(co2RatingRank);
			default:
				throw new Error(`Unsupported sort field: ${field}`);
		}
	}

	/* Verifies the cards currently on the page follow the given sort order.
	   Ties (e.g. equal prices or ratings) are allowed in any order, hence "sorted" rather than strictly ordered.
	   Retried via toPass because the cards re-render a moment after the API response arrives.
	*/
	async verifyProductsSortedBy(option: SortOption): Promise<void> {
		await expect(async () => {
			const actual: Array<string | number> = await this.getSortKeys(option.field);
			expect(actual.length, 'no product cards rendered').toBeGreaterThan(0);

			const direction: number = option.direction === SortDirection.ASC ? 1 : -1;
			const expected: Array<string | number> = [...actual].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0) * direction);

			expect(actual, `cards are not sorted by "${option.label}"`).toEqual(expected);
		}).toPass({ timeout: this.waits.MEDIUM });

		console.log(`✅ Cards are sorted by: ${option.label}`);
	}

	/* Types the term in the search bar, submits, and waits for the /products/search response */
	async searchFor(term: string): Promise<void> {
		await this.page.locator(this.selectors.searchInput).fill(term);

		const responsePromise = this.waitForApiResponse(/\/products\/search$/, body => body.q === term);
		await this.page.locator(this.selectors.searchSubmit).click();
		await responsePromise;

		await expect(this.page.locator(this.selectors.searchCompleted)).toBeVisible();
		console.log(`✅ Searched for: ${term}`);
	}

	/* Every card on the page must have the term in its name, which proves the search really filtered the catalog */
	async verifySearchResultsContain(term: string): Promise<void> {
		await expect(this.page.locator(this.selectors.searchCaption)).toHaveText(`Searched for: ${term}`);

		await expect(async () => {
			const names: string[] = await this.getProductNames();
			expect(names.length, 'search returned no product cards').toBeGreaterThan(0);

			const offenders: string[] = names.filter(name => !name.toLowerCase().includes(term.toLowerCase()));
			expect(offenders, `product names not containing "${term}"`).toEqual([]);
		}).toPass({ timeout: this.waits.MEDIUM });

		console.log(`✅ All search results contain: ${term}`);
	}

	/* Name and price exactly as shown on the card at the given index, to compare against the product page later */
	async getProductCardSummary(index: number): Promise<{ name: string; price: number }> {
		const card: Locator = this.page.locator(this.selectors.individualProductCard).nth(index);
		return {
			name: normalizeText(await card.locator(this.selectors.productName).innerText()),
			price: parsePrice(await card.locator(this.selectors.productPrice).innerText()),
		};
	}

	async openProductCard(index: number): Promise<void> {
		await this.page.locator(this.selectors.individualProductCard).nth(index).click();
	}
}