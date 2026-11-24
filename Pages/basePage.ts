import { Page } from "@playwright/test";
import { APP_CONSTANTS } from "@constants/appConstants";
import { Navbar } from "@pages/fragments/navbar";
import { TopBanner } from "@pages/fragments/topBanner";
import { Footer } from "@pages/fragments/footer";
import { ChatWidget } from "@pages/fragments/chatWidget";
import { LiveActivity } from "@pages/fragments/liveActivity";

/*  Common members shared by every page object.
    Fragments are exposed as lazy getters: each is built on first use, so pages pay nothing for the ones they skip.
    Fragments must stay plain classes that never import a page, otherwise BasePage <-> page would form a circular import.
*/
export abstract class BasePage {

	readonly page: Page;
	readonly waits = APP_CONSTANTS.TIMEOUTS;

	private _navbar?: Navbar;
	private _topBanner?: TopBanner;
	private _footer?: Footer;
	private _chatWidget?: ChatWidget;
	private _liveActivity?: LiveActivity;

	constructor(page: Page) {
		this.page = page;
	}

	get navbar(): Navbar {
		return this._navbar ??= new Navbar(this.page);
	}

	get topBanner(): TopBanner {
		return this._topBanner ??= new TopBanner(this.page);
	}

	get footer(): Footer {
		return this._footer ??= new Footer(this.page);
	}

	get chatWidget(): ChatWidget {
		return this._chatWidget ??= new ChatWidget(this.page);
	}

	get liveActivity(): LiveActivity {
		return this._liveActivity ??= new LiveActivity(this.page);
	}

	/* True when the app has bounced the user to the login page (expired/invalid session) */
	isOnLoginPage(): boolean {
		return this.page.url().includes("/auth/login");
	}

	/* Returns to the storefront by clicking the logo. It cannot verify the home page itself because
	   BasePage must not import HomePage (HomePage extends BasePage), so callers verify it.
	*/
	async goHomeViaLogo(): Promise<void> {
		await this.navbar.clickLogo();
	}
}
