import { test } from "@fixtures";
import { HomePage } from "@pages/homePage";
import { RentalsPage } from "@pages/rentalsPage";
import { Navbar } from "@pages/fragments/navbar";
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

    let homePage: HomePage;
    let navbar: Navbar;
    let rentalsPage: RentalsPage;

    test.beforeEach('Initialising classes', async ({ adminUser }) => {
        homePage = new HomePage(adminUser);
        navbar = new Navbar(adminUser);
        rentalsPage = new RentalsPage(adminUser);

        await homePage.navigateToHome();
        await navbar.openRentals();
        await rentalsPage.verifyRentalsPageIsReached();
    });

    test.afterEach('Close page instances', async () => {
        await homePage.page.close();
    });

    test('Verify rentals page content', async () => {
        for (const item of RENTAL_ITEMS) {
            await test.step(`Verify rental: ${item.title}`, async () => {
                await rentalsPage.verifyRentalCard(item);
            });
        }
    });

    test('Verify logo navigation to home page from rentals page', async () => {
        await navbar.clickLogo();
        await homePage.verifyHomePageIsReached();
    });
}
