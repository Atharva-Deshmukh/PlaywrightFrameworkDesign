import { test } from "@fixtures";

/**
 * ChatBotSuiteWorkflows
 *
 * given an admin user's auth state has already been restored and the user is on the home page
 * when using the chat assistant
 * then
 *   1. the chat should open with the "Chat Assistant" header and its greeting
 *   2. "Find a product" should ask what to look for, list matching products for "hammer", and clicking
 *      "Claw Hammer" should open that product's detail page
 */
export function ChatBotSuiteWorkflows() {

    test.beforeEach('Navigate to home page', async ({ pageManager_AdminUser }) => {
        await pageManager_AdminUser.homePage().navigateToHome();
    });

    test('Verify chat widget loads with header and greeting', async ({ pageManager_AdminUser }) => {
        const chatWidget = pageManager_AdminUser.homePage().chatWidget;

        await chatWidget.open();
        await chatWidget.verifyChatWidgetLoaded();
    });

    test('Verify Find a product functionality', async ({ pageManager_AdminUser }) => {
        const searchTerm = 'hammer';
        const productName = 'Claw Hammer';
        const homePage = pageManager_AdminUser.homePage();
        const chatWidget = homePage.chatWidget;
        const productPage = pageManager_AdminUser.productPage();

        await test.step('Open the chat and verify it loaded', async () => {
            await chatWidget.open();
            await chatWidget.verifyChatWidgetLoaded();
        });

        await test.step('Choose "Find a product" and verify the bot asks what to look for', async () => {
            await chatWidget.selectAction('find-product');
            await chatWidget.verifyBotMessage('What product are you looking for?');
        });

        await test.step(`Search for "${searchTerm}" and verify the product list`, async () => {
            await chatWidget.sendMessage(searchTerm);
            await chatWidget.verifyProductResultsContain(searchTerm);
        });

        await test.step(`Open "${productName}" from the chat`, async () => {
            await chatWidget.selectProduct(productName);
        });

        await test.step('Verify the product detail page is shown for the clicked product', async () => {
            await productPage.verifyProductPageIsReached();
            await productPage.verifyProductDetails({ name: productName });
        });

        await test.step('Return to the home page via the logo', async () => {
            await productPage.goHomeViaLogo();
            await homePage.verifyHomePageIsReached();
        });
    });
}
