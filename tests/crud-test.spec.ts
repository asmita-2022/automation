import { test, expect } from '../fixtures/api.fixture';
import { CrudPage } from '../pages/crud.page';

test.describe.configure({
  mode: 'serial',
});

test.describe(
  'CRUD Operations Assignment Testing Suite',
  () => {
    const uniqueId =
      Date.now().toString().slice(-7);

    const timestamp =
      Date.now().toString();

    const branchName =
      `World Branch ${timestamp}`;

    const branchSlug =
      `hello-world-branch-${timestamp}`;

    const branchEmail =
      `world${timestamp}@gmail.com`;

    const branchUpdateName =
      `World Main Branch Updated ${timestamp}`;

    const branchPhone =
      `984${uniqueId}`;

    const adminPhone =
      `985${uniqueId}`;

    const adminFirstName = 'Hello';
    const adminLastName = 'Universe';

    // =======================================================
    // LOGIN
    // =======================================================

    test.beforeEach(async ({ page }) => {
      test.setTimeout(90000);

      const crudPage =
        new CrudPage(page);

      // Open application
      await crudPage.goto();

      console.log(
        'LOGIN PAGE URL:',
        page.url()
      );

      // Wait for page to load
      await page.waitForLoadState(
        'domcontentloaded'
      );

      await page.waitForTimeout(1000);

      // Email
      const emailInput =
        page.getByRole('textbox', {
          name: 'Email *',
        });

      await emailInput.waitFor({
        state: 'visible',
        timeout: 30000,
      });

      await emailInput.fill(
        process.env.ORG_ADMIN_EMAIL || ''
      );

      // Password
      const passwordInput =
        page.locator(
          '[name="password"]'
        );

      await passwordInput.waitFor({
        state: 'visible',
        timeout: 30000,
      });

      await passwordInput.fill(
        process.env.ORG_ADMIN_PASSWORD || ''
      );

      console.log(
        'LOGIN CREDENTIALS FILLED.'
      );

      // Login
      await page
        .getByRole('button', {
          name: 'Log in',
          exact: true,
        })
        .click();

      // Wait for login
      await page.waitForLoadState(
        'networkidle'
      ).catch(() => {
        console.log(
          'Network idle timeout after login - continuing.'
        );
      });

      console.log(
        'AFTER LOGIN URL:',
        page.url()
      );

      await page.waitForTimeout(1000);

      console.log(
        'LOGIN SUCCESSFULLY COMPLETED.'
      );
    });

    // =======================================================
    // CREATE
    // =======================================================

    test(
      'CREATE BRANCH',
      async ({
        page,
        branchService,
      }) => {
        const crudPage =
          new CrudPage(page);

        // Set true before creation so cleanup
        // is attempted even if verification fails.
        let cleanupNeeded = true;

        try {
          // Create branch
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

          // Search branch
          await crudPage.searchBranch(
            branchName
          );

          // Get branch row
          const branchRow =
            crudPage.getBranchRow(
              branchName
            );

          // Verify branch is visible
          await expect(
            branchRow
          ).toBeVisible({
            timeout: 15000,
          });

          // Verify branch name
          await expect(
            branchRow
          ).toContainText(
            branchName
          );

          // Verify email
          await expect(
            branchRow.getByText(
              branchEmail
            )
          ).toBeVisible();

          console.log(
            'BRANCH CREATED AND VERIFIED SUCCESSFULLY.'
          );

          // UI creation and verification succeeded.
          // API cleanup is still required.
        } finally {
          if (cleanupNeeded) {
            try {
              await branchService.deleteBranch(
                branchSlug
              );

              console.log(
                'CREATE TEST CLEANUP SUCCESSFUL.'
              );
            } catch (error) {
              console.log(
                'CREATE TEST CLEANUP FAILED:',
                error
              );
            }
          }
        }
      }
    );
test(
  'READ BRANCH',
  async ({
    page,
    branchService,
  }) => {
    const crudPage =
      new CrudPage(page);

    let cleanupNeeded = true;

    try {
      // ==========================================
      // CREATE TEST DATA
      // ==========================================

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

      console.log(
        'READ TEST: Branch created successfully.'
      );

      // ==========================================
      // SEARCH / READ BRANCH
      // ==========================================

      await crudPage.searchBranch(
        branchName
      );

      const branchRow =
        crudPage.getBranchRow(
          branchName
        );

      // ==========================================
      // VERIFY BRANCH IS VISIBLE
      // ==========================================

      await expect(
        branchRow
      ).toBeVisible({
        timeout: 15000,
      });

      console.log(
        'READ TEST: Branch is visible in UI.'
      );

      // ==========================================
      // VERIFY BRANCH NAME
      // ==========================================

      await expect(
        branchRow
      ).toContainText(
        branchName
      );

      // ==========================================
      // VERIFY SLUG
      // ==========================================

      await expect(
        branchRow
      ).toContainText(
        branchSlug
      );

      // ==========================================
      // VERIFY EMAIL
      // ==========================================

      await expect(
        branchRow.getByText(
          branchEmail
        )
      ).toBeVisible();

      // ==========================================
      // VERIFY ADMIN PHONE
      // ==========================================
      //
      // The branch list displays:
      // +9779850453182
      //
      // This is the ADMIN phone, not the
      // branch phone.
      // ==========================================

      const formattedAdminPhone =
        `+977${adminPhone}`;

      await expect(
        branchRow
      ).toContainText(
        formattedAdminPhone
      );

      console.log(
        'READ TEST: Admin phone verified.'
      );

      // ==========================================
      // READ TEST PASSED
      // ==========================================

      console.log(
        'READ TEST: Branch data verified successfully.'
      );

    } finally {

      // ==========================================
      // CLEANUP
      // ==========================================

      if (cleanupNeeded) {
        try {
          await branchService.deleteBranch(
            branchSlug
          );

          console.log(
            'READ TEST CLEANUP SUCCESSFUL.'
          );

        } catch (error) {
          console.log(
            'READ TEST CLEANUP FAILED:',
            error
          );
        }
      }
    }
  }
);
    // =======================================================
    // UPDATE
    // =======================================================

    test(
      'UPDATE BRANCH',
      async ({
        page,
        branchService,
      }) => {
        const crudPage =
          new CrudPage(page);

        let cleanupNeeded = true;

        try {
          // -------------------------------------------------
          // CREATE BRANCH
          // -------------------------------------------------

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

          // -------------------------------------------------
          // SEARCH BRANCH
          // -------------------------------------------------

          await crudPage.searchBranch(
            branchName
          );

          // -------------------------------------------------
          // OPEN EDIT PAGE
          // -------------------------------------------------

          await crudPage.openEditBranch(
            branchName,
            branchSlug
          );

          // -------------------------------------------------
          // VERIFY EXISTING DATA
          // -------------------------------------------------

          await expect(
            crudPage.locators.slugInput
          ).toHaveValue(
            branchSlug
          );

          await expect(
            crudPage.locators.emailInput
          ).toHaveValue(
            branchEmail
          );

          await expect(
            crudPage.locators.addressInput
          ).toHaveValue(
            'Shankhamul, Kathmandu'
          );

          console.log(
            'EXISTING BRANCH DATA VERIFIED.'
          );

          // -------------------------------------------------
          // UPDATE BRANCH
          // -------------------------------------------------

          await crudPage.updateBranchName(
            branchUpdateName,
            branchSlug
          );

          console.log(
            'BRANCH UPDATE VERIFIED SUCCESSFULLY.'
          );
        } finally {
          // -------------------------------------------------
          // CLEANUP
          // -------------------------------------------------

          if (cleanupNeeded) {
            try {
              await branchService.deleteBranch(
                branchSlug
              );

              console.log(
                'UPDATE TEST CLEANUP SUCCESSFUL.'
              );
            } catch (error) {
              console.log(
                'UPDATE TEST CLEANUP FAILED:',
                error
              );
            }
          }
        }
      }
    );

    // =======================================================
    // DELETE
    // =======================================================

    test(
      'DELETE BRANCH',
      async ({
        page,
        branchService,
      }) => {
        const crudPage =
          new CrudPage(page);

        let cleanupNeeded = true;

        try {
          // -------------------------------------------------
          // CREATE BRANCH
          // -------------------------------------------------

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

          // -------------------------------------------------
          // SEARCH BRANCH
          // -------------------------------------------------

          await crudPage.searchBranch(
            branchName
          );

          // -------------------------------------------------
          // VERIFY BRANCH EXISTS
          // -------------------------------------------------

          await expect(
            crudPage.getBranchRow(
              branchName
            )
          ).toBeVisible({
            timeout: 15000,
          });

          console.log(
            'BRANCH FOUND BEFORE DELETE.'
          );

          // -------------------------------------------------
          // DELETE THROUGH UI
          // -------------------------------------------------

          await crudPage.deleteBranchFromUI(
            branchName
          );

          // -------------------------------------------------
          // SEARCH AGAIN
          // -------------------------------------------------

          await crudPage.searchBranch(
            branchName
          );

          // -------------------------------------------------
          // VERIFY BRANCH IS DELETED
          // -------------------------------------------------

          await expect(
            crudPage.getBranchRow(
              branchName
            )
          ).toBeHidden({
            timeout: 15000,
          });

          console.log(
            'BRANCH DELETED FROM UI SUCCESSFULLY.'
          );

          // UI deletion succeeded.
          // Do not perform API cleanup again.
          cleanupNeeded = false;
        } finally {
          // -------------------------------------------------
          // BACKUP API CLEANUP
          // -------------------------------------------------

          if (cleanupNeeded) {
            try {
              await branchService.deleteBranch(
                branchSlug
              );

              console.log(
                'DELETE TEST BACKUP CLEANUP SUCCESSFUL.'
              );
            } catch (error) {
              console.log(
                'DELETE CLEANUP FAILED:',
                error
              );
            }
          }
        }
      }
    );
  }
);