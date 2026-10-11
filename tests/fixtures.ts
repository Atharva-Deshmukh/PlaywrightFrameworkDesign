import { test as base, Browser, BrowserContext, Page } from "@playwright/test";
import * as fs from "node:fs";
import { UserKey, getUser } from "../Users";

export type MyFixtures = {
    adminPage: Page;
    // add more users as needed - mirror the pattern below with a new userKey
};

function hasUsableAuthState(authPath: string): boolean {
    if (!fs.existsSync(authPath)) {
        return false;
    }
    try {
        /*  Playwright's storageState format is a JSON object like { cookies: [...], origins: [...] } */
        const authData = JSON.parse(fs.readFileSync(authPath, "utf8"));
        return Array.isArray(authData.cookies) && authData.cookies.length > 0;
    } catch {
        return false;
    }
}

// One isolated context per test, reusing the storageState saved by tests/auth.setup.ts.

/* Every fixture function passed to test.extend({...}) must have this exact signature:

                async (fixtures, use, testInfo?) => { ... }

    First argument (fixtures) — An object you destructure to declare which other fixtures this fixture depends on. 
    Second argument (use) —  if use(...) is never called inside the fixture function, the test that asked for that 
                            fixture (e.g. test('...', async ({ adminPage }) => {...})) never actually starts running its body. 
                            Playwright is stuck waiting for the fixture setup to "hand over" the value,
    Code after await use(...) — not required by the API, but it's the standard, documented place for teardown — runs after the test using this fixture finishes.


    When Playwright runs your test, it needs to:
        Run your setup code (open browser context, log in, etc.)
        Give the resulting value (e.g. the logged-in page) to the actual test function
        Wait for the test to finish
        Run your cleanup code (close the context, save state, etc.)

    async ({ browser }, use) => {
        const page = await setupSomething();   // STEP 1: setup

        await use(page);                       // STEP 2+3: hand `page` to the test, then PAUSE here
                                                //           until the test body finishes running

        await cleanupSomething();              // STEP 4: runs only after the test is done
    }

    If you never call use(...): Playwright never gets the value it promised the test (adminPage), 
                                so the test that asked for adminPage just sits there waiting forever — it never actually starts.

*/
function userFixture(userKey: UserKey) {
    return async (
        { browser }: { browser: Browser },
        use: (page: Page) => Promise<void>
    ) => {
        const authPath = getUser(userKey).path;
        const context: BrowserContext = await browser.newContext(
            hasUsableAuthState(authPath) ? { storageState: authPath } : {}
        );
        const page = await context.newPage();

        try {
            await use(page);
        } finally {
            // Refresh the saved session so later runs keep reusing a live cookie
            await context.storageState({ path: authPath });
            await context.close();
        }
    };
}

/*
The re-export exists purely so spec files can pull expect, Locator, Page, devices, etc. from the same import line

                                                        With this line:
                                                        ---------------

import { test, expect, Locator } from "../tests/fixtures";

test("some test", async ({ adminPage }) => {
    const button: Locator = adminPage.locator('[data-test="login-submit"]');
    await expect(button).toBeVisible();
});


                                                        Without this line:
                                                        ------------------

import { test } from "../tests/fixtures";
import { expect, Locator } from "@playwright/test";

test("some test", async ({ adminPage }) => {
    const button: Locator = adminPage.locator('[data-test="login-submit"]');
    await expect(button).toBeVisible();
});

*/
export * from "@playwright/test";

export const test = base.extend<MyFixtures>({
    adminPage: userFixture("admin_user_1"),
});
