import { test, expect, Locator } from "@fixtures";
import { HomePage } from "@pages/homePage";
import { ProductPage } from "@pages/productPage";
import { SortField, SORT_OPTIONS_BY_FIELD } from "@constants/sortOptions";
import { pickRandom, randomIndex } from "@helpers/randomUtils";

/**
 * HomePageWorkflows
 *
 * given an admin user's auth state has already been restored (via the adminUser fixture)
 * when visiting the home page
 * then
 *   1. clicking the eco-friendly filter should load only eco-friendly products
 *   2. sorting by name, price and CO₂ rating (a random direction each) should order the cards accordingly
 *   3. searching for a term should return only matching products, and opening one should show a
 *      consistent product page (name, image, badge, related products, price)
 */
export function HomePageWorkflows() {

    let homePage: HomePage;

    test.beforeEach('Initialising classes', async ({ adminUser }) => {
        homePage = new HomePage(adminUser);

        /* The adminUser fixture only restores the saved session (cookies/localStorage) into a new
           context; the page itself is still about:blank. Navigate explicitly (resolved against
           baseURL) so every test starts on the home page, already logged in.
        */
        await homePage.navigateToHome();
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

    test("Verify sorting functionality", async () => {
        // One random direction per field; the pick is part of the step title so a failure shows what was run
        const sortFields: Array<[string, SortField]> = [
            ['name', SortField.NAME],
            ['price', SortField.PRICE],
            ['CO₂ rating', SortField.CO2_RATING],
        ];

        for (const [fieldName, field] of sortFields) {
            const option = pickRandom(SORT_OPTIONS_BY_FIELD[field]);

            await test.step(`Sort by ${fieldName}: ${option.label}`, async () => {
                await homePage.sortBy(option);
                await homePage.verifyProductsSortedBy(option);
            });
        }
    });

    test("Verify search functionality", async () => {
        const searchTerm = 'Sander';
        let listed: { name: string; price: number };
        let productPage: ProductPage;

        await test.step(`Search for "${searchTerm}" and verify every result matches`, async () => {
            await homePage.searchFor(searchTerm);
            await homePage.verifySearchResultsContain(searchTerm);
        });

        await test.step('Open a random search result and verify the product page', async () => {
            const index = randomIndex(await homePage.getProductCardCount());
            listed = await homePage.getProductCardSummary(index);
            console.log(`Opening card #${index}: ${listed.name}`);

            await homePage.openProductCard(index);

            productPage = new ProductPage(homePage.page);
            await productPage.verifyProductPageIsReached();
            await productPage.verifyProductNameContains(searchTerm);
            await productPage.verifyProductImageLoaded();
            await productPage.verifyAnyBadgeContains(searchTerm);
            await productPage.verifyRelatedProductsContain(searchTerm);
        });

        await test.step('Price on the product page matches the price listed on the card', async () => {
            expect(await productPage.getProductName()).toBe(listed.name);
            expect(await productPage.getUnitPrice()).toBe(listed.price);
        });
    });
}
