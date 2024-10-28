import { test } from "@fixtures/productDetails-fixtures";
import { productDetailsData } from "@data/productDetailsData";
import { filterProductData } from "@data/filterProductData";

let actualProductDetails: string[];
let expectedProductDetails: string[];

test.beforeEach(async ({ productSearchPage, loginPage }, testInfo) => {
  test.setTimeout(testInfo.timeout + 60000)
  await test.step(`Navigate to Application`, async () => {
    await loginPage.navigateToURL();
  });

  await test.step(`Search for product: ${productDetailsData.productName}`, async () => {
    await productSearchPage.searchProduct(productDetailsData.productName, productDetailsData.delayTime);
  });

  await test.step(`Apply Brand Filters:${filterProductData.filterNames.join(', ')}`, async () => {
    await productSearchPage.applyBrandFilters(filterProductData.filterNames)
  })

  await test.step(`Apply Discount Filter:${filterProductData.discount}% percent`, async () => {
    await productSearchPage.applyDiscountFilter(filterProductData.discount)
  })

  await test.step('Get Actual Product Details', async () => {
    actualProductDetails = await productSearchPage.getActualProductDetails()
  })

  await test.step('Go to Product Details Page', async () => {
    await productSearchPage.goToProductDetailsPage()
  })
})


test('Validate Product Details then Add it to Cart Functionality',
  {
    tag: ["@sanity", "@regression"]
  },
  async ({ productDetailsPage }) => {

    await test.step('Update Search Page to Product Details Page', async () => {
      await productDetailsPage.updatePage()
    })

    await test.step('Get Expected Product Details', async () => {
      expectedProductDetails = await productDetailsPage.getExpectedProductDetails()
    })

    await test.step('Verify product Details', async () => {
      await productDetailsPage.validateProductDetails(actualProductDetails, expectedProductDetails)
    })

    await test.step('Add Product to Cart', async () => {
      await productDetailsPage.addProductToCart()
    })

    await test.step('Go to Cart Page', async () => {
      await productDetailsPage.goToCartPage()
    })

    await test.step('Validate that the Product is Added to Cart', async () => {
      await productDetailsPage.verifyProductPresenceInCart()
    })
  })


test.afterEach(async ({ productDetailsPage }) => {
  await productDetailsPage.removeProductFromCart()
})