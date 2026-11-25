import { test } from "@fixtures";
import { RENTAL_ITEMS } from "@testdata/rentalsData";

/**
 * RentalsPageWorkflows
 *
 * given an admin user's auth state has already been restored and the user is on the home page
 * when opening Categories > Rentals from the navbar
 * then
 *   1. the rentals page should list Excavator, Bulldozer and Crane with their descriptions
 *   2. clicking the logo should take the user back to the home page
 */
export function RentalsPageWorkflows() {

    test.beforeEach('Navigate to rentals page', async ({ pageManager_AdminUser }) => {
        const homePage = pageManager_AdminUser.homePage();

        await homePage.navigateToHome();
        await homePage.navbar.openRentals();
        await pageManager_AdminUser.rentalsPage().verifyRentalsPageIsReached();
    });

    test('Verify rentals page content', async ({ pageManager_AdminUser }) => {
        const rentalsPage = pageManager_AdminUser.rentalsPage();

        for (const item of RENTAL_ITEMS) {
            await test.step(`Verify rental: ${item.title}`, async () => {
                await rentalsPage.verifyRentalCard(item);
            });
        }
    });

    test('Verify logo navigation to home page from rentals page', async ({ pageManager_AdminUser }) => {
        await pageManager_AdminUser.rentalsPage().goHomeViaLogo();
        await pageManager_AdminUser.homePage().verifyHomePageIsReached();
    });
}
