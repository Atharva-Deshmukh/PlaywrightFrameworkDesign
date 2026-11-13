import { Page, expect } from "@playwright/test";
import { APP_CONSTANTS } from "../../constants/appConstants";
import { HomePage } from "../homePage";

/* Encapsulates the top navigation bar, shared across all pages */
export class Navbar {

	readonly page: Page;
	readonly homePage: HomePage;

	constructor(page: Page) {
		this.page = page;
		this.homePage = new HomePage(page);
	}

	readonly waits = APP_CONSTANTS.TIMEOUTS;

	selectors = {
		homeLink: '[data-test="nav-home"]',
		logoLink: 'a.navbar-brand', // the logo has no data-test attribute
		categoriesButton: '[data-test="nav-categories"]',
		rentalsLink: '[data-test="nav-rentals"]',
		contactLink: '[data-test="nav-contact"]',
		userMenuButton: '[data-test="nav-menu"]',
		signOutLink: '[data-test="nav-sign-out"]',
	};

	async clickHome(): Promise<void> {
		await this.page.locator(this.selectors.homeLink).waitFor({ state: 'visible', timeout: this.waits.SHORT });
		await this.page.locator(this.selectors.homeLink).click({ force: true });
		console.log("✅ Clicked Home from navbar");

		await this.homePage.verifyHomePageIsReached();
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
