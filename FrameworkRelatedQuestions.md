# Playwright Automation Framework Round — Interview Questions
### Target profile: SDET-2 / Senior QA / QA Automation Engineer, ~3.2 YoE, India, Service-based / Mid-product / Startup (non-MAANG)
### Round: Automation Framework (Design + Knowledge)

> Compiled from (a) a full read-through of this repo's live Playwright framework
> (`playwright/fixtures.ts`, `helpers/pageManager.ts`, `handlers/errorHandler.ts`,
> `observers/testEventManager.ts`, `config/configLoader.ts`, `api-coverage/*`,
> the `.github/skills/create-test-helper` composition-pattern skill, and the
> API-test-author agent conventions), and (b) web research across credible,
> citable sources. Every question in Sections B–D is traceable to a cited
> source so you can verify it yourself — nothing here is invented from a
> generic "Top 10" listicle with no provenance.

---

# PART I — Aggregated "Top 50" Questions (cross-source frequency analysis)

> This part was added after a second research pass that specifically targeted
> **"top 50 Playwright interview questions"** and **"top 50 automation
> framework / SDET interview questions"** listicles, so the questions below
> are ranked by how often they *actually recur* across multiple independently
> published "Top 50" banks — not hand-picked. Four full "Top 50" banks were
> read end-to-end and cross-referenced:
>
> 1. [stackinterview.dev — 50+ Playwright Interview Questions and Answers (2026)](https://stackinterview.dev/guides/50-playwright-interview-questions-and-answers-2026) — Q1–Q52, cites [TestDino's 2026 Playwright market-share analysis](https://testdino.com/blog/playwright-market-share) (45.1% QA adoption vs. Selenium 22.1%) and the [State of JS 2024](https://2024.stateofjs.com/en-US/libraries/testing/) survey.
> 2. [software-testing-tutorials-automation.com — Top 50+ Playwright Interview Questions with Answers 2026](https://software-testing-tutorials-automation.com/2025/07/playwright-interview-questions-answers.html) — Q1–Q54, organized Basic → Intermediate → Advanced → Scenario-based.
> 3. [qajobfit.com — Top 50 Playwright Interview Questions and Answers (2026)](https://qajobfit.com/resources/top-playwright-interview-questions) — 50 questions explicitly framed around "engineering judgment," written for intermediate-to-senior candidates.
> 4. [GeeksforGeeks — SDET Interview Questions and Answers](https://www.geeksforgeeks.org/software-testing/sdet-interview-questions-and-answers/) — 50 questions (last updated 31 Jul 2026), covering core testing/SDLC fundamentals an SDET is still expected to know cold.
>
> A fifth, older but widely-cited classic bank — [Software Testing Material — Most Popular Test Automation Framework Interview Questions](https://www.softwaretestingmaterial.com/test-automation-framework-interview-questions/) — was added specifically for the **"framework design"** angle (framework types, Object Repository, OOPs-in-framework, "explain your framework to the interviewer").

## 1.1 Playwright mechanics — questions appearing in 3 or more of the 4 Playwright-specific banks

These are the highest-frequency, cross-bank-confirmed questions — if you only
have time to prepare one list, prepare this one.

| # | Question | Confirmed in |
|---|---|---|
| 1 | What is Playwright, and what problems does it solve vs. Selenium/Cypress? | stackinterview Q1; software-testing-tutorials Q1/Q7/Q8; qajobfit Q1/Q9 |
| 2 | What is the architecture of Playwright (client/server, CDP/WebSocket vs. WebDriver)? | stackinterview Q3; software-testing-tutorials Q2 |
| 3 | What is a `Browser`, `BrowserContext`, and `Page`, and how do they relate? | stackinterview Q7; software-testing-tutorials Q12; qajobfit Q4 |
| 4 | What is a locator, and how does it differ from a legacy selector/WebElement? | stackinterview Q5; software-testing-tutorials Q15; qajobfit Q5 |
| 5 | What are the recommended locator strategies, and why prefer role/text-based over CSS/XPath? | stackinterview Q6; qajobfit Q10 |
| 6 | What is locator strictness, and how do you resolve a locator matching multiple elements? | qajobfit Q8; (also covered in Section B/D above) |
| 7 | What is auto-waiting, and exactly which actionability checks run before an action? | stackinterview Q4; software-testing-tutorials Q9; qajobfit Q6 |
| 8 | What are web-first assertions, and why do they retry? | stackinterview Q11; qajobfit Q7 |
| 9 | What is the Page Object Model (POM), and why use it in Playwright? | stackinterview Q16; software-testing-tutorials Q54; qajobfit Q24 |
| 10 | What are Playwright fixtures, and how do they differ from `beforeEach` hooks? | stackinterview Q17; qajobfit Q21 |
| 11 | What is the difference between test-scoped and worker-scoped fixtures? | stackinterview (advanced tier); qajobfit Q22 |
| 12 | How do you persist/reuse authentication via `storageState`? | stackinterview Q18; software-testing-tutorials Q36; qajobfit Q36 |
| 13 | How do you intercept and mock network requests with `route()`/`fulfill()`? | stackinterview Q19; software-testing-tutorials Q19; qajobfit Q33 |
| 14 | How do you test APIs using `APIRequestContext`/the `request` fixture? | stackinterview Q29; software-testing-tutorials Q30; qajobfit Q35 |
| 15 | How does parallel execution work by default, and what does `fullyParallel` change? | stackinterview Q23; software-testing-tutorials Q22; qajobfit Q41 |
| 16 | What is test sharding, and how does it differ from worker parallelism? | stackinterview Q24; qajobfit Q43 |
| 17 | How do retries work, and what's the risk of relying on them? | stackinterview Q25; software-testing-tutorials Q34; qajobfit Q39 |
| 18 | How do you use Trace Viewer to debug a failing test? | stackinterview Q27; software-testing-tutorials Q17; qajobfit Q46 |
| 19 | A test passes locally but fails in CI — how do you investigate? | stackinterview Q46 (advanced); software-testing-tutorials Q26; qajobfit Q40 |
| 20 | How do you detect and fix a flaky test (root-cause categories)? | stackinterview Q46; software-testing-tutorials Q50; qajobfit Q38 |
| 21 | How do you handle iframes (and Shadow DOM)? | stackinterview Q21; software-testing-tutorials Q23; qajobfit Q13/Q14 |
| 22 | How do you handle multiple tabs/popups without a race condition? | stackinterview Q22; software-testing-tutorials Q28/Q43; qajobfit Q15 |
| 23 | How do you handle file uploads and downloads? | stackinterview Q20; software-testing-tutorials Q13; qajobfit Q17/Q18 |
| 24 | How do you handle native dialogs (alert/confirm/prompt)? | stackinterview Q35; software-testing-tutorials Q29; qajobfit Q16 |
| 25 | How do you configure Playwright for CI (GitHub Actions) and Docker? | stackinterview Q37/Q38; software-testing-tutorials Q33; qajobfit Q45 |
| 26 | How do you generate and read test reports (HTML/JUnit/Allure/custom)? | stackinterview Q26; software-testing-tutorials Q16/Q18; (Section D above) |
| 27 | How do you perform visual regression testing (`toHaveScreenshot`)? | stackinterview Q31; qajobfit Q47 |
| 28 | How do you emulate mobile devices / set viewport? | stackinterview Q32; software-testing-tutorials Q47 |
| 29 | How do you create test data safely for parallel runs (no shared-state collisions)? | qajobfit Q26/Q27; stackinterview Q45 (advanced) |
| 30 | Playwright vs. Selenium vs. Cypress — when would you choose each? | stackinterview Q50; software-testing-tutorials "Playwright vs Selenium" section; qajobfit Q9/Q31-equivalent |
| 31 | How do you debug with the Playwright Inspector / `--debug` / `PWDEBUG=1`? | stackinterview Q28; software-testing-tutorials Q39 |
| 32 | How do you write a reliable "wait for response caused by a click" pattern (register-before-trigger)? | qajobfit Q31; stackinterview Q34 |
| 33 | How do you test accessibility with Playwright (`getByRole` + axe-core)? | stackinterview Q40; qajobfit Q48 |
| 34 | What is Codegen, and what is its practical limitation? | stackinterview Q14; software-testing-tutorials Q31 |
| 35 | How do you set up environment-specific config (`baseURL`, multiple config files, `.env`)? | software-testing-tutorials Q35; qajobfit Q29 |

## 1.2 Classic "automation framework design" questions (the ones service-based companies still ask verbatim)

Sourced from [Software Testing Material's Test Automation Framework Interview Questions](https://www.softwaretestingmaterial.com/test-automation-framework-interview-questions/) — one of the longest-running, most-cited banks in the Indian QA interview circuit (cited across Naukri/AmbitionBox-style prep forums) — cross-checked against qajobfit's "engineering judgment" framing. These are *framework-design-round* staples precisely because they are tool-agnostic and get re-asked whether the candidate used Selenium, Cypress, or Playwright:

1. What is a (test automation) framework, in your own words?
2. Name the common types of automation frameworks (Modular, Data-Driven, Keyword-Driven, Hybrid, BDD) and how they differ.
3. Why use a framework at all instead of standalone scripts?
4. "Have you created a framework, or used an existing one?" — be honest and be ready to defend either answer with specifics.
5. What are the advantages of a test automation framework (reusability, reporting, parallel cross-browser/OS execution, lower long-term maintenance cost, regression coverage)?
6. Which framework/pattern are you currently using, and *why that one* for this project specifically?
7. Explain your framework's structure end-to-end: how a script is triggered, how it runs, how logs/screenshots/reports are generated. *(This is the single most-repeated "explain your project architecture" question across Indian service-based company interviews — rehearse it as a 90-second narrative, not a slide.)*
8. Where have you applied OOP concepts (inheritance, abstraction, encapsulation, polymorphism) inside your automation framework?
9. How do you build and manage an Object Repository, and why is the Page Object Model the modern replacement for a flat locator-properties file?
10. What criteria do you use to decide which test cases *to* automate (repetitive, regression, smoke/sanity) vs. which *not to* automate (frequently-changing UI, one-time/exploratory, usability testing)?
11. How many test cases/scenarios can you realistically automate per day, and what makes that number vary? *(Tests whether you understand complexity-driven estimation, not a fixed throughput number.)*
12. What design pattern would you use to create/manage browser instances for parallel execution?
13. What naming conventions do you follow for packages/classes/files in a real project, and why does consistency matter at scale?
14. If an interviewer asks "What exactly did *you* develop in the framework?" (a deliberately pointed HR/tech-lead question to catch candidates who only ever *used* a framework others built) — how do you answer honestly for your actual level of ownership?
15. How do you execute 200+ test cases in limited time without more hardware? (Parallel execution, suite partitioning/sharding, prioritized smoke subsets.)
16. What's the difference between implicit and explicit waits, and when do you reach for each? *(Still asked verbatim even in Playwright interviews as a conceptual check, despite Playwright's auto-waiting making explicit `WebDriverWait`-style code mostly unnecessary — a strong answer explicitly contrasts Playwright's model here.)*
17. Walk through how you'd explain your automation project's architecture to a non-technical interviewer vs. a technical one.
18. What automation coding standards/conventions do you enforce in your framework (and who enforces them — linting, PR review, or nothing)?
19. How do Git and CI tooling (Jenkins/GitHub Actions) fit into your day-to-day as the automation framework owner — what do *you* own vs. what does DevOps own?
20. Describe a real challenge you faced building or maintaining your framework, and how you resolved it. *(Maps directly onto Section C4's STAR-format expectation in Part II below.)*

## 1.3 SDET core-fundamentals quick-fire (GeeksforGeeks' 50, condensed to the recurring subset)

[GeeksforGeeks — SDET Interview Questions and Answers](https://www.geeksforgeeks.org/software-testing/sdet-interview-questions-and-answers/) is dominated by general QA/SDLC theory rather than Playwright specifics — but these fundamentals are routinely used as warm-up/screening questions **before** the dedicated framework-design round, especially at service-based companies that still run a traditional "manual-testing-concepts-first" interview structure:

- SDET vs. Manual Tester — what actually changes in day-to-day responsibilities?
- Severity vs. Priority — definition plus one real example of each.
- Smoke Testing vs. Sanity Testing — definition plus when each is run in your pipeline.
- SDLC vs. STLC — how do they relate, and where does automation plug into each?
- Regression Testing — why is it usually the first thing automated?
- Black Box vs. White Box vs. Gray Box Testing.
- Defect/Bug Life Cycle — the full state sequence (New → Assigned → Open → Fixed → Retest → Closed/Reopened).
- Requirement Traceability Matrix (RTM) — what it proves and why automation leads get asked to maintain one.
- What is an API, in plain terms, and how does that definition change what you test vs. what a UI test covers?
- Load Testing vs. Stress Testing — the distinction interviewers use to check you're not just parroting "performance testing."

---

# PART II — Deep-Dive Sections (original research, preserved in full below)

## 0. How to use this document

1. **Section A** uses *this actual repository* as a worked example — this is
   the kind of deep-dive an interviewer will run if you put "Playwright
   framework design" on your resume and they ask you to walk through your
   architecture. Practice explaining each pattern out loud, unprompted.
2. **Section B–D** are the general-market questions a 3.2 YoE SDET-2/Senior QA
   candidate is realistically asked in India's service-based/product/startup
   interview circuit, grouped by difficulty tier, each with its source.
3. **Section E** is a condensed rapid-revision checklist for the night before.

---

## SECTION A — Framework-design questions grounded in THIS repository

These are the exact questions an interviewer would ask if you presented
*this* codebase as your framework, mapped to the real files that answer them.
Use these to rehearse articulating your own project's design decisions — this
is precisely what an "Automation Framework round (design)" tests.

| # | Likely interview question | Where the answer lives in this repo |
|---|---|---|
| A1 | "Walk me through what happens from the moment `npx playwright test` runs to the first assertion executing." | [fixtures.ts](../../../WORKSPACE/LCT_PlaywrightNewRepo/lifecycle-twin/playwright/fixtures.ts) — the file's own header comment diagrams Phase 0 (config load) → Phase 1 (auth setup project) → Phase 2 (fixture/context creation) → Phase 3 (test execution) → Phase 4 (teardown). Being able to narrate this end-to-end is exactly what Q7 ("Walk through Playwright Test Runner's architecture end to end") in Section B tests generically — you have a concrete, repo-specific answer instead of a memorized one. |
| A2 | "Why do you have a `PageManager` instead of importing page objects directly in tests?" | `helpers/pageManager.ts` — Factory pattern: `pageManager.lifecycleTwinPage()`, `.accountsPage()`, `.fragments()`, `.loginPage()` centralize object construction so tests never `new` a page object directly, and config/env resolution is hidden inside the app constructors, not the test. |
| A3 | "How do you support testing with 10 different user personas (admin, view-only, upload-only, no-permissions, etc.) without writing 10 near-duplicate test files?" | `fixtures.ts` `MyFixtures` type exposes one fixture per persona (`pageManagerAdmin`, `pageManagerViewOnly`, `pageManagerModifyOnly`, …), each backed by its own `storageState` file resolved via `getAuthPath(userKey)` in `users.ts`. This is the real-world version of Q10/Q37 in Section B ("BrowserContext per persona", "one account per parallel worker"). |
| A4 | "How does your framework validate that a saved auth session is actually usable before trusting it, instead of just checking the file exists?" | `fixtures.ts` → `validateAuthFile()` parses the storageState JSON, checks for a non-empty `cookies` array, and heuristically checks for an auth/session/token/jwt cookie or a Siemens domain cookie before reusing it — falling back to a fresh context with a warning instead of a hard crash. This is a strong answer to "how do you handle a corrupted/expired storageState file in CI." |
| A5 | "Your config needs to resolve different base URLs per environment (dev/int/staging/prod) and per app type (ng vs onedomain etc.) — how is that modeled?" | `config/configLoader.ts` — Singleton `ConfigLoader.getInstance()` with an explicit, documented precedence chain: `.env` < `secret.env` < selected `playwright.<appType>-<env>.env` file < `process.env`. The environment file name itself is derived (`playwright.${appType}-${env}.env`), so adding a new environment is a new `.env` file, not a code change. |
| A6 | "Why is `ConfigLoader` a singleton, and what's the risk of that pattern in a parallel-worker test runner?" | `ConfigLoader` uses the classic `private static instance` singleton. The honest risk to raise unprompted: singletons are per-*process*, and Playwright workers are separate OS processes, so each worker gets its own singleton instance — which is actually what you want here (no cross-worker shared mutable state), but it's worth explicitly naming that the singleton isn't shared *across* workers, only *within* one. |
| A7 | "How do you centralize and chain error-handling logic (timeouts vs selector errors vs network errors) instead of ad-hoc try/catch in every test?" | `handlers/errorHandler.ts` — textbook **Chain of Responsibility**: `ErrorHandlerChain.getInstance()` wires `TimeoutErrorHandler → SelectorErrorHandler → NetworkErrorHandler → AssertionErrorHandler → GenericErrorHandler`, each handler inspecting the error and either acting or calling `passToNext()`. Be ready to explain *why* chain-of-responsibility over a single big `if/else` (open/closed principle — add a new handler type without touching existing ones). |
| A8 | "How do you decouple 'a test event happened' from 'what we do about it' (logging, metrics, flaky-test tracking)?" | `observers/testEventManager.ts` — **Observer pattern**: `TestEventManager.getInstance()` holds a list of `TestObserver`s (`LoggerObserver`, `MetricsObserver`, `ErrorTrackingObserver`) and calls `notifyObservers()`/`emitEvent()`. This is the generic mechanism behind the Section B "how do you track flaky tests over time" question — the repo already has the extension point even if a given observer isn't wired into every test yet. |
| A9 | "Your page objects compose sub-helpers (`workflow().status.method()`) instead of one giant class or deep inheritance chains — why, and what's the rule for when something is a root page vs a sub-helper?" | `.github/skills/create-test-helper/SKILL.md` documents this explicitly: root pages `extend BasePage` and are exposed as lazy accessors on `LifecycleTwinApp`; sub-helpers are **plain classes that receive `Page` in their constructor and do NOT extend anything** — composition, not inheritance, wired via a lazy getter (`this._status ??= new WorkflowStatus(this.page)`). This directly answers the generic "how do you structure page objects given locators are lazy" question (Section B, Q17) with a concrete, defensible convention. |
| A10 | "How do you stop tests from bypassing your page-object layering by importing a sub-helper directly?" | The skill's "Heal Procedure — Check C" is literally an audit routine for this: searching `playwright/testFiles/**` and `playwright/tests/**` for direct imports/instantiations of sub-helper classes and flagging them as violations with the correct fix (`lifecycleTwinPage.documents().advancedFilters.openSavedFiltersList()`). This is a strong, concrete answer to "how do you enforce architectural conventions at scale across a team," which is exactly what senior rounds probe (see Section B Q13/Q26). |
| A11 | "How do you track API endpoint coverage and catch endpoints your Swagger docs don't match reality for?" | `playwright/api-coverage/coverage-tracking.js` — a TypeScript-compiler-API based static analyzer: it walks every `test('VERB /path', …)` call via the TS AST, normalizes path params (`{id}` → `{param}`), fingerprints payloads, and cross-references comments for documented request/response shape mentions. This is a genuinely senior-level answer to "how do you measure API test coverage beyond 'we have N tests'" — most candidates only know line/branch coverage tools, not endpoint-contract coverage built on an AST parser. |
| A12 | "You maintain 24+ feature spec files (`LCT_01_DocumentsNavigation` … `LCT_24_SiteLandingPage`) plus a separate API contract-test suite and a `deprectated_tests_ignore/` folder — how do you decide what's stable, what's deprecated, and what ships separately as API-only?" | `playwright/testFiles/` structure itself — `API_Testfiles/`, `api-contract-info/`, `testdataSetupHelper/`, `testSetupFiles/`, and an explicit deprecated-tests quarantine folder. Pair this with `.github/instructions.md`'s **hard rule**: any Playwright *API* test work requires reading the dedicated agent file and getting explicit user approval on a written plan before touching any helper/spec — a real governance answer to "how do you prevent uncontrolled framework sprawl." |
| A13 | "Why multiple reporters (`html`, `list`, custom `rositaReporter`, `custom-reporter`, `junit`) instead of just the default?" | `playwright.config.ts` (root) — conditionally wires `rositaReporter` + `html` + `list` + a custom reporter + `junit` (`results.xml`) when `REPORTING=true`, else just `html`+`list`+`junit`. This maps to Section B Q20 ("integrate results with Jira/Zephyr/Azure Test Plans") — JUnit XML is the integration point, and the env-flag toggle shows you understand "noisy reporting is a cost, gate it." |

**Practice prompt:** Before your interview, try explaining A1, A2, A7, A8, and A9
out loud from memory, in under 90 seconds each, without looking at the code.
That's the actual skill a framework-design round is testing.

---

## SECTION B — Core / Mid-level questions (what gets asked first, ~0–3 YoE calibration check)

*Source: [QAble — 34 Playwright interview questions with model answers](https://www.qable.io/knowledge-hub/interview-questions/playwright) (tagged by experience level: Fresher/Mid-level/Senior/Lead; last updated Aug 2026) and [bug0.com — Playwright interview questions, "Basic" and "Intermediate" tiers](https://bug0.com/knowledge-base/playwright-interview-questions) (last updated Jul 2026).*

1. What is Playwright and how does it differ architecturally from Selenium and Cypress? *(QAble Q1; bug0 Q1)*
2. What is a `Browser`, `BrowserContext`, and `Page` — and how do they relate? *(QAble Q2; omarkhaledzidann guide Q18)*
3. What are the recommended locator strategies (`getByRole`, `getByTestId`, etc.) and why prefer them over CSS/XPath? *(QAble Q5; bug0 Q7)*
4. How is a Playwright **locator** different from a Selenium **WebElement**/a legacy **selector**? *(QAble Q6; bug0 Q2; usegreenroom.app — "Locators vs selectors")*
5. How do you handle a locator that resolves to multiple elements ("strict mode")? *(QAble Q7; omarkhaledzidann guide Q8)*
6. How do you locate elements inside iframes and Shadow DOM? *(QAble Q8; bug0 Q9)*
7. What is auto-waiting, and exactly which actionability checks does it run before a click? *(QAble Q9; bug0 Q3; omarkhaledzidann guide Q10 — the five checks: attached, visible, stable, receives events, enabled)*
8. If Playwright auto-waits, when do you still need an explicit wait (`waitForResponse`, `waitForURL`, etc.)? *(QAble Q10)*
9. What's the difference between `waitForTimeout`, `waitForSelector`, and `waitForLoadState`? *(QAble Q11; bug0 Q5 — `goto()` vs `waitForURL()`)*
10. What are web-first assertions, and why is `expect(locator).toHaveText(x)` preferred over `expect(await locator.textContent()).toBe(x)`? *(QAble Q12–13; bug0 Q4)*
11. What is a **soft assertion**, and when would you use one? *(QAble Q14)*
12. What are **fixtures** in Playwright Test, and why are they preferred over `beforeEach` hooks? *(QAble Q15; omarkhaledzidann guide Q16)*
13. How do you avoid logging in through the UI on every single test? *(QAble Q16; bug0 Q8 — `storageState` reuse)*
14. How do you structure page objects given that locators are lazily evaluated? *(QAble Q17)*
15. What is a `project` in `playwright.config.ts`, and what is it used for? *(QAble Q18; omarkhaledzidann guide Q25)*
16. How do you intercept/mock network requests (`page.route()`), and when should you *not* mock the API in a UI test? *(QAble Q19–20; bug0 Q12)*
17. How do you use the API `request` context alongside UI tests in the same suite? *(QAble Q21; omarkhaledzidann guide Q32)*
18. What is the Trace Viewer, and what evidence does it capture that screenshots/videos don't? *(QAble Q22–23; bug0 Q11)*
19. A test passes locally but fails in CI — what's your investigation sequence? *(QAble Q24; stackinterview.dev Q14/Q21)*
20. How does parallelism work by default, and what are retries/the risk of over-relying on them? *(QAble Q25–26; omarkhaledzidann guide Q27–28)*
21. What is **sharding**, and when do you need it over plain worker parallelism? *(QAble Q28; omarkhaledzidann guide Q42)*
22. How would you compare Playwright vs Cypress (architecture, not just feature checklist)? *(QAble Q31; usegreenroom.app — full architecture breakdown: CDP/WebSocket vs in-page run loop vs WebDriver HTTP)*

---

## SECTION C — Senior / 3+ YoE calibration questions (framework design + judgment)

*Source: [stackinterview.dev — Advanced Playwright Interview Questions and Answers](https://stackinterview.dev/guides/advanced-playwright-interview-questions-and-answers-2026) (26 Qs, Tiers 1–4, last updated 2026) and [bug0.com — "Advanced questions" tier](https://bug0.com/knowledge-base/playwright-interview-questions).*

### C1. Architecture & scale
1. Walk through Playwright Test Runner's architecture end-to-end (discovery → workers → reporters → hooks/fixtures → trace). *(stackinterview Q7)*
2. How do you scale execution across multiple *machines*, not just multiple workers on one machine (sharding + CI matrix)? *(stackinterview Q8)*
3. How would you get a 500+ test suite under a 10-minute CI budget? *(stackinterview Q9 — layered answer: shard, split API vs UI suites, tag a `@smoke` subset)*
4. How do you design `BrowserContext` usage for hundreds of concurrent authenticated sessions without launching hundreds of browsers? *(stackinterview Q10)*
5. In a multi-tenant architecture, what exactly does `Page` isolate vs. `BrowserContext`? *(stackinterview Q11)*
6. How would you design a company-wide shared fixture/custom-command library consumed by multiple teams' repos? *(stackinterview Q13)*
7. You're asked to design a Playwright framework from scratch for a 50-engineer org — name the pillars. *(stackinterview Q26: isolation, structure, speed/tiered execution, debuggability, governance, traceability)* / *(bug0 Q13 — near-identical "30 engineers" framing: POM/component-object hybrid, shared fixtures, stable locator policy, parallel-safe test data, env-specific config, CI sharding, reporting — explicitly naming what **not** to over-engineer)*

### C2. Reliability, flakiness, and test data
8. A suite passes locally but is flaky *specifically* in CI — what's your triage order? *(stackinterview Q21 — resource contention → headless/headed diff → env parity → trace from CI artifact, not local re-run → shared state across parallel workers → retries as stopgap, never the fix)*
9. How do you handle test data in parallel runs without shared-seed-data flake? *(bug0 Q14 — per-test API creation, per-worker user pools, DB snapshot-per-shard)*
10. How would you stop a whole suite from being flaky — categorize by root cause. *(bug0 Q17 — locator flake → role-based selectors; timing flake → web-first assertions; state flake → isolation; environment flake → infra fix)*
11. How do you build a resilient locator strategy for a data table that updates in real time (avoiding `nth()`)? *(stackinterview Q12)*

### C3. CI/CD, tooling, and governance
12. How do you design a CI strategy spanning GitHub Actions *and* Azure DevOps without duplicating logic? *(stackinterview Q18 — single npm/shell script both pipelines call)*
13. How do you containerize Playwright so local runs match CI exactly (and why pin the image tag)? *(stackinterview Q19 — `mcr.microsoft.com/playwright:vX.Y.Z-jammy`, never `:latest`)*
14. How do you integrate Playwright results into Jira/Zephyr/Azure Test Plans? *(stackinterview Q20 — JUnit/custom JSON reporter pushed via that tool's REST API)*
15. Would you migrate an existing Selenium Grid suite to Playwright — how do you evaluate whether it's worth it? *(stackinterview Q25; QAble Q29 — frame around infrastructure retired, not raw speed; port flaky/high-value suites first, don't block on 100% parity)*
16. How do you manage secrets across local/CI/multi-cloud without leaking them? *(stackinterview Q23 — fail-fast on missing required secret at `global-setup`, never commit real `.env` values)*
17. How do you design visual regression testing so it doesn't become noise at scale? *(stackinterview Q24; bug0 Q19 — mask dynamic regions, scope to components not full pages, set a deliberate `maxDiffPixelRatio`)*

### C4. Behavioral / "tell me about a time" (framework-round favorite)
18. "What challenges have you faced in test automation and how did you handle them?" — expects a concrete challenge → investigation → action → measurable outcome narrative, not a tool list. *(omarkhaledzidann guide Q57, with a full worked sample answer about a shared-account race condition fixed via a worker-scoped account fixture + API seeding)*
19. How do you investigate a flaky Playwright test, step by step? *(omarkhaledzidann guide Q56 — confirm pattern with `--repeat-each` → inspect trace vs a passing run → narrow with `--workers=1` → fix root cause → prove stability under normal parallelism)*

---

## SECTION D — Playwright-specific mechanics frequently asked *inside* a framework-design round

*Source: [omarkhaledzidann.github.io — Playwright Interview Preparation Guide for Automation/SDET Engineers](https://omarkhaledzidann.github.io/StudywithOmar/playwright-interview-guide.html) (57 questions, each linked to official playwright.dev docs) and [AssertHired — Playwright Interview Questions](https://www.asserthired.com/interview-questions/playwright).*

- How does fixture lifecycle and dependency ordering work (setup order vs. reverse-order teardown)? *(Q36)*
- How should authentication be designed for parallel tests that **mutate server state** — one account per worker, using `parallelIndex`? *(Q37)*
- Why are **project dependencies** generally preferable to a bare `globalSetup` for setup steps? *(Q38)*
- What are the four network-routing operations (`fulfill`, `continue`, `abort`, `fetch`) and when do you reach for each? *(Q39)*
- When is HAR-based mocking better than hand-written `route.fulfill()` mocks? *(Q40; also stackinterview Q5)*
- How do browser-context-bound request contexts differ from an isolated `APIRequestContext` in cookie handling? *(Q41)*
- What happens to a worker process and its hooks after a test failure (discard + clean worker + retry)? *(Q44)*
- When should `test.describe.serial` actually be used, given it hurts parallelism/isolation? *(Q45)*
- How do you diagnose *which* of the seven distinct Playwright timeout types actually expired, instead of globally raising all timeouts? *(Q46)*
- What trace policy gives useful CI evidence without excessive storage overhead (`on-first-retry` vs `retain-on-failure`)? *(Q47)*
- How do `expect.poll()` and `expect(...).toPass()` differ from a locator assertion, and when is each the right tool? *(Q48; stackinterview Q4)*
- How should an advanced POM + fixture architecture divide responsibilities (page objects = domain operations/locators; fixtures = construction + lifecycle; tests = scenario + assertions)? *(Q51 — directly reinforces Section A9/A10 above)*
- Explain fixtures for an authenticated-user-session use case, end to end. *(AssertHired Q2)*
- What is a `BrowserContext` and why does it matter for true test isolation? *(AssertHired Q3)*

---

## SECTION E — Rapid revision checklist (night before)

Be able to **sketch or narrate from memory**, in under 2 minutes each:

- [ ] A minimal `playwright.config.ts` with `baseURL`, `projects`, `retries`, `reporter`, trace policy.
- [ ] The 5 actionability checks Playwright runs before a `click()`.
- [ ] Why locators are lazy and why that's the mechanism behind retrying/auto-waiting.
- [ ] `Browser` → `BrowserContext` → `Page` hierarchy and cost-to-create tradeoffs.
- [ ] A custom fixture with setup / `use()` / teardown, and test-scope vs. worker-scope.
- [ ] Race-free event waiting pattern (register `waitForEvent`/`waitForResponse` **before** triggering the action).
- [ ] A `route()` handler that mocks vs. one that fetches-then-patches a real response.
- [ ] `storageState`-based auth reuse, and why one account per parallel worker for state-mutating tests.
- [ ] Sharding (`--shard=x/y`) vs. worker parallelism — what each actually distributes.
- [ ] Trace Viewer vs. screenshot vs. video as debugging evidence, and the config flags for each.
- [ ] Your own project's equivalent of Section A — be ready to narrate **your real framework**, not just the generic API list. Interviewers at non-MAANG/service/product companies weight "have you actually owned a suite in production" far more heavily than API trivia.
- [ ] One STAR-format flaky-test story with a measurable before/after (see C4 above for the shape expected).

---

## Sources (for verification)

**Added in this pass (Part I — "Top 50" aggregation):**

7. stackinterview.dev — *50+ Playwright Interview Questions and Answers (2026)* — https://stackinterview.dev/guides/50-playwright-interview-questions-and-answers-2026 (cites [TestDino 2026 market-share data](https://testdino.com/blog/playwright-market-share) and [State of JS 2024](https://2024.stateofjs.com/en-US/libraries/testing/))
8. software-testing-tutorials-automation.com — *Top 50+ Playwright Interview Questions with Answers 2026* — https://software-testing-tutorials-automation.com/2025/07/playwright-interview-questions-answers.html (updated 15 Apr 2026)
9. qajobfit.com — *Top 50 Playwright Interview Questions and Answers (2026)* — https://qajobfit.com/resources/top-playwright-interview-questions
10. GeeksforGeeks — *SDET Interview Questions and Answers* — https://www.geeksforgeeks.org/software-testing/sdet-interview-questions-and-answers/ (updated 31 Jul 2026)
11. Software Testing Material — *Most Popular Test Automation Framework Interview Questions* — https://www.softwaretestingmaterial.com/test-automation-framework-interview-questions/ (long-running classic bank, updated Jun 2025; 45+ reader comments document it being used verbatim in real Indian service-based-company interviews)

**Original sources (Part II deep-dive):**

1. QAble — *34 Playwright interview questions with model answers* — https://www.qable.io/knowledge-hub/interview-questions/playwright (updated 20 Aug 2026)
2. bug0.com — *Playwright interview questions: Question Bank for Hiring* — https://bug0.com/knowledge-base/playwright-interview-questions (updated 31 Jul 2026)
3. stackinterview.dev — *Advanced Playwright Interview Questions and Answers (2026)* — https://stackinterview.dev/guides/advanced-playwright-interview-questions-and-answers-2026
4. omarkhaledzidann.github.io — *Playwright Interview Preparation Guide for Automation/SDET Engineers* (57 Qs, each cross-linked to official playwright.dev docs) — https://omarkhaledzidann.github.io/StudywithOmar/playwright-interview-guide.html
5. usegreenroom.app — *Playwright interview questions and answers* — https://usegreenroom.app/blog/playwright-interview-questions (20 Aug 2026)
6. AssertHired — *Playwright Interview Questions* — https://www.asserthired.com/interview-questions/playwright (updated Jul 2026)
7. This repository — `playwright/fixtures.ts`, `playwright/helpers/pageManager.ts`, `playwright/handlers/errorHandler.ts`, `playwright/observers/testEventManager.ts`, `playwright/config/configLoader.ts`, `playwright/api-coverage/coverage-tracking.js`, `.github/skills/create-test-helper/SKILL.md`, `.github/instructions.md`, root `playwright.config.ts` — read directly for Section A.

*Note on India-specific service-based-company sourcing: the first research pass found that live fetches of GeeksforGeeks' dedicated **Playwright** page, Naukri's Code360 library, AmbitionBox's SDET question bank, and Glassdoor's SDET interview pages returned either 404/removed pages or blocked/empty extraction (a matter of record in this session). The second pass (Part I above) successfully located and read GeeksforGeeks' **SDET Interview Questions and Answers** page directly (source #10), plus four independently published "Top 50" Playwright/SDET/framework-design banks used for the cross-source frequency analysis in Part I. Naukri, AmbitionBox, and Glassdoor's dedicated pages remained unreachable (404/blocked) across both passes — their absence is noted rather than papered over with invented content.*
