import { Page } from "@playwright/test";
import { UserKey, getUser } from "../Users";
import { HomePage } from "@pages/homePage";
import { ProductPage } from "@pages/productPage";
import { RentalsPage } from "@pages/rentalsPage";
import { LoginPage } from "@pages/loginPage";

/*  Created by each user fixture in fixtures.ts: holds that user's Page and builds page objects on demand,
    so a test never does `new HomePage(page)` itself and is not tied to one starting page.

        pageManager_AdminUser.homePage()      -> new HomePage(page)
        pageManager_AdminUser.productPage()   -> new ProductPage(page)
        pageManager_AdminUser.rentalsPage()   -> new RentalsPage(page)
        pageManager_AdminUser.loginPage()     -> new LoginPage(page)

    Every page object built from the same manager shares the same Page, i.e. the same logged-in user.
*/
export class PageManager {

	readonly page: Page;
	private readonly userKey: UserKey;

	constructor(page: Page, userKey: UserKey) {
		this.page = page;
		this.userKey = userKey;
	}

	homePage(): HomePage {
		return new HomePage(this.page);
	}

	productPage(): ProductPage {
		return new ProductPage(this.page);
	}

	rentalsPage(): RentalsPage {
		return new RentalsPage(this.page);
	}

	loginPage(): LoginPage {
		return new LoginPage(this.page);
	}

	/*  Session guard for when the saved session has expired mid-run: protected pages redirect to /auth/login.
	    No-op while the user is still logged in. Lives here (not in BasePage) because it needs LoginPage,
	    and LoginPage extends BasePage - importing it into BasePage would be a circular import.
	*/
	async ensureAuthenticated(): Promise<void> {
		if (!this.loginPage().isOnLoginPage()) {
			return;
		}
		console.warn(`Session expired, re-authenticating as ${this.userKey}`);

		/* The JWT lives in localStorage, so clear it along with the cookies to avoid a stale-token loop */
		await this.page.context().clearCookies();
		await this.page.evaluate(() => localStorage.clear());
		await this.page.goto("/auth/login");
		await this.loginPage().handleLogin(this.userKey);

		/* Persist the fresh session so the next tests reuse it */
		await this.page.context().storageState({ path: getUser(this.userKey).path, indexedDB: true });
	}
}
