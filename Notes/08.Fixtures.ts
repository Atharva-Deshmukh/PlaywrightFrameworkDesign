/* Playwright Fixture vs Cypress Fixtures

   In Playwright, fixtures are reusable setup and teardown environments (dependency injection). 
   In Cypress, fixtures are static test data files (like JSON or images) used to mock data.

   | Feature              | Playwright Fixtures                                                        | Cypress Fixtures                                                            |
   |----------------------|----------------------------------------------------------------------------|-----------------------------------------------------------------------------|
   | Primary Purpose      | Environment setup, teardown, and dependency injection                      | Storing static mock data and test inputs                                    |
   | What They Are        | Code functions/objects passed into tests (e.g., `{ page }`, `{ request }`) | External files (`.json`, `.csv`, `.png`) stored in `cypress/fixtures/`      |
   | How They Are Used    | Injected as arguments into `test('name', async ({ myFixture }) => ...)`    | Loaded via command `cy.fixture('users.json')` or `cy.intercept()`           |
   | Lifecycle & Scope    | Isolated per test or worker; handles automatic cleanup after tests finish  | Static files; no built-in lifecycle, state management, or teardown          |
   */

/* Every fixture function passed to test.extend({...}) must have this exact signature:

    async (fixtures, use, testInfo?) => { ... }

    First argument (fixtures) — An object you destructure to declare which other fixtures this fixture depends on. 
    Second argument (use) — "hands over" the value to fixture
    Code after await use(...) — Documented place for teardown

*/

import { test as base } from '@playwright/test';

// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<MyFixtures>({

    /* this is our reusable fixure */
    todoPage: async ({ page }, use) => {
        // Set up the fixture.
        const todoPage = new TodoPage(page);
        await todoPage.goto();
        await todoPage.addToDo('item1');
        await todoPage.addToDo('item2');

        // Use the fixture value in the test -> value returned here is returned in todoPage fixture >> which is returned in test({todoPage})
        await use(todoPage);

        // Clean up the fixture -> below use(), we write teardown code for this fixture
        await todoPage.removeAll();
    },

    /* Another fixture */
    settingsPage: async ({ page }, use) => {
        await use(new SettingsPage(page));
    },
});

export { expect } from '@playwright/test';

/* USING THE ABOVE FIXTURES NOW */
import { test, expect } from './my-test';

test.beforeEach(async ({ settingsPage }) => {
    await settingsPage.switchToDarkMode();
});

test('basic test', async ({ todoPage, page }) => {
    await todoPage.addToDo('something nice');
    await expect(page.getByTestId('todo-title')).toContainText(['something nice']);
});