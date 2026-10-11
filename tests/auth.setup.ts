import { test as setup, Page } from "@playwright/test";
import { LoginPage } from "../Pages/loginPage";
import { UserKey, getUser } from "../Users";

// serial execution to prevent auth state conflicts
setup.describe.configure({ mode: "serial" });

type SetupCase = {
    title: string;
    userKey: UserKey;
};

const SETUP_CASES: SetupCase[] = [
    { title: "@admin Admin User 01", userKey: "admin_user_1" },
    // add more users as needed - mirror Users.ts USERS registry
];

for (const setupCase of SETUP_CASES) {
    setup(setupCase.title, async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        try {
            await authenticateUser(page, setupCase.userKey);
            await context.storageState({ path: getUser(setupCase.userKey).path });
        } finally {
            await context.close();
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


