import { Page, Locator } from "@playwright/test";
import { APP_CONSTANTS } from "@constants/appConstants";

export type ChatAction = 'find-product' | 'order-product' | 'start-checkout' | 'support-ticket';

/* Encapsulates the "Open chat" assistant, shared across all pages.
   Plain class (extends nothing, imports no page) so BasePage can expose it without a circular import. */
export class ChatWidget {

	readonly page: Page;
	readonly waits = APP_CONSTANTS.TIMEOUTS;

	constructor(page: Page) {

		/* 
		  TypeScript allows a readonly property to be assigned in two places: at its declaration, 
		  and inside the constructor of the same class. 
		  Anywhere else, assignment is a compile error.
		*/
		this.page = page;
	}

	private readonly selectors = {
		toggleButton: '[data-test="chat-toggle"]',
		chatWindow: '[data-test="chat-window"]',
		closeButton: '[data-test="chat-close"]',
	};

	/* For static values like Locators, there is no promise involved, hence use getter
	   instead of async function
	*/
	get chatWindow(): Locator {
		return this.page.locator(this.selectors.chatWindow);
	}

	// The chatbot icon, used to toggle, disappears while the chat window is open, only close button can be used to hide this
	async open(): Promise<void> {
		await this.page.locator(this.selectors.toggleButton).click();
		await this.chatWindow.waitFor({ state: 'visible', timeout: this.waits.SHORT });
		console.log("✅ Opened chat");
	}

	async close(): Promise<void> {
		await this.page.locator(this.selectors.closeButton).click();
		await this.chatWindow.waitFor({ state: 'hidden', timeout: this.waits.SHORT });
		console.log("✅ Closed chat");
	}

	async selectAction(action: ChatAction): Promise<void> {
		await this.page.locator(`[data-test="chat-action-${action}"]`).click();
		console.log(`✅ Selected chat action: ${action}`);
	}
}
