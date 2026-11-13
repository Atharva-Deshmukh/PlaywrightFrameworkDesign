import { Page, Locator } from "@playwright/test";

/* Encapsulates the page footer, shared across all pages.
   Plain class (extends nothing, imports no page) so BasePage can expose it without a circular import. */
export class Footer {

	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	private readonly selectors = {
		learnAndExploreSection: '[data-test="footer-explore"]',
		learnCoursesLink: '[data-test="footer-learn-courses"]',
		apiSpectorLink: '[data-test="footer-learn-spector"]',
		githubLink: '[data-test="footer-learn-github"]',
	};

	// Privacy policy and version text have no data-test attribute
	get privacyPolicyLink(): Locator {
		return this.page.getByRole('link', { name: 'Privacy Policy' });
	}

	get versionText(): Locator {
		return this.page.getByText(/v\d+\.\d+ \| Built/);
	}

	get learnAndExploreSection(): Locator {
		return this.page.locator(this.selectors.learnAndExploreSection);
	}

	// The Learn & Explore links open external sites, so tests assert their href instead of following them
	async getLearnAndExploreLinkUrls(): Promise<Record<'courses' | 'apiSpector' | 'github', string | null>> {
		return {
			courses: await this.page.locator(this.selectors.learnCoursesLink).getAttribute('href'),
			apiSpector: await this.page.locator(this.selectors.apiSpectorLink).getAttribute('href'),
			github: await this.page.locator(this.selectors.githubLink).getAttribute('href'),
		};
	}

	async clickPrivacyPolicy(): Promise<void> {
		await this.privacyPolicyLink.click();
		console.log("✅ Clicked Privacy Policy from footer");
	}

	async getVersionText(): Promise<string> {
		return (await this.versionText.innerText()).trim();
	}
}
