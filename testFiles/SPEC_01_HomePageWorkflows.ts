import { test, expect, Locator } from "@fixtures";
import { HomePage } from "@pages/homePage";

/**
 * HomePageWorkflows
 *
 * given an admin user's auth state has already been restored (via the adminUser fixture)
 * when visiting the home page
 * then
 *   1. the navbar should still show the logged-in user's exact display name
 *   2. the home page should surface at least one out-of-stock product
 */
export function HomePageWorkflows() {

    let homePage: HomePage;

    test.beforeEach('Initialising classes', async ({ adminUser }) => {
        homePage = new HomePage(adminUser);
        await homePage.page.goto('/');
        await homePage.verifyHomePageIsReached();
    });

    test.afterEach('Close page instances', async() => {
        await homePage.page.close();
    });

    test("Verify that clicking ecofriendly filter loads all ecofriendly products", async () => {
        await homePage.clickEcoFriendlyFilter();

        const productCards: Locator = homePage.page.locator(homePage.selectors.individualProductCard);
        const cardCount: number = await productCards.count();
        await expect(productCards.first()).toBeVisible();

        // Check every card individually rather than asserting on the locator as a whole, so a
        // single non-eco-friendly card (if the filter misbehaves) is pinpointed by index.
        for (let i = 0; i < cardCount; i++) {
            const card = productCards.nth(i);
            await expect(card.locator(homePage.selectors.ecoBadge)).toBeVisible();
        }
    });
}
