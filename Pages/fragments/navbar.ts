import { Page, expect } from "@playwright/test";
import { APP_CONSTANTS } from "../../appConstants";
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
		categoriesButton: '[data-test="nav-categories"]',
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

	// Confirms the navbar still shows the given user's exact display name (e.g. after restoring a saved session)
	async verifyLoggedInAs(displayName: string): Promise<void> {
		await expect(this.page.locator(this.selectors.userMenuButton)).toHaveText(displayName);
		console.log(`✅ Confirmed logged in as: ${displayName}`);
	}
}
