import {
  Page,
  Locator,
  expect,
} from '@playwright/test';

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
      addBranchButton: page.getByRole(
        'button',
        {
          name: 'Add Branch',
        }
      ),

      branchNameInput: page.getByLabel(
        'Branch Name*'
      ),

      slugInput: page.getByLabel(
        'Slug*'
      ),

      emailInput: page
        .getByLabel('Email*')
        .first(),

      addressInput: page.getByLabel(
        'Address*'
      ),

      phoneInput: page
        .locator('input[name="phone"]')
        .first(),

      statusDropdown: page.locator(
        'text=Select Status'
      ),

      activeOption: page.getByRole(
        'option',
        {
          name: 'Active',
          exact: true,
        }
      ),

      firstNameInput: page.getByLabel(
        'First Name*'
      ),

      lastNameInput: page.getByLabel(
        'Last Name*'
      ),

      adminEmailInput: page
        .getByLabel('Email*')
        .nth(1),

      passwordInput: page.locator(
        'input[type="password"]'
      ),

      adminPhoneInput: page
        .locator('input[name="phone"]')
        .nth(1),

      saveChangesButton: page.getByRole(
        'button',
        {
          name: 'Save Changes',
          exact: true,
        }
      ),

      searchInput: page.getByPlaceholder(
        'Search...'
      ),
    };
  }

  async goto(): Promise<void> {
    await this.page.goto(
      'https://qa03.stage.chairlyo.com/',
      {
        waitUntil: 'domcontentloaded',
      }
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
  ): Promise<void> {

    await this.locators.addBranchButton
      .first()
      .waitFor({
        state: 'visible',
        timeout: 30000,
      });

    await this.locators.addBranchButton
      .first()
      .click();

    await this.locators.branchNameInput
      .waitFor({
        state: 'visible',
        timeout: 30000,
      });

    await this.locators.branchNameInput.fill(
      name
    );

    await this.locators.slugInput.fill(
      slug
    );

    await this.locators.emailInput.fill(
      email
    );

    await this.locators.addressInput.fill(
      address
    );

    await this.locators.phoneInput.click();

    await this.locators.phoneInput.press(
      'End'
    );

    await this.locators.phoneInput.type(
      phone,
      {
        delay: 50,
      }
    );

    await this.locators.statusDropdown.click();

    await this.locators.activeOption.waitFor({
      state: 'visible',
      timeout: 10000,
    });

    await this.locators.activeOption.click();

    await this.locators.firstNameInput.fill(
      fName
    );

    await this.locators.lastNameInput.fill(
      lName
    );

    await this.locators.adminEmailInput.fill(
      email
    );

    await this.locators.passwordInput.fill(
      'Paramparaaaa@123'
    );

    await this.locators.adminPhoneInput.click();

    await this.locators.adminPhoneInput.press(
      'End'
    );

    await this.locators.adminPhoneInput.type(
      adminPhone,
      {
        delay: 50,
      }
    );

    await this.locators.saveChangesButton.waitFor({
      state: 'visible',
      timeout: 15000,
    });

    await expect(
      this.locators.saveChangesButton
    ).toBeEnabled({
      timeout: 15000,
    });

    const createResponsePromise =
      this.page.waitForResponse(
        response =>
          response.request().method() ===
            'POST' &&
          response.url().includes(
            '/branch/branches/'
          ) &&
          response.status() >= 200 &&
          response.status() < 300
      );

    await this.locators.saveChangesButton.click();

    const createResponse =
      await createResponsePromise;

    expect(
      createResponse.ok(),
      'Create branch API request should succeed'
    ).toBeTruthy();

    await this.page.goto(
      'https://qa03.stage.chairlyo.com/',
      {
        waitUntil: 'domcontentloaded',
      }
    );

    await this.locators.searchInput.waitFor({
      state: 'visible',
      timeout: 30000,
    });
  }

  async searchBranch(
    name: string
  ): Promise<void> {

    await this.locators.searchInput.waitFor({
      state: 'visible',
      timeout: 30000,
    });

    await this.locators.searchInput.clear();

    await this.locators.searchInput.fill(
      name
    );

    await this.page.keyboard.press(
      'Enter'
    );

    await this.page.waitForTimeout(2000);
  }

  getBranchRow(
    branchName: string
  ): Locator {
    return this.page
      .locator('tr')
      .filter({
        hasText: branchName,
      })
      .first();
  }

  async openEditBranch(
    branchName: string,
    slug: string
  ): Promise<void> {

    const branchRow =
      this.getBranchRow(branchName);

    await expect(
      branchRow
    ).toBeVisible({
      timeout: 15000,
    });

    const editLink =
      branchRow.getByRole(
        'link',
        {
          name: 'Edit branch',
        }
      );

    await expect(
      editLink
    ).toBeVisible({
      timeout: 10000,
    });

    const branchResponsePromise =
      this.page.waitForResponse(
        response =>
          response.request().method() ===
            'GET' &&
          response.url().includes(
            `/branch/branches/${slug}/`
          ) &&
          response.status() === 200
      );

    await editLink.click();

    await branchResponsePromise;

    await this.locators.slugInput.waitFor({
      state: 'visible',
      timeout: 30000,
    });

    await expect(
      this.locators.slugInput
    ).toHaveValue(
      slug,
      {
        timeout: 30000,
      }
    );
  }

  async updateBranchName(
    updatedName: string,
    slug: string
  ): Promise<void> {

    await expect(
      this.locators.branchNameInput
    ).toBeVisible({
      timeout: 15000,
    });

    await this.locators.branchNameInput.fill(
      updatedName
    );

    await expect(
      this.locators.branchNameInput
    ).toHaveValue(
      updatedName
    );

    await expect(
      this.locators.saveChangesButton
    ).toBeVisible({
      timeout: 15000,
    });

    await expect(
      this.locators.saveChangesButton
    ).toBeEnabled({
      timeout: 15000,
    });

    const updateRequestPromise =
      this.page.waitForRequest(
        request =>
          request.method() === 'PATCH' &&
          request.url().includes(
            `/branch/branches/${slug}/`
          )
      );

    const updateResponsePromise =
      this.page.waitForResponse(
        response =>
          response.request().method() ===
            'PATCH' &&
          response.url().includes(
            `/branch/branches/${slug}/`
          ) &&
          response.status() === 200
      );

    await this.locators.saveChangesButton.click({
      timeout: 15000,
    });

    const [
      updateRequest,
      updateResponse,
    ] = await Promise.all([
      updateRequestPromise,
      updateResponsePromise,
    ]);

    expect(
      updateRequest.method()
    ).toBe('PATCH');

    expect(
      updateResponse.status()
    ).toBe(200);

    await expect(
      this.page.locator('body')
    ).toContainText(
      updatedName,
      {
        timeout: 30000,
      }
    );
  }

  async deleteBranchFromUI(
    branchName: string
  ): Promise<void> {

    const branchRow =
      this.getBranchRow(branchName);

    await expect(
      branchRow
    ).toBeVisible({
      timeout: 15000,
    });

    const deleteAction =
      branchRow
        .locator(
          'svg.lucide-trash-2'
        )
        .locator('..');

    await expect(
      deleteAction
    ).toBeVisible({
      timeout: 10000,
    });

    await deleteAction.click({
      timeout: 15000,
    });

    const confirmButton =
      this.page.getByRole(
        'button',
        {
          name: 'Delete Branch',
          exact: true,
        }
      );

    await expect(
      confirmButton
    ).toBeVisible({
      timeout: 10000,
    });

    const checkboxes =
      this.page.locator(
        'input[type="checkbox"]'
      );

    const checkboxCount =
      await checkboxes.count();

    if (checkboxCount > 0) {
      const lastCheckbox =
        checkboxes.last();

      if (
        await lastCheckbox.isVisible() &&
        !(await lastCheckbox.isChecked())
      ) {
        await lastCheckbox.check();
      }
    }

    const textboxes =
      this.page.getByRole(
        'textbox'
      );

    const textboxCount =
      await textboxes.count();

    if (textboxCount > 0) {
      const lastTextbox =
        textboxes.last();

      if (
        await lastTextbox.isVisible()
      ) {
        const value =
          await lastTextbox.inputValue();

        if (!value) {
          await lastTextbox.fill(
            'Delete Branch'
          );
        }
      }
    }

    await expect(
      confirmButton
    ).toBeEnabled({
      timeout: 10000,
    });

    const deleteResponsePromise =
      this.page.waitForResponse(
        response =>
          response.request().method() ===
            'DELETE' &&
          response.url().includes(
            '/branch/branches/'
          ) &&
          response.status() >= 200 &&
          response.status() < 300
      );

    await confirmButton.click({
      timeout: 15000,
    });

    const deleteResponse =
      await deleteResponsePromise;

    expect(
      deleteResponse.ok(),
      'Delete branch API request should succeed'
    ).toBeTruthy();

    await expect(
      branchRow
    ).toBeHidden({
      timeout: 30000,
    });
  }
}