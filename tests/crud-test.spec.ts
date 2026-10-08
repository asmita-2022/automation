import { test, expect } from '../fixtures/api.fixture';
import { CrudPage } from '../pages/crud.page';

test.describe.configure({
  mode: 'serial',
});

test.describe(
  'CRUD Operations Assignment Testing Suite',
  () => {

    test.setTimeout(90000);

    const timestamp = Date.now().toString();
    const uniqueId = timestamp.slice(-7);

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

    const adminFirstName =
      'Hello';

    const adminLastName =
      'Universe';

    // =====================================================
    // LOGIN
    // =====================================================

    test.beforeEach(async ({ page }) => {

      const crudPage =
        new CrudPage(page);

      await crudPage.goto();

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

      await page
        .getByRole('button', {
          name: 'Log in',
          exact: true,
        })
        .click();

      await page
        .waitForLoadState('networkidle')
        .catch(() => {});
    });

    // =====================================================
    // CREATE
    // =====================================================

    test(
      'CREATE BRANCH',
      async ({
        page,
        branchService,
      }) => {

        const crudPage =
          new CrudPage(page);

        try {

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

          await crudPage.searchBranch(
            branchName
          );

          const branchRow =
            crudPage.getBranchRow(
              branchName
            );

          await expect(
            branchRow
          ).toBeVisible({
            timeout: 15000,
          });

          await expect(
            branchRow
          ).toContainText(
            branchName
          );

          await expect(
            branchRow
          ).toContainText(
            branchSlug
          );

          await expect(
            branchRow.getByText(
              branchEmail
            )
          ).toBeVisible();

        } finally {

          try {
            await branchService.deleteBranch(
              branchSlug
            );
          } catch {
            // Branch may already be deleted.
          }
        }
      }
    );

    // =====================================================
    // READ
    // =====================================================

    test(
      'READ BRANCH',
      async ({
        page,
        branchService,
      }) => {

        const crudPage =
          new CrudPage(page);

        try {

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

          await crudPage.searchBranch(
            branchName
          );

          const branchRow =
            crudPage.getBranchRow(
              branchName
            );

          await expect(
            branchRow
          ).toBeVisible({
            timeout: 15000,
          });

          await expect(
            branchRow
          ).toContainText(
            branchName
          );

          await expect(
            branchRow
          ).toContainText(
            branchSlug
          );

          await expect(
            branchRow.getByText(
              branchEmail
            )
          ).toBeVisible();

          // Branch list displays the admin phone.
          await expect(
            branchRow
          ).toContainText(
            `+977${adminPhone}`
          );

        } finally {

          try {
            await branchService.deleteBranch(
              branchSlug
            );
          } catch {
            // Branch may already be deleted.
          }
        }
      }
    );

    // =====================================================
    // UPDATE
    // =====================================================

    test(
      'UPDATE BRANCH',
      async ({
        page,
        branchService,
      }) => {

        const crudPage =
          new CrudPage(page);

        try {

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

          await crudPage.searchBranch(
            branchName
          );

          await crudPage.openEditBranch(
            branchName,
            branchSlug
          );

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

          await crudPage.updateBranchName(
            branchUpdateName,
            branchSlug
          );

        } finally {

          try {
            await branchService.deleteBranch(
              branchSlug
            );
          } catch {
            // Branch may already be deleted.
          }
        }
      }
    );

    // =====================================================
    // DELETE
    // =====================================================

    test(
      'DELETE BRANCH',
      async ({
        page,
        branchService,
      }) => {

        const crudPage =
          new CrudPage(page);

        let deletedByUI = false;

        try {

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

          await crudPage.searchBranch(
            branchName
          );

          await expect(
            crudPage.getBranchRow(
              branchName
            )
          ).toBeVisible({
            timeout: 15000,
          });

          await crudPage.deleteBranchFromUI(
            branchName
          );

          await crudPage.searchBranch(
            branchName
          );

          await expect(
            crudPage.getBranchRow(
              branchName
            )
          ).toBeHidden({
            timeout: 15000,
          });

          deletedByUI = true;

        } finally {

          // Backup cleanup only if UI deletion did not succeed.
          if (!deletedByUI) {
            try {
              await branchService.deleteBranch(
                branchSlug
              );
            } catch {
              // Branch may already be deleted.
            }
          }
        }
      }
    );
  }
);