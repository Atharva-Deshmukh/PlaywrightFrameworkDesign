import { Page, Locator, expect } from "@playwright/test";
import { APP_CONSTANTS } from "@constants/appConstants";
import { normalizeText, exactTextPattern } from "@helpers/textUtils";

export type ChatAction = 'find-product' | 'order-product' | 'start-checkout' | 'support-ticket';

const CHAT_TITLE = 'Chat Assistant';
const GREETING = 'Hi! How can I help you today?';

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
		chatTitle: '.chat-title', // no data-test attribute
		botMessage: '.bot-message .message-content', // no data-test attribute
		messageInput: '[data-test="chat-input"]',
		sendButton: '[data-test="chat-send"]',
		productCard: '[data-test="chat-product"]',
		productName: '.product-name', // no data-test attribute
	};

	/* For static values like Locators, there is no promise involved, hence use getter
	   instead of async function
	*/
	get chatWindow(): Locator {
		return this.page.locator(this.selectors.chatWindow);
	}

	// Cards of the products the bot lists in the conversation
	get productCards(): Locator {
		return this.chatWindow.locator(this.selectors.productCard);
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

	// Header says "Chat Assistant" and the bot has asked its opening question
	async verifyChatWidgetLoaded(): Promise<void> {
		await expect(this.chatWindow).toBeVisible();
		await expect(this.chatWindow.locator(this.selectors.chatTitle)).toHaveText(CHAT_TITLE);
		await this.verifyBotMessage(GREETING);
		console.log("✅ Chat widget loaded with header and greeting");
	}

	/* The conversation keeps its history, so match the latest bot message with exactly this text */
	async verifyBotMessage(text: string): Promise<void> {
		const message: Locator = this.chatWindow
			.locator(this.selectors.botMessage)
			.filter({ hasText: exactTextPattern(text) })
			.last();

		await expect(message, `bot message "${text}" not shown`).toBeVisible();
		console.log(`✅ Bot said: ${text}`);
	}

	// Old action buttons stay in the history, so the newest one is the active one
	async selectAction(action: ChatAction): Promise<void> {
		await this.chatWindow.locator(`[data-test="chat-action-${action}"]`).last().click();
		console.log(`✅ Selected chat action: ${action}`);
	}

	async sendMessage(text: string): Promise<void> {
		await this.chatWindow.locator(this.selectors.messageInput).fill(text);
		await this.chatWindow.locator(this.selectors.sendButton).click();
		console.log(`✅ Sent chat message: ${text}`);
	}

	/* Every product the bot lists must be related to the search term */
	async verifyProductResultsContain(term: string): Promise<void> {
		await expect(this.productCards.first(), 'no products shown in chat').toBeVisible({ timeout: this.waits.MEDIUM });

		const names: string[] = (await this.productCards.locator(this.selectors.productName).allTextContents()).map(normalizeText);
		const offenders: string[] = names.filter(name => !name.toLowerCase().includes(term.toLowerCase()));
		expect(offenders, `chat products not containing "${term}"`).toEqual([]);
		console.log(`✅ Chat listed ${names.length} products for "${term}"`);
	}

	// Exact name match: "Claw Hammer" must not pick "Claw Hammer with Shock Reduction Grip"
	async selectProduct(name: string): Promise<void> {
		const card: Locator = this.productCards.filter({
			has: this.page.locator(this.selectors.productName, { hasText: exactTextPattern(name) }),
		});

		await card.click();
		console.log(`✅ Clicked product in chat: ${name}`);
	}
}
