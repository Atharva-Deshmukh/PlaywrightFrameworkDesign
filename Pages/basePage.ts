import { Page } from "@playwright/test";
import { APP_CONSTANTS } from "@constants/appConstants";

/*  Common members shared by every page object.
    Deliberately does NOT import fragments (e.g. Navbar): Navbar -> HomePage -> BasePage would form a circular import.
    Pages that need a fragment create it themselves.
*/
export abstract class BasePage {

	readonly page: Page;
	readonly waits = APP_CONSTANTS.TIMEOUTS;

	constructor(page: Page) {
		this.page = page;
	}
}
