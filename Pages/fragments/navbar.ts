import { Page, expect } from "@playwright/test";
import { APP_CONSTANTS } from "@constants/appConstants";

/* Encapsulates the top navigation bar, shared across all pages.
   Plain class (extends nothing, imports no page) so BasePage can expose it without a circular import. */
export class Navbar {

	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	readonly waits = APP_CONSTANTS.TIMEOUTS;

	private readonly selectors = {
		homeLink: '[data-test="nav-home"]',
		logoLink: 'a.navbar-brand', // the logo has no data-test attribute
		categoriesButton: '[data-test="nav-categories"]',
		rentalsLink: '[data-test="nav-rentals"]',
		contactLink: '[data-test="nav-contact"]',
		signInLink: '[data-test="nav-sign-in"]',
		userMenuButton: '[data-test="nav-menu"]',
		signOutLink: '[data-test="nav-sign-out"]',
	};

	// Callers verify the destination page themselves (e.g. HomePage.verifyHomePageIsReached())
	async clickHome(): Promise<void> {
		await this.page.locator(this.selectors.homeLink).waitFor({ state: 'visible', timeout: this.waits.SHORT });
		await this.page.locator(this.selectors.homeLink).click({ force: true });
		console.log("✅ Clicked Home from navbar");
	}

	async openContact(): Promise<void> {
		await this.page.locator(this.selectors.contactLink).click();
		console.log("✅ Opened Contact from navbar");
	}

	async clickSignIn(): Promise<void> {
		await this.page.locator(this.selectors.signInLink).click();
		console.log("✅ Clicked Sign in from navbar");
	}

	async clickLogo(): Promise<void> {
		await this.page.locator(this.selectors.logoLink).click();
		console.log("✅ Clicked logo from navbar");
	}

	async openRentals(): Promise<void> {
		await this.page.locator(this.selectors.categoriesButton).click();
		await this.page.locator(this.selectors.rentalsLink).click();
		console.log("✅ Opened Rentals from Categories menu");
	}

	// Confirms the navbar still shows the given user's exact display name (e.g. after restoring a saved session)
	async verifyLoggedInAs(displayName: string): Promise<void> {
		try {
			await expect(this.page.locator(this.selectors.userMenuButton)).toHaveText(displayName);
			console.log(`✅ User: ${displayName} is visible in navbar`);
		} catch (error) {
			console.log(`❌ User: ${displayName} is not visible in navbar`);
			throw error;
		}
	}
}
