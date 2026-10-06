import { test, expect } from '@playwright/test';
import { CrudPage } from '../pages/crud.page';

test.describe.configure({ mode: 'serial' });

test.describe('CRUD Operations Assignment Testing Suite', () => {

  const branchName = 'World Branch';
  const branchSlug = 'hello-world-branch';
  const branchEmail = 'world@gmail.com';

  const branchUpdateName = 'World Main Branch Updated';

  const branchPhone = '9840870509';
  const adminPhone = '9855870547';

  const adminFirstName = 'Asm';
  const adminLastName = 'Ydv';

  // LOGIN BEFORE EACH TEST
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90000);

    const crudPage = new CrudPage(page);

    await crudPage.goto();

    // LOGIN
    await page
      .getByLabel('Email*')
      .fill(process.env.ORG_ADMIN_EMAIL || '');

    await page
      .locator('[name="password"]')
      .fill(process.env.ORG_ADMIN_PASSWORD || '');

    await page
      .locator('button[type="submit"]')
      .click();

    await page.waitForLoadState('networkidle');

    console.log(
      'After login URL:',
      page.url()
    );
  });


  // =========================================================
  // 1. CREATE
  // =========================================================

  test('CREATE BRANCH', async ({ page }) => {

    const crudPage = new CrudPage(page);

    await crudPage.createBranch(
      branchName,
      branchSlug,
      branchEmail,
      'Shankhamul, Kathmandu',
      branchPhone,
      adminFirstName,
      adminLastName,
      adminPhone
    );

    // Wait until Branch list/Search page is available
    await crudPage.locators.searchInput.waitFor({
      state: 'visible',
      timeout: 30000,
    });

    await crudPage.searchBranch(branchName);

    const branchRow = page
      .getByRole('row')
      .filter({ hasText: branchName })
      .first();

    await expect(branchRow).toBeVisible({
      timeout: 15000,
    });

    await expect(
      branchRow.getByText(branchEmail)
    ).toBeVisible();
  });


  // =========================================================
  // 2. READ
  // =========================================================

  test('READ BRANCH', async ({ page }) => {

    const crudPage = new CrudPage(page);

    await crudPage.searchBranch(branchName);

    const branchRow = page
      .getByRole('row')
      .filter({ hasText: branchName })
      .first();

    await expect(branchRow).toBeVisible({
      timeout: 15000,
    });

    await expect(
      branchRow.getByText(branchEmail)
    ).toBeVisible();
  });


  // =========================================================
  // 3. UPDATE
  // =========================================================

  test('UPDATE BRANCH', async ({ page }) => {

    const crudPage = new CrudPage(page);

    await crudPage.searchBranch(branchName);

    const branchRow = page
      .getByRole('row')
      .filter({ hasText: branchName })
      .first();

    await expect(branchRow).toBeVisible({
      timeout: 15000,
    });

    // Click Edit
    await branchRow
      .locator(
        'button:has-text("Edit"), [aria-label*="edit"]'
      )
      .first()
      .click();

    await page.waitForTimeout(2000);

    // Update Branch Name
    const branchNameInput =
      page.getByLabel('Branch Name*');

    await expect(branchNameInput).toBeVisible({
      timeout: 15000,
    });

    await branchNameInput.fill(
      branchUpdateName
    );

    // Save
    await page
      .getByRole('button', {
        name: 'Save Changes',
      })
      .click();

    // Wait for Branch list
    await crudPage.locators.searchInput.waitFor({
      state: 'visible',
      timeout: 30000,
    });

    await crudPage.searchBranch(
      branchUpdateName
    );

    await expect(
      page
        .getByRole('row')
        .filter({
          hasText: branchUpdateName,
        })
        .first()
    ).toBeVisible({
      timeout: 15000,
    });
  });


  // =========================================================
  // 4. DELETE
  // =========================================================

  test('DELETE BRANCH', async ({ page }) => {

    const crudPage = new CrudPage(page);

    await crudPage.searchBranch(
      branchUpdateName
    );

    const branchRow = page
      .getByRole('row')
      .filter({
        hasText: branchUpdateName,
      })
      .first();

    await expect(branchRow).toBeVisible({
      timeout: 15000,
    });

    // Click Delete
    await branchRow
      .locator(
        'button:has-text("Delete"), [aria-label*="delete"]'
      )
      .first()
      .click();

    // Confirm deletion
    const confirmButton = page.locator(
      'button:has-text("Confirm"), ' +
      'button:has-text("Yes"), ' +
      'button:has-text("Delete")'
    ).first();

    await expect(confirmButton).toBeVisible({
      timeout: 10000,
    });

    await confirmButton.click();

    // Wait for Search to remain available
    await crudPage.locators.searchInput.waitFor({
      state: 'visible',
      timeout: 30000,
    });

    // Search deleted branch
    await crudPage.searchBranch(
      branchUpdateName
    );

    // Deleted branch should no longer exist
    await expect(
      page
        .getByRole('row')
        .filter({
          hasText: branchUpdateName,
        })
        .first()
    ).toBeHidden({
      timeout: 15000,
    });
  });

});