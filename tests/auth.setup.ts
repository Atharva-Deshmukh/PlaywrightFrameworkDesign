import { test as setup, Page } from "@playwright/test";
import { LoginPage } from "@pages/loginPage";
import { UserKey, getUser } from "../Users";

/* 
It opens a fresh context.
It goes to /auth/login and runs LoginPage.handleLogin(userKey). It retries up to 3 times.
It calls context.storageState({ path }). That writes the cookies and localStorage, including the JWT, to .auth/<userKey>.json.
It closes the context.
*/

/* serial execution to prevent auth state conflicts */
setup.describe.configure({ mode: "serial" });

type SetupCase = {
    title: string;
    userKey: UserKey;
};

const SETUP_CASES: SetupCase[] = [
    { title: "@admin Admin User 01", userKey: "admin_user_1" },
];

for (const setupCase of SETUP_CASES) {
    setup(setupCase.title, async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        try {
            await authenticateUser(page, setupCase.userKey);
            await context.storageState({ path: getUser(setupCase.userKey).path, indexedDB: true });
        } finally {
            await context.close(); // used finally => runs even if login fails, so no leaked browser context
        }
    });
}

// Retries from a fresh context on failure, since login/MFA timing can be flaky.
async function authenticateUser(page: Page, userKey: UserKey, maxRetries = 3): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Authenticating ${userKey}, attempt ${attempt}`);
            await page.goto("/auth/login");
            await new LoginPage(page).handleLogin(userKey);
            console.log(`${userKey} authenticated successfully`);
            return;
        } catch (error) {
            if (attempt === maxRetries) throw error;
            console.error(`Attempt ${attempt} failed: ${(error as Error).message}`);
            await page.context().clearCookies();
        }
    }
}


