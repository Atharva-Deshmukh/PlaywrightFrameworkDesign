import { test as base, Browser, BrowserContext } from "@playwright/test";
import * as fs from "node:fs";
import { UserKey, getUser } from "./Users";
import { PageManager } from "@helpers/pageManager";

export type MyFixtures = {
    pageManager_AdminUser: PageManager;
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

/* Auth setup has already run and saved a state file for each user.
   The fixture reads that file and loads it into a context. It does this per test.
   But Every test gets a new, empty context, because contexts are isolated per test. 
   That empty context knows nothing about the setup login. 
   Hence we need to load the context with newContext({ storageState }). 
   Without it, every test starts logged out, even though setup has run.

   We are reusing the storageState saved by tests/auth.setup.ts.
*/
function userFixture(userKey: UserKey) {
    return async (
        { browser }: { browser: Browser },
        use: (pageManager: PageManager) => Promise<void>
    ) => {
        const authPath = getUser(userKey).path;
        const usable = hasUsableAuthState(authPath);
        if (!usable) {
            console.warn(`No usable auth state at ${authPath}, logging in ${userKey} from scratch`);
        }

        /* empty context if auth state is not usable, restored session otherwise */
        const context: BrowserContext = await browser.newContext(usable ? { storageState: authPath } : {});
        const page = await context.newPage();
        const pageManager = new PageManager(page, userKey);

        try {
            /* No saved session to restore: log in again (the home page is public, so nothing would redirect us later)
               and save the fresh session so the next tests restore it instead of logging in again. */
            if (!usable) {
                console.warn(`Login Again`);
                await page.goto("/auth/login");
                await pageManager.loginPage().handleLogin(userKey);

                /* Store the updated auth state
                   When many workers start at the same time with no file, each one may still log in and write once, 
                   so a few logins can happen before the file settles. They all write valid sessions for the same user, 
                   so that is harmless.
                */
                await context.storageState({ path: authPath });
            }

            // Tests get a PageManager bound to this user's page
            await use(pageManager);

            /*
                // fixtures.ts
                    pageManager_AdminUser: userFixture("admin_user_1"),

                // in a test
                    test("...", async ({ pageManager_AdminUser }) => {
                        //                 ↑ this IS the object passed to use(...)
                        const home = pageManager_AdminUser.homePage();
                    });
            */


          // finally block = teardown here
        } finally {
            await context.close();
        }


        /* Full Order:

            setup:     newContext → newPage → (if no saved state: login + save state file)
            use(pm):   fixture paused now, control passed to test() -> test runs
            teardown:  control passed from test() -> fixture again
                       finally {
                        context.close()                 ← close the context
                    }
        
        */
    };
}

/* This fixtures.ts already defines its own test. 
   Specs import that custom test, and they also need expect, Locator and the rest. 
   The re-export lets them get everything from one place:

// with the re-export
    import { test, expect, Locator } from "@fixtures";

// without it, two imports
    import { test } from "@fixtures";
    import { expect, Locator } from "@playwright/test";


export * from "@playwright/test";            // includes the original `test`
export const test = base.extend<MyFixtures>({...});   // your own `test`

*/
export * from "@playwright/test";

export const test = base.extend<MyFixtures>({
    pageManager_AdminUser: userFixture("admin_user_1"),
});
