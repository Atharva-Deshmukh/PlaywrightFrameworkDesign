# Toolshop Playwright + k6 Portfolio Framework — SDET-2 Blueprint

> **Target site:** `https://practicesoftwaretesting.com`
> **API:** `https://api.practicesoftwaretesting.com`
> **Stack:** TypeScript · Playwright · k6 · Allure · Docker · GitHub Actions

---

## 1. Honest Site Assessment

| Criteria | Verdict |
|---|---|
| TOTP / MFA | ✅ Full TOTP setup + verify endpoints |
| Admin panel | ✅ Separate admin role with CRUD |
| File upload | ✅ `/messages/{id}/attach-file` |
| File download | ✅ `/invoices/{no}/download-pdf` |
| SSE / Stream | ✅ `/sales-stream` (live feed) |
| Pagination | ✅ Products, Users, Invoices |
| Search + Filters | ✅ Brand, Category, Price, Sort |
| Multi-page workflow | ✅ Browse → Cart → Checkout → Invoice |
| Hybrid potential | ✅ API seed → UI verify, or vice versa |
| **Overall verdict** | **Best free public practice site for this stack** |

---

## 2. Framework Architecture Decision

```
Pattern:      POM + Fixture injection (no Singleton anti-pattern)
API Layer:    Custom typed API clients (not raw request())
Auth:         storageState per role (customer / admin) + TOTP
Data:         Factory pattern + API seeding + cleanup hooks
Reporting:    Allure 2 with categories, env info, steps
Performance:  k6 as separate suite, triggered from same Actions pipeline
```

---

## 3. Complete Folder Structure

```
toolshop-pw-framework/
│
├── .github/
│   └── workflows/
│       ├── ui-nightly.yml            # Nightly UI tests (all browsers)
│       ├── api-nightly.yml           # Nightly API tests
│       ├── smoke-pr.yml              # PR smoke gate
│       ├── performance-nightly.yml   # k6 perf pipeline
│       └── docker-build.yml          # Build + push image
│
├── docker/
│   ├── Dockerfile                    # Playwright image
│   ├── docker-compose.yml            # Local multi-container run
│   └── docker-compose.ci.yml         # CI override
│
├── k6/
│   ├── scripts/
│   │   ├── products-load.js          # Load test: browse products
│   │   ├── auth-stress.js            # Stress test: login endpoint
│   │   ├── checkout-spike.js         # Spike test: checkout flow
│   │   ├── search-soak.js            # Soak test: search + filter
│   │   └── cart-volume.js            # Volume: concurrent cart ops
│   ├── helpers/
│   │   └── auth.js                   # k6 auth helpers
│   └── thresholds.js                 # Global threshold config
│
├── src/
│   │
│   ├── api/
│   │   ├── clients/
│   │   │   ├── BaseApiClient.ts      # Axios wrapper, token mgmt, retry
│   │   │   ├── AuthApiClient.ts      # login, register, TOTP, refresh
│   │   │   ├── ProductApiClient.ts   # full product CRUD + specs
│   │   │   ├── BrandApiClient.ts
│   │   │   ├── CategoryApiClient.ts
│   │   │   ├── CartApiClient.ts
│   │   │   ├── InvoiceApiClient.ts   # CRUD + PDF + status
│   │   │   ├── UserApiClient.ts
│   │   │   ├── FavoriteApiClient.ts
│   │   │   ├── ContactApiClient.ts   # messages + file attach
│   │   │   └── ReportApiClient.ts
│   │   │
│   │   └── models/                   # TypeScript interfaces = API contracts
│   │       ├── Auth.model.ts
│   │       ├── Product.model.ts
│   │       ├── Brand.model.ts
│   │       ├── Category.model.ts
│   │       ├── Cart.model.ts
│   │       ├── Invoice.model.ts
│   │       └── User.model.ts
│   │
│   ├── pages/
│   │   ├── BasePage.ts               # Common: waitForLoad, scroll, screenshot
│   │   ├── LoginPage.ts
│   │   ├── RegisterPage.ts
│   │   ├── ForgotPasswordPage.ts
│   │   ├── TOTPPage.ts               # TOTP challenge page
│   │   ├── HomePage.ts
│   │   ├── ProductListPage.ts
│   │   ├── ProductDetailPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutPage.ts           # multi-step checkout
│   │   ├── OrderConfirmationPage.ts
│   │   ├── ProfilePage.ts
│   │   ├── ContactPage.ts
│   │   └── admin/
│   │       ├── AdminDashboardPage.ts
│   │       ├── AdminProductsPage.ts
│   │       ├── AdminBrandsPage.ts
│   │       ├── AdminCategoriesPage.ts
│   │       ├── AdminUsersPage.ts
│   │       └── AdminInvoicesPage.ts
│   │
│   ├── components/
│   │   ├── NavbarComponent.ts        # Reusable: search, cart icon, profile
│   │   ├── FilterComponent.ts        # Category, Brand, Price sliders
│   │   ├── PaginationComponent.ts    # Next, Prev, Page number
│   │   ├── SearchComponent.ts
│   │   ├── ToastComponent.ts         # Success/Error toasts
│   │   ├── ModalComponent.ts         # Confirm dialogs
│   │   ├── TableComponent.ts         # Admin data tables
│   │   └── FileUploadComponent.ts
│   │
│   ├── fixtures/
│   │   ├── base.fixture.ts           # page, context, browser
│   │   ├── auth.fixture.ts           # customerPage, adminPage (pre-auth)
│   │   ├── api.fixture.ts            # all typed API clients
│   │   └── data.fixture.ts           # seeded product, user, brand via API
│   │
│   ├── helpers/
│   │   ├── AuthHelper.ts             # storageState save/load logic
│   │   ├── TOTPHelper.ts             # otplib: generate token from secret
│   │   ├── DataFactory.ts            # faker-based builders per entity
│   │   ├── FileHelper.ts             # upload/download file utils
│   │   └── ApiSeedHelper.ts          # create → yield → cleanup pattern
│   │
│   ├── utils/
│   │   ├── Logger.ts                 # structured console + file logging
│   │   ├── RetryHelper.ts            # custom retry with backoff
│   │   ├── EnvConfig.ts              # dotenv multi-env loader
│   │   └── CustomAssertions.ts       # extended soft assert helpers
│   │
│   └── data/
│       ├── test-data.ts              # static seeds: creds, search terms
│       ├── factories/
│       │   ├── userFactory.ts
│       │   ├── productFactory.ts
│       │   └── brandFactory.ts
│       └── env/
│           ├── .env.staging
│           └── .env.production
│
├── tests/
│   │
│   ├── ui/
│   │   ├── auth/
│   │   │   ├── login.spec.ts
│   │   │   ├── login-negative.spec.ts
│   │   │   ├── register.spec.ts
│   │   │   ├── totp-mfa.spec.ts
│   │   │   ├── forgot-password.spec.ts
│   │   │   └── session-persistence.spec.ts
│   │   │
│   │   ├── products/
│   │   │   ├── product-listing.spec.ts
│   │   │   ├── product-search.spec.ts
│   │   │   ├── product-filters.spec.ts
│   │   │   ├── product-sort.spec.ts
│   │   │   ├── product-pagination.spec.ts
│   │   │   └── product-detail.spec.ts
│   │   │
│   │   ├── cart/
│   │   │   ├── cart-add-remove.spec.ts
│   │   │   ├── cart-quantity.spec.ts
│   │   │   └── cart-persistence.spec.ts
│   │   │
│   │   ├── checkout/
│   │   │   ├── checkout-full-flow.spec.ts
│   │   │   └── checkout-guest.spec.ts
│   │   │
│   │   ├── contact/
│   │   │   ├── contact-form.spec.ts
│   │   │   └── contact-file-upload.spec.ts
│   │   │
│   │   ├── profile/
│   │   │   ├── profile-view-edit.spec.ts
│   │   │   └── change-password.spec.ts
│   │   │
│   │   └── admin/
│   │       ├── product-crud.spec.ts
│   │       ├── brand-crud.spec.ts
│   │       ├── category-crud.spec.ts
│   │       ├── user-management.spec.ts
│   │       └── invoice-management.spec.ts
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.api.spec.ts
│   │   │   ├── register.api.spec.ts
│   │   │   ├── totp.api.spec.ts
│   │   │   └── token-refresh.api.spec.ts
│   │   │
│   │   ├── products/
│   │   │   ├── products-crud.api.spec.ts
│   │   │   ├── products-search.api.spec.ts
│   │   │   └── product-specs.api.spec.ts
│   │   │
│   │   ├── brands/
│   │   │   └── brands-crud.api.spec.ts
│   │   │
│   │   ├── categories/
│   │   │   └── categories-crud.api.spec.ts
│   │   │
│   │   ├── cart/
│   │   │   └── cart-lifecycle.api.spec.ts
│   │   │
│   │   ├── invoices/
│   │   │   ├── invoices-crud.api.spec.ts
│   │   │   ├── invoice-status.api.spec.ts
│   │   │   └── invoice-pdf.api.spec.ts
│   │   │
│   │   ├── users/
│   │   │   └── users-crud.api.spec.ts
│   │   │
│   │   └── reports/
│   │       └── reports.api.spec.ts
│   │
│   └── hybrid/
│       ├── TC_HYB_001_create-product-api-verify-ui.spec.ts
│       ├── TC_HYB_002_seed-cart-api-checkout-ui.spec.ts
│       ├── TC_HYB_003_register-api-login-ui.spec.ts
│       ├── TC_HYB_004_admin-create-brand-user-filter-ui.spec.ts
│       ├── TC_HYB_005_invoice-api-download-ui.spec.ts
│       └── TC_HYB_006_totp-setup-api-login-ui.spec.ts
│
├── auth/                             # .gitignore this folder
│   ├── customer-auth.json            # storageState: logged-in customer
│   └── admin-auth.json               # storageState: logged-in admin
│
├── allure-results/
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 4. All Test Workflows — Complete Map

### 4.1 UI Test Workflows (50 test cases)

#### AUTH (6 specs)

| # | Test Case | Key Assertions |
|---|---|---|
| TC_UI_AUTH_001 | Login with valid customer credentials | Redirect to home, navbar shows username |
| TC_UI_AUTH_002 | Login fails: wrong password | Error toast visible, stays on login |
| TC_UI_AUTH_003 | Login fails: empty fields | HTML5 / custom validation messages |
| TC_UI_AUTH_004 | Register new user | Success, auto-login, profile accessible |
| TC_UI_AUTH_005 | Register: duplicate email | Error message shown |
| TC_UI_AUTH_006 | Forgot password flow | Success message after submit |
| TC_UI_AUTH_007 | TOTP MFA — enable via settings | QR shown, secret saved to env |
| TC_UI_AUTH_008 | TOTP MFA — login challenge | OTP entered, session established |
| TC_UI_AUTH_009 | TOTP MFA — wrong code | Rejected, counter not incremented |
| TC_UI_AUTH_010 | Session persistence on reload | Still logged in after refresh |
| TC_UI_AUTH_011 | Logout clears session | Redirect to login, no access to /me |

#### PRODUCTS (12 specs)

| # | Test Case | Key Assertions |
|---|---|---|
| TC_UI_PROD_001 | Product listing page loads | ≥1 product card visible |
| TC_UI_PROD_002 | Search by product name | Results contain keyword |
| TC_UI_PROD_003 | Search: no results | Empty state message shown |
| TC_UI_PROD_004 | Filter by category (single) | Only matching products shown |
| TC_UI_PROD_005 | Filter by brand (single) | Only matching brand products shown |
| TC_UI_PROD_006 | Filter by price range | Products within min-max range only |
| TC_UI_PROD_007 | Multi-filter: category + brand | Intersection results correct |
| TC_UI_PROD_008 | Sort: price low→high | First item ≤ last item price |
| TC_UI_PROD_009 | Sort: price high→low | First item ≥ last item price |
| TC_UI_PROD_010 | Pagination: go to page 2 | Different products than page 1 |
| TC_UI_PROD_011 | Product detail page | Name, price, description visible |
| TC_UI_PROD_012 | Related products section | ≥1 related product shown |
| TC_UI_PROD_013 | Add product to favorites | Favorite icon toggled, persists on reload |

#### CART (5 specs)

| # | Test Case | Key Assertions |
|---|---|---|
| TC_UI_CART_001 | Add single product to cart | Cart icon count = 1 |
| TC_UI_CART_002 | Add multiple products to cart | Cart count = N |
| TC_UI_CART_003 | Update quantity in cart | Total price recalculated correctly |
| TC_UI_CART_004 | Remove product from cart | Product gone, count decremented |
| TC_UI_CART_005 | Cart persists after page reload | Same items on reload |
| TC_UI_CART_006 | Empty cart state | Message + CTA to shop shown |

#### CHECKOUT (4 specs)

| # | Test Case | Key Assertions |
|---|---|---|
| TC_UI_CHK_001 | Full checkout flow (logged-in) | Order confirmation page + invoice ID |
| TC_UI_CHK_002 | Guest checkout | Invoice created without login |
| TC_UI_CHK_003 | Checkout: invalid payment | Error message shown |
| TC_UI_CHK_004 | Multi-step navigation (back/next) | State preserved between steps |

#### CONTACT / FILE UPLOAD (3 specs)

| # | Test Case | Key Assertions |
|---|---|---|
| TC_UI_CONT_001 | Submit contact form | Success message shown |
| TC_UI_CONT_002 | File upload attachment | File name visible in form |
| TC_UI_CONT_003 | Contact form validation | Required field errors shown |

#### PROFILE (3 specs)

| # | Test Case | Key Assertions |
|---|---|---|
| TC_UI_PROF_001 | View my profile | Correct name/email displayed |
| TC_UI_PROF_002 | Edit profile (name, phone) | Saved, success toast, persists on reload |
| TC_UI_PROF_003 | Change password | Login with new password succeeds |

#### ADMIN — PRODUCTS (4 specs)

| # | Test Case | Key Assertions |
|---|---|---|
| TC_UI_ADM_P001 | Create new product via admin UI | Appears in product list |
| TC_UI_ADM_P002 | Edit product name/price | Changes reflected on storefront |
| TC_UI_ADM_P003 | Delete product | Gone from list, 404 on direct URL |
| TC_UI_ADM_P004 | Products table: search + pagination | Filter works, page navigation works |

#### ADMIN — BRANDS, CATEGORIES, USERS, INVOICES (8 specs)

| # | Test Case | Highlight |
|---|---|---|
| TC_UI_ADM_B001 | Create + Delete brand via admin | CRUD cycle |
| TC_UI_ADM_C001 | Create category + subcategory | Tree structure validates |
| TC_UI_ADM_U001 | View + edit user role | Role change persists |
| TC_UI_ADM_U002 | Delete user | No longer shows in list |
| TC_UI_ADM_I001 | View invoice, change status | Status badge updated |
| TC_UI_ADM_I002 | Download PDF invoice | PDF downloads, is non-empty |
| TC_UI_ADM_I003 | Invoice list: search by number | Correct invoice shown |
| TC_UI_ADM_I004 | Invoice list: filter by status | Only matching invoices shown |

---

### 4.2 API Test Workflows (60 test cases)

#### AUTH API

| # | Endpoint | Test Case | Status Expected |
|---|---|---|---|
| TC_API_AUTH_001 | POST /users/login | Valid credentials | 200 + token |
| TC_API_AUTH_002 | POST /users/login | Invalid password | 401 |
| TC_API_AUTH_003 | POST /users/login | Missing body fields | 422 |
| TC_API_AUTH_004 | POST /users/register | New valid user | 201 |
| TC_API_AUTH_005 | POST /users/register | Duplicate email | 422 |
| TC_API_AUTH_006 | POST /users/forgot-password | Valid email | 200 |
| TC_API_AUTH_007 | POST /users/change-password | Correct old password | 200 |
| TC_API_AUTH_008 | POST /users/change-password | Wrong old password | 422 |
| TC_API_AUTH_009 | GET /users/me | Valid token | 200 + user object |
| TC_API_AUTH_010 | GET /users/me | No token | 401 |
| TC_API_AUTH_011 | GET /users/refresh | Valid token | 200 + new token |
| TC_API_AUTH_012 | GET /users/logout | Valid token | 200, token invalidated |
| TC_API_AUTH_013 | POST /totp/setup | Authenticated user | 200 + secret + QR |
| TC_API_AUTH_014 | POST /totp/verify | Valid OTP | 200 |
| TC_API_AUTH_015 | POST /totp/verify | Invalid OTP | 422 |

#### PRODUCTS API

| # | Endpoint | Test Case | Status |
|---|---|---|---|
| TC_API_PROD_001 | GET /products | List with default pagination | 200, data array |
| TC_API_PROD_002 | GET /products | With page + per_page params | 200, correct slice |
| TC_API_PROD_003 | GET /products | Sort by price ASC | 200, sorted |
| TC_API_PROD_004 | GET /products/{id} | Valid ID | 200 + full product |
| TC_API_PROD_005 | GET /products/{id} | Invalid ID | 404 |
| TC_API_PROD_006 | POST /products | Admin creates product | 201 |
| TC_API_PROD_007 | POST /products | Customer role (403 expected) | 403 |
| TC_API_PROD_008 | POST /products | Missing required fields | 422 |
| TC_API_PROD_009 | PUT /products/{id} | Full update by admin | 200 |
| TC_API_PROD_010 | PATCH /products/{id} | Partial update (price only) | 200 |
| TC_API_PROD_011 | DELETE /products/{id} | Admin deletes | 204 |
| TC_API_PROD_012 | GET /products/search | By keyword | 200, relevant results |
| TC_API_PROD_013 | GET /products/{id}/related | Valid product | 200, array |
| TC_API_PROD_014 | POST /products/{id}/specs | Add spec | 201 |
| TC_API_PROD_015 | PUT /products/{id}/specs/{sid} | Update spec | 200 |
| TC_API_PROD_016 | DELETE /products/{id}/specs/{sid} | Delete spec | 204 |

#### BRANDS API

| # | Test Case | Status |
|---|---|---|
| TC_API_BRAND_001 | GET /brands — list all | 200 |
| TC_API_BRAND_002 | POST /brands — admin creates | 201 |
| TC_API_BRAND_003 | GET /brands/{id} | 200 |
| TC_API_BRAND_004 | PUT /brands/{id} — full update | 200 |
| TC_API_BRAND_005 | PATCH /brands/{id} — partial | 200 |
| TC_API_BRAND_006 | DELETE /brands/{id} | 204 |
| TC_API_BRAND_007 | GET /brands/search | 200 |
| TC_API_BRAND_008 | DELETE non-existent brand | 404 |

#### CATEGORIES API

| # | Test Case | Status |
|---|---|---|
| TC_API_CAT_001 | GET /categories/tree | 200, nested structure |
| TC_API_CAT_002 | GET /categories | 200, flat list |
| TC_API_CAT_003 | POST /categories | 201 |
| TC_API_CAT_004 | GET /categories/tree/{id} | 200, subtree |
| TC_API_CAT_005 | PUT /categories/{id} | 200 |
| TC_API_CAT_006 | DELETE /categories/{id} | 204 |
| TC_API_CAT_007 | GET /categories/search | 200 |

#### CART API

| # | Test Case | Status |
|---|---|---|
| TC_API_CART_001 | POST /carts — create empty cart | 201 + cart ID |
| TC_API_CART_002 | POST /carts/{id} — add product | 200 |
| TC_API_CART_003 | GET /carts/{id} — retrieve cart | 200 + items |
| TC_API_CART_004 | PUT /carts/{id}/product/quantity — update | 200 |
| TC_API_CART_005 | DELETE /carts/{id}/product/{pid} | 204 |
| TC_API_CART_006 | DELETE /carts/{id} — delete whole cart | 204 |
| TC_API_CART_007 | Add out-of-stock product | 4xx error |

#### INVOICES API

| # | Test Case | Status |
|---|---|---|
| TC_API_INV_001 | GET /invoices — admin list | 200 |
| TC_API_INV_002 | POST /invoices — create | 201 |
| TC_API_INV_003 | POST /invoices/guest — no auth | 201 |
| TC_API_INV_004 | GET /invoices/{id} | 200 |
| TC_API_INV_005 | PUT /invoices/{id} — update | 200 |
| TC_API_INV_006 | PATCH /invoices/{id} — partial | 200 |
| TC_API_INV_007 | PUT /invoices/{id}/status | 200, status changed |
| TC_API_INV_008 | GET /invoices/{no}/download-pdf | 200, binary PDF |
| TC_API_INV_009 | GET /invoices/{no}/download-pdf-status | 200, status enum |
| TC_API_INV_010 | GET /invoices/search | 200 |
| TC_API_INV_011 | Customer accesses other's invoice | 403 |

#### REPORTS API

| # | Test Case | Status |
|---|---|---|
| TC_API_RPT_001 | GET /reports/total-sales-per-country | 200, array |
| TC_API_RPT_002 | GET /reports/top10-purchased-products | 200, ≤10 items |
| TC_API_RPT_003 | GET /reports/top10-best-selling-categories | 200 |
| TC_API_RPT_004 | GET /reports/total-sales-of-years | 200 |
| TC_API_RPT_005 | GET /reports/average-sales-per-month | 200, 12 months |
| TC_API_RPT_006 | Reports without admin token | 401 |

---

### 4.3 Hybrid Test Workflows (6 specs — your real differentiator)

```
Hybrid = API does the heavy lifting (seeding/cleanup) + UI validates user experience
```

| # | Workflow | What it Proves |
|---|---|---|
| **HYB_001** | Admin creates Product via API → Customer finds it via UI search, adds to cart | End-to-end data integrity |
| **HYB_002** | Seed full cart via API (5 products) → Open UI, verify cart, complete checkout | API seeding accelerates slow UI setup |
| **HYB_003** | Register user via API → Login via UI with TOTP → Edit profile via UI → Verify via API GET /users/me | Full auth lifecycle |
| **HYB_004** | Admin creates Brand via API → Customer filters products by that brand in UI → Brand appears in filter chips | UI reflects API data |
| **HYB_005** | Create invoice via API → Login as admin in UI → Download PDF, verify not empty | File download verification |
| **HYB_006** | Setup TOTP via API → Store secret in test fixture → UI login uses OTP generated from secret | Real MFA testing |

---

## 5. Key Implementation Patterns

### 5.1 TOTP Helper

```typescript
// src/helpers/TOTPHelper.ts
import { authenticator } from 'otplib';

export class TOTPHelper {
  static generateToken(secret: string): string {
    return authenticator.generate(secret);
  }

  static async waitForFreshToken(secret: string): Promise<string> {
    // Wait for start of new 30s window to avoid boundary race
    const remaining = authenticator.timeRemaining();
    if (remaining < 5) {
      await new Promise(r => setTimeout(r, (remaining + 1) * 1000));
    }
    return this.generateToken(secret);
  }
}
```

### 5.2 Auth Fixture — Session Per Role

```typescript
// src/fixtures/auth.fixture.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TOTPHelper } from '../helpers/TOTPHelper';

type AuthFixtures = {
  customerPage: Page;
  adminPage: Page;
};

export const test = base.extend<AuthFixtures>({
  customerPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'auth/customer-auth.json',  // pre-saved session
    });
    await use(await context.newPage());
    await context.close();
  },

  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'auth/admin-auth.json',
    });
    await use(await context.newPage());
    await context.close();
  },
});
```

### 5.3 Global Setup — Auth State Generation

```typescript
// global-setup.ts
import { chromium } from '@playwright/test';
import { LoginPage } from './src/pages/LoginPage';
import { TOTPHelper } from './src/helpers/TOTPHelper';

async function globalSetup() {
  const browser = await chromium.launch();

  // Customer session
  const customerCtx = await browser.newContext();
  const customerPage = await customerCtx.newPage();
  const loginPage = new LoginPage(customerPage);
  await loginPage.goto();
  await loginPage.login(process.env.CUSTOMER_EMAIL, process.env.CUSTOMER_PASSWORD);
  await customerCtx.storageState({ path: 'auth/customer-auth.json' });
  await customerCtx.close();

  // Admin session (with TOTP)
  const adminCtx = await browser.newContext();
  const adminPage = await adminCtx.newPage();
  await new LoginPage(adminPage).goto();
  await new LoginPage(adminPage).login(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
  const otp = await TOTPHelper.waitForFreshToken(process.env.ADMIN_TOTP_SECRET!);
  await adminPage.fill('[data-test="otp-input"]', otp);
  await adminPage.click('[data-test="login-submit"]');
  await adminCtx.storageState({ path: 'auth/admin-auth.json' });
  await adminCtx.close();

  await browser.close();
}

export default globalSetup;
```

### 5.4 Base API Client

```typescript
// src/api/clients/BaseApiClient.ts
import { APIRequestContext } from '@playwright/test';

export abstract class BaseApiClient {
  protected request: APIRequestContext;
  protected baseUrl: string;
  protected token?: string;

  constructor(request: APIRequestContext, token?: string) {
    this.request = request;
    this.baseUrl = process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com';
    this.token = token;
  }

  protected authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  protected async get<T>(path: string): Promise<T> {
    const res = await this.request.get(`${this.baseUrl}${path}`, {
      headers: this.authHeaders(),
    });
    return res.json() as Promise<T>;
  }

  protected async post<T>(path: string, body: unknown): Promise<{ status: number; body: T }> {
    const res = await this.request.post(`${this.baseUrl}${path}`, {
      headers: this.authHeaders(),
      data: body,
    });
    return { status: res.status(), body: (await res.json()) as T };
  }

  protected async delete(path: string): Promise<number> {
    const res = await this.request.delete(`${this.baseUrl}${path}`, {
      headers: this.authHeaders(),
    });
    return res.status();
  }
}
```

### 5.5 Data Seeding Pattern (create → test → cleanup)

```typescript
// src/helpers/ApiSeedHelper.ts
export class ApiSeedHelper {
  static async withProduct(
    productClient: ProductApiClient,
    testFn: (product: Product) => Promise<void>
  ): Promise<void> {
    const product = await productClient.createProduct(DataFactory.product());
    try {
      await testFn(product);
    } finally {
      await productClient.deleteProduct(product.id); // always cleanup
    }
  }
}

// Usage in hybrid test:
test('HYB_001: API-created product visible in UI', async ({ adminPage, request }) => {
  const productApi = new ProductApiClient(request, adminToken);
  await ApiSeedHelper.withProduct(productApi, async (product) => {
    const homePage = new HomePage(adminPage);
    await homePage.search(product.name);
    await expect(adminPage.locator('[data-test="product-name"]')).toContainText(product.name);
  });
});
```

### 5.6 Playwright Config (multi-env, multi-project)

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import { loadEnv } from './src/utils/EnvConfig';

loadEnv(process.env.TEST_ENV ?? 'staging');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 2,
  reporter: [
    ['allure-playwright'],
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
  ],
  globalSetup: './global-setup.ts',
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    // Smoke — runs on every PR (1 browser only)
    {
      name: 'smoke-chromium',
      grep: /@smoke/,
      use: { ...devices['Desktop Chrome'] },
    },
    // Full UI — nightly, 3 browsers
    {
      name: 'ui-chromium',
      grep: /@ui/,
      use: { ...devices['Desktop Chrome'] },
      testDir: './tests/ui',
    },
    {
      name: 'ui-firefox',
      grep: /@ui/,
      use: { ...devices['Desktop Firefox'] },
      testDir: './tests/ui',
    },
    {
      name: 'ui-webkit',
      grep: /@ui/,
      use: { ...devices['Desktop Safari'] },
      testDir: './tests/ui',
    },
    // API — fast, no browser
    {
      name: 'api',
      grep: /@api/,
      testDir: './tests/api',
      use: { ...devices['Desktop Chrome'] },
    },
    // Hybrid
    {
      name: 'hybrid',
      grep: /@hybrid/,
      testDir: './tests/hybrid',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

---

## 6. GitHub Actions Pipelines

### 6.1 Nightly UI Pipeline

```yaml
# .github/workflows/ui-nightly.yml
name: UI Tests — Nightly

on:
  schedule:
    - cron: '0 0 * * *'     # midnight UTC
  workflow_dispatch:

jobs:
  ui-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
      fail-fast: false

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps ${{ matrix.browser }}

      - name: Run UI tests
        run: npx playwright test --project=ui-${{ matrix.browser }}
        env:
          TEST_ENV: staging
          BASE_URL: ${{ secrets.STAGING_BASE_URL }}
          API_BASE_URL: ${{ secrets.STAGING_API_URL }}
          CUSTOMER_EMAIL: ${{ secrets.CUSTOMER_EMAIL }}
          CUSTOMER_PASSWORD: ${{ secrets.CUSTOMER_PASSWORD }}
          ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
          ADMIN_TOTP_SECRET: ${{ secrets.ADMIN_TOTP_SECRET }}

      - name: Upload Allure results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: allure-results-${{ matrix.browser }}
          path: allure-results/

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: pw-report-${{ matrix.browser }}
          path: playwright-report/
```

### 6.2 Nightly API Pipeline

```yaml
# .github/workflows/api-nightly.yml
name: API Tests — Nightly

on:
  schedule:
    - cron: '30 0 * * *'
  workflow_dispatch:

jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx playwright install chromium --with-deps
      - name: Run API tests
        run: npx playwright test --project=api
        env:
          TEST_ENV: staging
          API_BASE_URL: ${{ secrets.STAGING_API_URL }}
          ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: api-allure-results
          path: allure-results/
```

### 6.3 k6 Performance Pipeline

```yaml
# .github/workflows/performance-nightly.yml
name: k6 Performance Tests — Nightly

on:
  schedule:
    - cron: '0 2 * * *'
  workflow_dispatch:

jobs:
  k6-load-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install k6
        run: |
          sudo gpg -k
          sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
            --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \
            | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6

      - name: Run Load Test — Products
        run: k6 run k6/scripts/products-load.js
        env:
          API_BASE_URL: ${{ secrets.STAGING_API_URL }}

      - name: Run Stress Test — Auth
        run: k6 run k6/scripts/auth-stress.js
        env:
          API_BASE_URL: ${{ secrets.STAGING_API_URL }}

      - name: Upload k6 results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: k6-results
          path: k6/results/
```

### 6.4 PR Smoke Gate

```yaml
# .github/workflows/smoke-pr.yml
name: Smoke Tests — PR Gate

on:
  pull_request:
    branches: [main, develop]

jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx playwright install chromium --with-deps
      - run: npx playwright test --project=smoke-chromium
        env:
          TEST_ENV: staging
          BASE_URL: ${{ secrets.STAGING_BASE_URL }}
          API_BASE_URL: ${{ secrets.STAGING_API_URL }}
```

---

## 7. Docker Setup

```dockerfile
# docker/Dockerfile
FROM mcr.microsoft.com/playwright:v1.47.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx playwright install --with-deps

CMD ["npx", "playwright", "test"]
```

```yaml
# docker/docker-compose.yml
version: '3.8'

services:
  playwright:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    environment:
      - TEST_ENV=${TEST_ENV:-staging}
      - BASE_URL=${BASE_URL}
      - API_BASE_URL=${API_BASE_URL}
      - CUSTOMER_EMAIL=${CUSTOMER_EMAIL}
      - CUSTOMER_PASSWORD=${CUSTOMER_PASSWORD}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - ADMIN_TOTP_SECRET=${ADMIN_TOTP_SECRET}
    volumes:
      - ../allure-results:/app/allure-results
      - ../playwright-report:/app/playwright-report
    command: ["npx", "playwright", "test", "--project=ui-chromium"]

  allure:
    image: frankescobar/allure-docker-service
    ports:
      - "5050:5050"
    volumes:
      - ../allure-results:/app/allure-results
    depends_on:
      - playwright
```

---

## 8. k6 Performance Scripts

### 8.1 Products Load Test

```javascript
// k6/scripts/products-load.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');
const BASE_URL = __ENV.API_BASE_URL || 'https://api.practicesoftwaretesting.com';

export const options = {
  stages: [
    { duration: '1m', target: 20 },   // ramp up
    { duration: '3m', target: 20 },   // hold
    { duration: '1m', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% under 2s
    http_req_failed: ['rate<0.01'],     // <1% errors
    errors: ['rate<0.05'],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/products?page=1&per_page=9`);

  const ok = check(res, {
    'status is 200': (r) => r.status === 200,
    'has products': (r) => r.json('data') !== undefined,
    'response time < 2s': (r) => r.timings.duration < 2000,
  });

  errorRate.add(!ok);
  sleep(1);
}
```

### 8.2 Auth Stress Test

```javascript
// k6/scripts/auth-stress.js
import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.API_BASE_URL;

export const options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 50 },   // stress peak
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<3000'],
    http_req_failed: ['rate<0.02'],
  },
};

export default function () {
  const payload = JSON.stringify({
    email: 'customer@practicesoftwaretesting.com',
    password: 'welcome01',
  });

  const res = http.post(`${BASE_URL}/users/login`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'login success': (r) => r.status === 200,
    'token present': (r) => r.json('access_token') !== undefined,
  });
}
```

---

## 9. package.json Scripts

```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --project=ui-chromium",
    "test:api": "playwright test --project=api",
    "test:hybrid": "playwright test --project=hybrid",
    "test:smoke": "playwright test --project=smoke-chromium",
    "test:cross-browser": "playwright test tests/ui/",
    "test:env:staging": "TEST_ENV=staging playwright test",
    "test:env:prod": "TEST_ENV=production playwright test",
    "report:allure": "allure generate allure-results --clean -o allure-report && allure open",
    "report:pw": "playwright show-report",
    "docker:run": "docker-compose -f docker/docker-compose.yml up --build",
    "auth:setup": "playwright test --config=auth-setup.config.ts",
    "k6:load": "k6 run k6/scripts/products-load.js",
    "k6:stress": "k6 run k6/scripts/auth-stress.js",
    "k6:spike": "k6 run k6/scripts/checkout-spike.js"
  },
  "dependencies": {
    "@playwright/test": "^1.47.0",
    "otplib": "^12.0.1",
    "@faker-js/faker": "^9.0.0",
    "dotenv": "^16.4.5",
    "allure-playwright": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "@types/node": "^22.0.0"
  }
}
```

---

## 10. What Makes This SDET-2 Portfolio-Level

| Capability | What Reviewers See |
|---|---|
| TOTP MFA | You know real auth flows, not toy login forms |
| storageState per role | You understand session management at framework level |
| Hybrid tests | You use API as a tool, not just something to test |
| API seed + cleanup | You understand test isolation and idempotency |
| Typed API clients | You think in abstractions, not raw fetch calls |
| Fixtures with DI | You know Playwright's architecture inside-out |
| k6 in same repo | Performance is not an afterthought |
| Matrix CI strategy | You know parallel + cross-browser CI cost tradeoffs |
| Allure with steps | You communicate results to non-technical stakeholders |
| Factory pattern | You manage test data, not hardcoded strings |
| Retry strategy | You understand flakiness root causes |
| Multi-env config | You've worked in real team pipelines |

---

## 11. Implementation Priority (in order)

1. **Week 1** — Folder structure + BaseApiClient + AuthApiClient + storageState (customer + admin)
2. **Week 2** — BasePage + LoginPage + TOTPHelper + global-setup + auth.fixture
3. **Week 3** — Core UI specs: auth, product listing, search, filters, cart
4. **Week 4** — API specs: auth, products, brands, categories
5. **Week 5** — Hybrid specs (HYB_001 to HYB_006)
6. **Week 6** — Allure reporting + CI pipelines (UI + API)
7. **Week 7** — k6 scripts + performance pipeline + Docker
8. **Week 8** — Admin UI specs + invoice PDF download + cross-browser config
9. **Week 9** — Polish: retry, logging, env config, README badges

---

*This blueprint is designed to be implemented incrementally. Start with auth + one happy path — then layer complexity.*
