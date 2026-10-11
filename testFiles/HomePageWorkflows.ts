import { test, expect } from "../tests/fixtures";
import { Navbar } from "../Pages/fragments/navbar";
import { HomePage } from "../Pages/homePage";
import { getUser } from "../Users";

/**
 * HomePageWorkflows
 *
 * given an admin user's auth state has already been restored (via the adminPage fixture)
 * when visiting the home page
 * then
 *   1. the navbar should still show the logged-in user's exact display name
 *   2. the home page should surface at least one out-of-stock product
 */
export function HomePageWorkflows() {

    const admin = getUser("admin_user_1");

    test.beforeEach("Restore auth state and verify logged in user", async ({ adminPage }) => {
        await adminPage.goto("/");

        const navbar = new Navbar(adminPage);
        await navbar.verifyLoggedInAs(admin.displayName);
    });

    test("Verify if there is any out of stock product in the home page", async ({ adminPage }) => {
        const homePage = new HomePage(adminPage);

        const outOfStockBadges = adminPage.locator(homePage.selectors.outOfStockBadge);
        await expect(outOfStockBadges.first()).toBeVisible();
        await expect(outOfStockBadges).not.toHaveCount(0);
    });
}
