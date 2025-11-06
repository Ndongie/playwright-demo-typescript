# Playwright TypeScript Automation Framework
A robust test automation framework built with Playwright and TypeScript for testing web applications. This framework includes global setup/teardown, custom reporting, and multi-browser testing capabilities.

## 🚀 Features
1. TypeScript Support: Type-safe test development
2. Multi-Browser Testing: Chromium, Firefox, and WebKit support
3. Global Setup/Teardown: Pre-test setup and post-test cleanup
4. Custom Reporting: Enhanced test reporting with custom listeners
5. Parallel Execution: Optimized for CI/CD with configurable workers
6. Trace & Video Capture: Automatic trace and video recording on failures
7. Environment Configuration: Flexible setup for different environments

## 📋 Prerequisites
- Node.js 16 or higher
- npm

## 🛠️ Installation
1. Install dependencies
``` bash
npm install
```
2. Install Playwright browsers
``` bash
npx playwright install
```
3. Verify installation
```bash
npx playwright --version
```
## 🏗️ Project Structure
playwright-demo-typescript/
├── pages/
│   └── CartPage.ts             # cartPage object
│   └── Homepage.ts             # Homepage page object
│   └── ProductPage.ts          # ProductPage page object
│   └── LoginPage.ts            # LoginPage page object
├── tests/
│   ├── specs/
│   │   ├── login.spec.ts       # Login tests
│   │   └── product.spec.ts     # Product tests
|   |── hooks/
|   |   └── test-hooks.ts
│   └── data/
│       └── testData.json
├── utils/
│   └── helpers.ts            # test helpers
│   └── logger.ts             # custom logger
│   └── listener.ts           # Custom test reporter
│   └── wait-strategies.ts    # Custom wait strategies
├── global-setup.ts           # Global setup file
├── global-teardown.ts        # Global teardown file
├── playwright.config.ts      # Playwright configuration
├── package.json              # Project dependencies
└── test-results/             # Test execution results

## 🧪 Running Tests
### Specific Test Suites
```bash
# Run login tests
npm run login

# Run product tests
npm run product

# Run regression tests
npm run regression

# Run smoke tests
npm run smoke

# Run all tests
npm run test
```
### Playwright CLI Commands
```bash
# Run all tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run tests with specific project
npx playwright test --project=chromium

# Run tests with specific tag
npx playwright test --grep="@regression"

# Run tests in debug mode
npx playwright test --debug

# Generate HTML report
npx playwright show-report
```
### Test Filtering
```bash
# Run specific test file
npx playwright test tests/specs/login.spec.ts

# Run tests matching pattern
npx playwright test --grep="authentication"

# Run tests excluding pattern
npx playwright test --grep-invert="product"
```
## ⚙️ Configuration
### Playwright Config Key Settings
1. Base URL: https://www.demoblaze.com/
2. Timeout: 60 seconds global timeout
3. Retries: 2 retries on CI, 0 locally
4. Workers: 1 on CI, undefined locally
5. Trace: On first retry
6. Screenshot: Only on failure
7. Video: On first retry

### Browser Support
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)

### Test Setup Dependencies
- Firefox and WebKit tests depend on setup project
- Global setup/teardown for test environment management

## 📊 Test Reports
- The framework generates multiple report formats:
- List Reporter: Console output with test status
- HTML Reporter: Interactive HTML report
- Custom Listener: Enhanced test reporting via ./utils/listener.ts

View HTML reports:
```bash
npx playwright show-report
```
## 🔧 Environment Setup
- Global Setup & Teardown
- global-setup.ts: Runs before all tests
- Project-specific setup in tests/configs/setup.ts

### CI/CD Configuration
- The framework is optimized for CI environments with:
- Limited workers (4) on CI
- Automatic retries (2) on failures
- Maximum failures limit (10)
- Trace and video capture for debugging

## 🐛 Debugging
### View Traces
```bash
npx playwright show-trace trace.zip
```
### Debug Mode
```bash
npx playwright test --debug
```
### Inspect Mode
```bash
npx playwright test --inspector
```

## 📝 Test Development
### Writing Tests
Create test files in tests/specs/ following the pattern:

```typescript
import { test, expect } from '@playwright/test';

test('user login flow', { tag: '@regression' }, async ({ page }) => {
  await page.goto('/');
  // Test implementation
});
```
### Test Tags
Use tags for test categorization:
- @regression: Regression test suite
- @smoke: Smoke test suite
- @authentication: Authentication test suite
- @product: Product test suite
- Add custom tags as needed