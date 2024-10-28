import { Page, Locator, expect, BrowserContext } from '@playwright/test';

class ProductSearchPage {
  readonly page: Page;
  readonly PRODUCT_NAME: Locator
  readonly SEARCH_INPUT_FIELD: Locator
  readonly BRAND_NAME: Locator
  readonly PRODUCT_PRICE: Locator
  readonly SEE_MORE: Locator
  readonly DISCOUNTED_PERCENTAGE: Locator
  readonly WAIT_FOR: string
  readonly waitForTimeout: number
  readonly context: BrowserContext
  private newPage: Page
  readonly discountRegex: RegExp
  readonly EXPECTED_SEARCH_RESULT: Locator


  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.SEARCH_INPUT_FIELD = page.getByLabel('Search Amazon.in');
    this.PRODUCT_NAME = page.locator('.a-color-base.a-text-normal');
    this.DISCOUNTED_PERCENTAGE = page.locator('div > .a-row.a-size-base.a-color-base.a-size-base.a-color-base > div > span:nth-child(3)')
    this.PRODUCT_PRICE = page.locator('.a-price-whole')
    this.BRAND_NAME = page.locator('.s-title-instructions-style').locator('> div');
    this.SEE_MORE = page.getByText("See more").first()
    this.WAIT_FOR = '.sg-col-inner > span  > div > div > div > .s-widget-background'
    this.waitForTimeout = 10000
    this.context = context
    this.newPage = page
    this.discountRegex = /(\d+)(?=%)/;
    this.EXPECTED_SEARCH_RESULT = page.getByText('"shoes"', { exact: true })
  }

  async searchProduct(productName: string, delayTime: number): Promise<void> {
    await this.SEARCH_INPUT_FIELD.click();
    await this.SEARCH_INPUT_FIELD.pressSequentially(productName, { delay: delayTime });
    await this.page.keyboard.press('Enter');
    await this.SEE_MORE.waitFor({ state: 'visible', timeout: this.waitForTimeout })
  }

  async fetchProductNames(): Promise<string[]> {
    return this.PRODUCT_NAME.allTextContents();
  }


  async getTopProducts(items: string[], limit: number): Promise<string[]> {
    return items.slice(0, Math.min(limit, items.length));
  }


  async verifySearchResult(expectText: string): Promise<void> {
    expect(await this.EXPECTED_SEARCH_RESULT.textContent()).toEqual(expectText)
  }

  async getFilteredProductBrands(): Promise<string[]> {
    return this.BRAND_NAME.allTextContents();
  }


  async addFilter(filterName: string): Promise<Locator> {
    return this.page.getByRole('link', { name: filterName, exact: true });
  }

  async applyBrandFilters(filterNames: string[]): Promise<void> {
    for (const filterName of filterNames) {
      await this.SEE_MORE.click()
      const filterElement: Locator = await this.addFilter(filterName);
      await filterElement.click();
    };
    await this.page.waitForSelector(this.WAIT_FOR, { state: 'visible', timeout: this.waitForTimeout })
    await (await this.addFilter(filterNames[0])).waitFor({ state: 'visible', timeout: this.waitForTimeout })
  }

  async validateFilterByBrandName(limit: number, filterNames: string[]): Promise<void> {
    const allFilteredProducts: string[] = await this.getFilteredProductBrands();
    const topProducts = await this.getTopProducts(allFilteredProducts, limit);
    for (const brandName of topProducts) {
      const includesFilterName: boolean = filterNames.some((filterName: string) =>
        brandName.includes(filterName)
      );
      // Assert that the product name is found in the expected names
      expect(includesFilterName, `Product with "${brandName}" does not match any of the expected filter names`).toBe(true);
    }
  }

  async discountFilterLocator(discountPercent: number): Promise<Locator> {
    return this.page.getByText(`${discountPercent}% Off or more`)
  }

  async getFilteredProductDiscount(): Promise<string[]> {
    return await this.DISCOUNTED_PERCENTAGE.allTextContents()
  }

  async applyDiscountFilter(discountPercent: number): Promise<void> {
    await (await this.discountFilterLocator(discountPercent)).click();
    await this.page.waitForSelector(this.WAIT_FOR, { state: 'visible', timeout: this.waitForTimeout })
    await (await this.discountFilterLocator(discountPercent)).waitFor({ state: 'visible', timeout: this.waitForTimeout })
  }


  async validateFilterByDiscount(discountPercent: number, limit: number): Promise<void> {
    const allFilteredProductsDiscount: string[] = await this.getFilteredProductDiscount();
    const topDiscounts: string[] = await this.getTopProducts(allFilteredProductsDiscount, limit);

    for (const actualDiscount of topDiscounts) {
      const match = actualDiscount.match(this.discountRegex); // Extract numeric discount
      if (match) {
        const discountValue = +match[1];
        // Add assertion: Check if discount is greater than or equal to the expected discountPercent
        expect(discountValue, `Product with "${actualDiscount}" does not match the expected discount percentage`).toBeGreaterThanOrEqual(discountPercent);
      } else {
        throw new Error(`Invalid discount format: ${actualDiscount}`);
      }
    }
  }

  async goToProductDetailsPage(): Promise<void> {
    const pagePromise = this.context.waitForEvent('page')
    await this.PRODUCT_NAME.first().click()
    this.newPage = await pagePromise
    await this.newPage.waitForLoadState('domcontentloaded')
  }

  async getNewPage(): Promise<Page> {
    return this.newPage;
  }

  async getActualProductDetails(): Promise<string[]> {
    let productDetails: string[] = [];

    const elements = [
      this.PRODUCT_NAME.first(),
      this.BRAND_NAME.first(),
      this.DISCOUNTED_PERCENTAGE.first(),
      this.PRODUCT_PRICE.first()
    ]

    for (let element of elements) {
      const text = await element.textContent();
      if (text) {
        productDetails.push(text.trim().toLocaleLowerCase());
      }
    }
    return productDetails
  }
}

export default ProductSearchPage;
