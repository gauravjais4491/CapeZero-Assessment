import { test } from "@fixtures/filterProduct-fixtures";
import { filterProductData } from '@data/filterProductData'



test.beforeEach(async ({ productSearchPage, loginPage }) => {
  await test.step(`Navigate to Application`, async () => {
    await loginPage.navigateToURL();
  });

  await test.step(`Search for product: ${filterProductData.productName}`, async () => {
    await productSearchPage.searchProduct(filterProductData.productName, filterProductData.delayTime);
  });
})

test(`Validate Filter Functionality on Amazon by Brand Name`,
  {
    tag: ["@regression"],
  },
  async ({ productSearchPage }) => {
    await test.step(`Apply filters: ${filterProductData.filterNames.join(', ')}`, async () => {
      await productSearchPage.applyBrandFilters(filterProductData.filterNames);
    });

    await test.step(`Verify filtered product results for top ${filterProductData.limit} products`, async () => {
      await productSearchPage.validateFilterByBrandName(filterProductData.limit, filterProductData.filterNames);
    });
  })

test(`Validate Filter Functionality on Amazon by Discount`,
  {
    tag: ["@regression"],
  },
  async ({ productSearchPage }) => {
    await test.step(`Apply filters: ${filterProductData.discount}`, async () => {
      await productSearchPage.applyDiscountFilter(filterProductData.discount);
    });

    await test.step(`Verify filtered product results for top ${filterProductData.limit} products`, async () => {
      await productSearchPage.validateFilterByDiscount(filterProductData.discount, filterProductData.limit);
    });
  })

test.afterEach(async ({page}) => {
  await page.close()
})