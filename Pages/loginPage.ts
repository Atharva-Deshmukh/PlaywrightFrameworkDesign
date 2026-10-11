import { Page, expect } from "@playwright/test";
// import { generate, createGuardrails } from "otplib"; // MFA commented out for now
import { APP_CONSTANTS } from "../appConstants"
import { UserKey, getUser } from "../Users";
import { Navbar } from "./fragments/navbar";

// practicesoftwaretesting.com issues 10-byte (80-bit) TOTP secrets; otplib v13 defaults to a 16-byte minimum.
// const mfaGuardrails = createGuardrails({ MIN_SECRET_BYTES: 10 }); // MFA commented out for now


/* NOTE: Its there after the user has clicked Sign in button already */
export class LoginPage {

    /* Page: it can only be assigned once (in the constructor), preventing accidental reassignment later. */
	readonly page: Page; /* readonly means it can only be assigned once (in the constructor), preventing accidental reassignment later. */
	readonly navbar: Navbar;
	constructor(page: Page) {
		this.page = page;
		this.navbar = new Navbar(page);
	}

	readonly waits = APP_CONSTANTS.TIMEOUTS;

	selectors = {
        emailInput: '[data-test="email"]',
		passwordInput: '[data-test="password"]',
		loginButton: '[data-test="login-submit"]',
		mfaOtpCodeInput: '[data-test="totp-code"]',
		verifyMfaOtpButton: '[data-test="verify-totp"]',
		navUserMenuButton: '[data-test="nav-menu"]'
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

        // MFA commented out for now - using seeded default account (admin@practicesoftwaretesting.com) which has no MFA enabled
        // // Wait for MFA input box to be visible
        // await this.page.locator(this.selectors.mfaOtpCodeInput).waitFor({state: 'visible', timeout: this.waits.SHORT});
        //
		// // Handle MFA
		// if (!userData.mfaSecret) {
		// 	throw new Error(`Missing MFA secret for email: ${userData.userName}`);
		// }
        //
		// await this.validateMFA(userData.mfaSecret, 10);

        // Wait for the post-login redirect away from the login page
        await this.page.waitForURL(url => !url.toString().includes('/auth/login'), { timeout: this.waits.SHORT });

        // Confirm login success: admin lands on the dashboard with the exact username visible in the navbar
        await expect(this.page).toHaveURL(/\/admin\/dashboard/);
        await expect(this.page.locator(this.selectors.navUserMenuButton)).toHaveText(userData.displayName);

        // Navigate Home via the navbar; it verifies the storefront loads internally
        await this.navbar.clickHome();
	}

	// MFA commented out for now - using seeded default account (admin@practicesoftwaretesting.com) which has no MFA enabled
	// async validateMFA(secret: string, retries: number): Promise<void> {
	// 	console.log(`Validating MFA (attempt ${10 - retries + 1})`);
	// 	if (retries > 0) {
	// 		const responsePromise = this.page.waitForResponse(response => response.url().includes("/account"), {
	// 			timeout: 30000,
	// 		});
    //
	// 		await this.page.waitForURL("**/auth/login");
	// 		const code = await generate({ secret, guardrails: mfaGuardrails });
	// 		console.log(`MFA code to fill ->  ${code}`);
	// 		await this.page.locator(this.selectors.mfaOtpCodeInput).fill(code, { force: true });
	// 		await this.page.locator(this.selectors.verifyMfaOtpButton).click({ force: true });
    //
	// 		const response = await responsePromise;
	// 		if (response.status() !== 302) {
	// 			console.log("MFA code INVALID, waiting 30 seconds for retry.");
	// 			await this.page.waitForTimeout(30000);
	// 			await this.validateMFA(secret, retries - 1);
	// 		} else {
	// 			console.log(`MFA code ${code} VALID. Proceeding.`);
	// 		}
    //
	// 		// Check post-MFA redirect
	// 		console.log(`⏳ Waiting for post-MFA redirect...`);
	// 		await this.page.waitForURL(url => {
	// 			const urlStr = url.toString();
	// 			return !urlStr.includes('/auth/login');
	// 		}, { timeout: 20000 });
	// 		
	// 		console.log(`✅ Post-MFA redirect complete to: ${this.page.url()}`);
	// 	}
	// 	else {
	// 		throw new Error("MFA validation failed after 10 attempts.");
	// 	}
	// }

}