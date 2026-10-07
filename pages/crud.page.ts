import { Page, Locator } from '@playwright/test';

export class CrudPage {
  readonly page: Page;

  readonly locators: {
    addBranchButton: Locator;
    branchNameInput: Locator;
    slugInput: Locator;
    emailInput: Locator;
    addressInput: Locator;
    phoneInput: Locator;
    statusDropdown: Locator;
    activeOption: Locator;
    inactiveOption: Locator;
    firstNameInput: Locator;
    lastNameInput: Locator;
    adminEmailInput: Locator;
    passwordInput: Locator;
    adminPhoneInput: Locator;
    saveChangesButton: Locator;
    searchInput: Locator;
  };

  constructor(page: Page) {
    this.page = page;

    this.locators = {
      addBranchButton: page.getByRole('button', {
        name: 'Add Branch',
      }),

      branchNameInput: page.getByLabel('Branch Name*'),

      slugInput: page.getByLabel('Slug*'),

      emailInput: page.getByLabel('Email*').first(),

      addressInput: page.getByLabel('Address*'),

      // Phone inputs
      phoneInput: page.locator('input[name="phone"]').first(),

      statusDropdown: page.locator('text=Select Status'),

      activeOption: page.getByRole('option', {
        name: 'Active',
        exact: true,
      }),

      inactiveOption: page.getByRole('option', {
        name: 'Inactive',
        exact: true,
      }),

      firstNameInput: page.getByLabel('First Name*'),

      lastNameInput: page.getByLabel('Last Name*'),

      adminEmailInput: page.getByLabel('Email*').nth(1),

      passwordInput: page.locator('input[type="password"]'),

      adminPhoneInput: page.locator('input[name="phone"]').nth(1),

      saveChangesButton: page.getByRole('button', {
        name: 'Save Changes',
      }),

      searchInput: page.getByPlaceholder('Search...'),
    };
  }

  async goto() {
    await this.page.goto(
      'https://qa03.stage.chairlyo.com/'
    );
  }

  async createBranch(
    name: string,
    slug: string,
    email: string,
    address: string,
    phone: string,
    fName: string,
    lName: string,
    adminPhone: string
  ) {
    console.log(
      'URL before Add Branch:',
      this.page.url()
    );

    console.log(
      'PAGE TITLE:',
      await this.page.title()
    );

    // ==========================================
    // OPEN ADD BRANCH
    // ==========================================

    await this.locators.addBranchButton.first().click();

    await this.page.waitForTimeout(2000);

    // ==========================================
    // BRANCH INFORMATION
    // ==========================================

    await this.locators.branchNameInput.fill(name);

    await this.locators.slugInput.fill(slug);

    await this.locators.emailInput.fill(email);

    await this.locators.addressInput.fill(address);

    // ==========================================
    // BRANCH PHONE
    // ==========================================
    //
    // Nepal (+977) is already selected by the
    // phone-number component.
    //
    // Therefore enter ONLY the 10-digit number.
    // Example: 9845870549
    //

   // Branch Phone
await this.locators.phoneInput.click();
await this.locators.phoneInput.press('End');
await this.locators.phoneInput.type(phone, {
  delay: 100,
});

    // ==========================================
    // STATUS
    // ==========================================

    await this.locators.statusDropdown.click();

    await this.page.waitForTimeout(500);

    // Select ONLY Active
    await this.locators.activeOption.click();

    // ==========================================
    // BRANCH ADMIN
    // ==========================================

    await this.locators.firstNameInput.fill(fName);

    await this.locators.lastNameInput.fill(lName);

    await this.locators.adminEmailInput.fill(email);

    await this.locators.passwordInput.fill(
      'Paramparaaaa@123'
    );

    // ==========================================
    // ADMIN PHONE
    // ==========================================
    //
    // Again, +977 is already handled by the
    // Nepal phone component.
    //

    // Admin Phone
await this.locators.adminPhoneInput.click();
await this.locators.adminPhoneInput.press('End');
await this.locators.adminPhoneInput.type(adminPhone, {
  delay: 100,
});

    // ==========================================
    // DEBUG PHONE VALUES
    // ==========================================

    console.log(
      'Branch phone value:',
      await this.locators.phoneInput.inputValue()
    );

    console.log(
      'Admin phone value:',
      await this.locators.adminPhoneInput.inputValue()
    );

    // ==========================================
    // SAVE
    // ==========================================

    await this.locators.saveChangesButton.click();

console.log('After Save URL:', this.page.url());
console.log('After Save Title:', await this.page.title());

await this.page.waitForTimeout(3000);

console.log(
  'Search input count:',
  await this.locators.searchInput.count()
);

console.log(
  'Search input visible:',
  await this.locators.searchInput.isVisible().catch(() => false)
);

console.log(
  'Current URL after wait:',
  this.page.url()
);
  }

  async searchBranch(name: string) {
    await this.locators.searchInput.waitFor({
      state: 'visible',
      timeout: 20000,
    });

    await this.locators.searchInput.clear();

    await this.locators.searchInput.fill(name);

    await this.page.keyboard.press('Enter');

    await this.page.waitForTimeout(4000);
  }
}