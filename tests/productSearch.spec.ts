import { test } from "@fixtures/productSearch-fixtures";
import { productSearchData } from "@data/productSearchData";
import { productDetailsData } from "@data/productDetailsData";

test('Validate Search Functionality on Amazon Application',
  {
    tag: ["@sanity", "@regression"]
  },
  async ({ loginPage, productSearchPage }) => {
    await test.step(`Navigate to Application`, async () => {
      await loginPage.navigateToURL();
    });

    await test.step(`Search for product: ${productSearchData.productName}`, async () => {
      await productSearchPage.searchProduct(productSearchData.productName, productSearchData.delayTime);
    });

    await test.step(`Verify search results for ${productSearchData.expectedProductName} products`, async () => {
      await productSearchPage.verifySearchResult(productSearchData.expectedProductName);
    });
  })