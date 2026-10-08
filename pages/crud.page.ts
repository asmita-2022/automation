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

      inactiveOption: page.getByRole(
        'option',
        {
          name: 'Inactive',
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

  // =======================================================
  // OPEN APPLICATION
  // =======================================================

  async goto(): Promise<void> {
    await this.page.goto(
      'https://qa03.stage.chairlyo.com/',
      {
        waitUntil: 'domcontentloaded',
      }
    );
  }

  // =======================================================
  // CREATE BRANCH
  // =======================================================

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
    console.log(
      'Opening Add Branch...'
    );

    // -----------------------------------------------------
    // Open Add Branch
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // Branch information
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // Branch phone
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // Status
    // -----------------------------------------------------

    await this.locators.statusDropdown.click();

    await this.locators.activeOption.waitFor({
      state: 'visible',
      timeout: 10000,
    });

    await this.locators.activeOption.click();

    // -----------------------------------------------------
    // Branch admin
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // Admin phone
    // -----------------------------------------------------

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

    console.log(
      'Branch phone:',
      await this.locators.phoneInput.inputValue()
    );

    console.log(
      'Admin phone:',
      await this.locators.adminPhoneInput.inputValue()
    );

    // -----------------------------------------------------
    // Save
    // -----------------------------------------------------

    await this.locators.saveChangesButton.waitFor({
      state: 'visible',
      timeout: 15000,
    });

    await expect(
      this.locators.saveChangesButton
    ).toBeEnabled({
      timeout: 15000,
    });

    console.log(
      'Clicking Save Changes...'
    );

    // -----------------------------------------------------
    // Wait for CREATE request
    // -----------------------------------------------------

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

    console.log(
      'CREATE REQUEST METHOD:',
      createResponse.request().method()
    );

    console.log(
      'CREATE REQUEST URL:',
      createResponse.url()
    );

    console.log(
      'CREATE RESPONSE STATUS:',
      createResponse.status()
    );

    expect(
      createResponse.ok(),
      'Create branch API request should succeed'
    ).toBeTruthy();

    // -----------------------------------------------------
    // Return to branch list
    // -----------------------------------------------------

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

    console.log(
      'Branch list loaded after creation.'
    );
  }

  // =======================================================
  // SEARCH BRANCH
  // =======================================================

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

  // =======================================================
  // GET BRANCH ROW
  // =======================================================

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

  // =======================================================
  // OPEN EDIT BRANCH
  // =======================================================

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
      branchRow.getByRole('link', {
        name: 'Edit branch',
      });

    await expect(
      editLink
    ).toBeVisible({
      timeout: 10000,
    });

    // -----------------------------------------------------
    // Wait for branch GET request
    // -----------------------------------------------------

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

    console.log(
      'Branch GET response received.'
    );

    // -----------------------------------------------------
    // Wait for edit page
    // -----------------------------------------------------

    await this.locators.slugInput.waitFor({
      state: 'visible',
      timeout: 30000,
    });

    // -----------------------------------------------------
    // Wait for React to populate form
    // -----------------------------------------------------

    await expect(
      this.locators.slugInput
    ).toHaveValue(slug, {
      timeout: 30000,
    });

    console.log(
      'Edit branch page loaded.'
    );
  }

  // =======================================================
  // UPDATE BRANCH NAME
  // =======================================================

  async updateBranchName(
    updatedName: string,
    slug: string
  ): Promise<void> {
    // -----------------------------------------------------
    // Fill updated name
    // -----------------------------------------------------

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
    ).toHaveValue(updatedName);

    console.log(
      'Updated branch name entered.'
    );

    // -----------------------------------------------------
    // Verify Save Changes button
    // -----------------------------------------------------

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

    console.log(
      'Save Changes button is visible and enabled.'
    );

    // -----------------------------------------------------
    // Wait for PATCH request
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // Click Save Changes
    // -----------------------------------------------------

    console.log(
      'Clicking Save Changes for update...'
    );

    await this.locators.saveChangesButton.click({
      timeout: 15000,
    });

    // -----------------------------------------------------
    // Wait for PATCH request and response
    // -----------------------------------------------------

    const [
      updateRequest,
      updateResponse,
    ] = await Promise.all([
      updateRequestPromise,
      updateResponsePromise,
    ]);

    console.log(
      'UPDATE REQUEST METHOD:',
      updateRequest.method()
    );

    console.log(
      'UPDATE REQUEST URL:',
      updateRequest.url()
    );

    console.log(
      'UPDATE RESPONSE STATUS:',
      updateResponse.status()
    );

    // -----------------------------------------------------
    // Verify updated name
    // -----------------------------------------------------

    await expect(
      this.page.locator('body')
    ).toContainText(
      updatedName,
      {
        timeout: 30000,
      }
    );

    console.log(
      'UPDATED BRANCH NAME VERIFIED.'
    );
  }

  // =======================================================
  // DELETE BRANCH FROM UI
  // =======================================================

  async deleteBranchFromUI(
    branchName: string
  ): Promise<void> {
    const branchRow =
      this.getBranchRow(branchName);

    // -----------------------------------------------------
    // Verify branch row
    // -----------------------------------------------------

    await expect(
      branchRow
    ).toBeVisible({
      timeout: 15000,
    });

    // -----------------------------------------------------
    // Find actual delete action
    // -----------------------------------------------------
    //
    // The page has:
    //
    // <span class="sr-only">
    //   Delete branch
    // </span>
    //
    // and the actual trash SVG.
    //
    // We click the parent of the trash SVG.
    // -----------------------------------------------------

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

    console.log(
      'Delete action found.'
    );

    // -----------------------------------------------------
    // Click delete action
    // -----------------------------------------------------

    await deleteAction.click({
      timeout: 15000,
    });

    console.log(
      'Delete action clicked.'
    );

    // -----------------------------------------------------
    // EXACT Delete Branch button
    // -----------------------------------------------------

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

    console.log(
      'Delete Branch confirmation button found.'
    );

    // -----------------------------------------------------
    // Check for confirmation checkbox
    // -----------------------------------------------------

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
        await lastCheckbox.isVisible()
      ) {
        console.log(
          'Confirmation checkbox found.'
        );

        if (
          !(await lastCheckbox.isChecked())
        ) {
          await lastCheckbox.check();
        }
      }
    }

    // -----------------------------------------------------
    // Check for confirmation textbox
    // -----------------------------------------------------

    const textboxes =
      this.page.getByRole('textbox');

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
          console.log(
            'Confirmation textbox found.'
          );

          await lastTextbox.fill(
            'Delete Branch'
          );
        }
      }
    }

    // -----------------------------------------------------
    // Wait for Delete Branch to become enabled
    // -----------------------------------------------------

    await expect(
      confirmButton
    ).toBeEnabled({
      timeout: 10000,
    });

    console.log(
      'Delete Branch button is enabled.'
    );

    // -----------------------------------------------------
    // Wait for DELETE API request
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // Click Delete Branch
    // -----------------------------------------------------

    await confirmButton.click({
      timeout: 15000,
    });

    console.log(
      'Delete Branch clicked.'
    );

    const deleteResponse =
      await deleteResponsePromise;

    console.log(
      'DELETE REQUEST METHOD:',
      deleteResponse.request().method()
    );

    console.log(
      'DELETE REQUEST URL:',
      deleteResponse.url()
    );

    console.log(
      'DELETE RESPONSE STATUS:',
      deleteResponse.status()
    );

    expect(
      deleteResponse.ok(),
      'Delete branch API request should succeed'
    ).toBeTruthy();

    // -----------------------------------------------------
    // Verify branch disappeared
    // -----------------------------------------------------

    await expect(
      branchRow
    ).toBeHidden({
      timeout: 30000,
    });

    console.log(
      'Branch deleted from UI.'
    );
  }
}