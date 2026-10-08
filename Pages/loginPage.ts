import { Page, expect } from "@playwright/test";
import { generate } from "otplib";
import { APP_CONSTANTS } from "../appConstants"
import { UserKey, getUser } from "../Users";


/* NOTE: Its there after the user has clicked Sign in button already */
export class LoginPage {

    /* Page: it can only be assigned once (in the constructor), preventing accidental reassignment later. */
	readonly page: Page; /* readonly means it can only be assigned once (in the constructor), preventing accidental reassignment later. */
	constructor(page: Page) {
		this.page = page;
	}

	readonly waits = APP_CONSTANTS.TIMEOUTS;

	selectors = {
        emailInput: '[data-test="email"]',
		passwordInput: '[data-test="password"]',
		loginButton: '[data-test="login-submit"]',
		mfaOtpCodeInput: '[data-test="totp-code"]',
		verifyMfaOtpButton: '[data-test="verify-totp"]'
	};

	/**
	 *
	 * @param userEmail - The user key from the registry.
	 */
	async handleLogin(userEmail: UserKey) {

		const currentUrl = this.page.url();
		const userData = getUser(userEmail);
		console.log(`Logging in as ${userData.userName}`);

        await expect(this.page).toHaveURL("https://practicesoftwaretesting.com/auth/login");

		if (!currentUrl.includes('auth/login')) {
			throw new Error(`Expected to be on login page, but got: ${currentUrl}`);
		}

		console.log(`On auth login page: ${currentUrl}`);

		// Enter email
		await this.page.locator(this.selectors.emailInput).waitFor({ state: 'visible', timeout: this.waits.SHORT });
		await this.page.locator(this.selectors.emailInput).fill(userData.userName, { force: true });

		// Enter password
		await this.page.locator(this.selectors.passwordInput).waitFor({ state: 'visible', timeout: this.waits.SHORT });
		await this.page.locator(this.selectors.passwordInput).fill(userData.password, { force: true });

        // Click Login button
		await this.page.locator(this.selectors.loginButton).click({ force: true });

        /* Wait for MFA input box to be visible */
        await this.page.locator(this.selectors.mfaOtpCodeInput).waitFor({state: 'visible', timeout: this.waits.SHORT});

		// Handle MFA
		if (!userData.mfaSecret) {
			throw new Error(`Missing MFA secret for email: ${userData.userName}`);
		}

		await this.validateMFA(userData.mfaSecret, 10);
		
	}

	async validateMFA(secret: string, retries: number): Promise<void> {
		console.log(`Validating MFA (attempt ${10 - retries + 1})`);
		if (retries > 0) {
			const responsePromise = this.page.waitForResponse(response => response.url().includes("/account"), {
				timeout: 30000,
			});

			await this.page.waitForURL("**/auth/login");
			const code = await generate({ secret });
			console.log(`MFA code to fill ->  ${code}`);
			await this.page.locator(this.selectors.mfaOtpCodeInput).fill(code, { force: true });
			await this.page.locator(this.selectors.verifyMfaOtpButton).click({ force: true });

			const response = await responsePromise;
			if (response.status() !== 302) {
				console.log("MFA code INVALID, waiting 30 seconds for retry.");
				await this.page.waitForTimeout(30000);
				await this.validateMFA(secret, retries - 1);
			} else {
				console.log(`MFA code ${code} VALID. Proceeding.`);
			}

			// Check post-MFA redirect
			console.log(`⏳ Waiting for post-MFA redirect...`);
			await this.page.waitForURL(url => {
				const urlStr = url.toString();
				return !urlStr.includes('/auth/login');
			}, { timeout: 20000 });
			
			console.log(`✅ Post-MFA redirect complete to: ${this.page.url()}`);
		}
		else {
			throw new Error("MFA validation failed after 10 attempts.");
		}
	}

}