import { Page, Locator, expect } from "@playwright/test";
import ProductSearchPage from "./productSearchPage";
class ProductDetailsPage {
  private newPage: Page
  readonly productSearchPage: ProductSearchPage
  private productCount: number
  private readonly DEFAULT_TIMEOUT = 10000;
  private readonly PRODUCT_TITLE_SELECTOR = '#productTitle';
  private readonly DISCOUNT_PERCENTAGE_SELECTOR = '.savingsPercentage';
  private readonly PRODUCT_PRICE_SELECTOR = '.a-price-whole';
  private readonly ADD_TO_CART_LABEL = 'Add to Cart';
  private readonly GO_TO_CART_SELECTOR = '#sw-gtc';
  private readonly PRODUCT_IN_CART_SELECTOR = '.a-section.a-spacing-mini.sc-list-body.sc-java-remote-feature > .a-row';
  private readonly REMOVE_PRODUCT_TEXT = 'Delete';


  constructor(page: Page, productSearchPage: ProductSearchPage) {
    this.newPage = page
    this.productSearchPage = productSearchPage
    this.productCount = 0
  }

  get productNameLocator(): Locator {
    return this.newPage.locator(this.PRODUCT_TITLE_SELECTOR);
  }

  get discountedPercentageLocator(): Locator {
    return this.newPage.locator(this.DISCOUNT_PERCENTAGE_SELECTOR);
  }

  get productPriceLocator(): Locator {
    return this.newPage.locator(this.PRODUCT_PRICE_SELECTOR);
  }

  get addToCart(): Locator {
    return this.newPage.getByLabel(this.ADD_TO_CART_LABEL);
  }

  get goToCart(): Locator {
    return this.newPage.locator(this.GO_TO_CART_SELECTOR).getByRole('link', { name: 'Go to Cart' });
  }

  get productInCart(): Locator {
    return this.newPage.locator(this.PRODUCT_IN_CART_SELECTOR);
  }

  get removeProduct(): Locator {
    return this.newPage.getByText(this.REMOVE_PRODUCT_TEXT);
  }


  async updatePage(): Promise<void> {
    this.newPage = await this.productSearchPage.getNewPage()
  }

  async getExpectedProductDetails(): Promise<string[]> {
    const expectedProductDetails: string[] = []
    const elements = [
      this.productNameLocator,
      this.discountedPercentageLocator.first(),
      this.productPriceLocator.first()
    ]

    for (let element of elements) {
      const text = await element.textContent();
      if (text) {
        expectedProductDetails.push(text.trim().toLowerCase());
      }
    }
    return expectedProductDetails
  }

  async formatExpectedProductDetails(expectedProductDetails: string[], brandName: string): Promise<string[]> {

    const expectedModified = expectedProductDetails.slice();
    expectedModified[0] = expectedProductDetails[0].replace(brandName, '').trim();
    expectedModified.splice(1, 0, brandName);

    const discountRegex = /^-(\d+)%$/; // Matches format like "-50%"
    const discountMatch = expectedModified[2].match(discountRegex);
    if (discountMatch) {
      expectedModified[2] = `(${discountMatch[1]}% off)`; // Convert to "(50% off)" format
    }

    return expectedModified
  }
  async validateProductDetails(actualProductDetails: string[], expectedProductDetails: string[]): Promise<void> {
    let expectedModified: string[] = expectedProductDetails;
    try {
      const brandName = actualProductDetails[1];
      expectedModified = await this.formatExpectedProductDetails(expectedProductDetails, brandName);
      expect(actualProductDetails).toHaveLength(expectedModified.length);

      actualProductDetails.forEach((detail, index) => {
        expect(detail).toBe(expectedModified[index]);
      });
    } catch (error) {
      console.error('Validation failed:', error);
      throw new Error(`Product details validation failed. Expected: ${expectedModified}, Actual: ${actualProductDetails}`);
    }
  }

  async addProductToCart(): Promise<void> {
    await this.addToCart.click();
  }

  async goToCartPage(): Promise<void> {
    await this.goToCart.click()
    await this.productInCart.first().waitFor({ state: 'visible', timeout: this.DEFAULT_TIMEOUT })
  }

  async verifyProductPresenceInCart(): Promise<void> {

    // I am just checking the count because product title present in cart is dynamic so we cannot go with the product name
    this.productCount = await this.productInCart.count()
    expect(this.productCount).toBeGreaterThanOrEqual(1)
  }

  async removeProductFromCart(): Promise<void> {
    // I am delete all product from cart because as product title is dynamic so it is not possible to chain through the product title and delete only that product
    for (let i = 0; i < this.productCount; i++) {
      await this.removeProduct.nth(i).click();
    }
    this.productCount = 0;
  }
}

export default ProductDetailsPage;