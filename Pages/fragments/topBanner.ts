import { Page, Locator, expect } from "@playwright/test";
import { APP_CONSTANTS } from "../../constants/appConstants";

/* Encapsulates the banners above the navbar, shared across all pages:
   the "View the Documentation" strip and the "Practice Black Box Testing & Bug Hunting" bar.
   Plain class (extends nothing, imports no page) so BasePage can expose it without a circular import. */
export class TopBanner {

	readonly page: Page;
	readonly waits = APP_CONSTANTS.TIMEOUTS;

	constructor(page: Page) {
		this.page = page;
	}

	private readonly selectors = {
		documentationStrip: '[data-test="notification-bar"]',
		testingNotificationBar: '.testing-notification-bar', // no data-test attribute
		
		// Testing Guide split screen: no data-test attributes, so ids/classes are the most stable hooks
		splitScreenPanel: '#testing-split-screen',
		guideHeading: '#testing-split-screen .guide-container .header h1',
	};

	// The Testing Guide / Bug Hunting buttons have no data-test attribute, so locate them by role + name
	get documentationStrip(): Locator {
		return this.page.locator(this.selectors.documentationStrip);
	}

	get documentationLink(): Locator {
		return this.documentationStrip.getByRole('link', { name: 'Documentation' });
	}

	get testingGuideButton(): Locator {
		return this.page.locator(this.selectors.testingNotificationBar).getByRole('button', { name: 'Testing Guide' });
	}

	get bugHuntingButton(): Locator {
		return this.page.locator(this.selectors.testingNotificationBar).getByRole('button', { name: 'Bug Hunting' });
	}

	async getDocumentationUrl(): Promise<string | null> {
		return this.documentationLink.getAttribute('href');
	}

	// Left-hand guide panel that appears next to the app (the app moves into an iframe while it is open)
	get testingGuidePanel(): Locator {
		return this.page.locator(this.selectors.splitScreenPanel);
	}

	get testingGuideHeading(): Locator {
		return this.page.locator(this.selectors.guideHeading);
	}

	// Red button at the top right while the split screen is open
	get closeSplitScreenButton(): Locator {
		return this.page.getByRole('button', { name: 'Close Split Screen' });
	}

	async openTestingGuide(): Promise<void> {
		await this.testingGuideButton.click();
		console.log("✅ Clicked Testing Guide from top banner");

		await expect(this.testingGuidePanel).toBeVisible();
		await expect(this.testingGuideHeading).toContainText('Testing Guide');
		await expect(this.closeSplitScreenButton).toBeVisible();
		console.log("✅ Testing Guide panel is open on the left");
	}

	// waitFor 'hidden' resolves whether the panel is hidden or removed from the DOM (the site removes it)
	async closeTestingGuide(): Promise<void> {
		await this.closeSplitScreenButton.click();
		console.log("✅ Clicked Close Split Screen");

		await this.testingGuidePanel.waitFor({ state: 'hidden', timeout: this.waits.SHORT });
		await this.closeSplitScreenButton.waitFor({ state: 'hidden', timeout: this.waits.SHORT });
		console.log("✅ Testing Guide panel is closed");
	}
}
