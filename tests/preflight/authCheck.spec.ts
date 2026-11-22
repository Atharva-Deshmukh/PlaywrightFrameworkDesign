import { test } from "@playwright/test";
import { LoginPage } from "@pages/loginPage";

/* Gate run before the full suite: a fresh login as the default admin user must succeed.
   If the login flow is broken, it fails once here instead of every parallel spec folder reattempting and failing for the same reason.

   how gate works:

   in yml file:

    auth_preflight_check:
        <<: *test_template  
        stage: auth_preflight  
        allow_failure: false  # a failure here stops the pipeline
*/
test("@preflight Auth smoke check - default admin user can log in", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto("/auth/login");
        await new LoginPage(page).handleLogin("admin_user_1");
    } finally {
        await context.close();
    }
});
