import { test, expect } from '../fixtures/api.fixture';
import { CrudPage } from '../pages/crud.page';

test.describe(
  'Hybrid Branch API + UI Testing',
  () => {

    test.setTimeout(120000);

    test(
      'API Create → UI Verify → UI Update → API Verify → API Delete → UI Verify',
      async ({
        page,
        branchService,
      }) => {

        const crudPage =
          new CrudPage(page);

        // Test data
        const timestamp =
          Date.now().toString();

        const branchName =
          `Hybrid Branch ${timestamp}`;

        const branchSlug =
          `hybrid-branch-${timestamp}`;

        const branchEmail =
          `hybrid${timestamp}@gmail.com`;

        const branchPhone =
          `984${timestamp.slice(-7)}`;

        const adminPhone =
          `985${timestamp.slice(-7)}`;

        const adminFirstName =
          'Hybrid';

        const adminLastName =
          `Admin${timestamp}`;

        const adminEmail =
          `hybrid.admin.${timestamp}@gmail.com`;

        const adminUsername =
          `hybrid.admin.${timestamp}`;

        const updatedBranchName =
          `Hybrid Branch Updated ${timestamp}`;

        let createdBranchSlug:
          string | undefined;

        let createdBranchId:
          number | undefined;

        let deletedByApi = false;

        try {

          // =================================================
          // LOGIN
          // =================================================

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

          // =================================================
          // STEP 1 — API CREATE
          // =================================================

          const createdBranch =
            await branchService.createBranch({
              name: branchName,
              slug: branchSlug,
              email: branchEmail,
              phone: `+977${branchPhone}`,
              address: 'Shankhamul, Kathmandu',
              status: 'active',

              branch_admin: {
                first_name: adminFirstName,
                last_name: adminLastName,
                email: adminEmail,
                username: adminUsername,
                password: 'Paramparaaaa@123',
                phone: `+977${adminPhone}`,
              },
            });

          createdBranchId =
            createdBranch.id;

          createdBranchSlug =
            createdBranch.slug;

          // API CREATE assertions
          expect(
            createdBranch
          ).toBeDefined();

          expect(
            createdBranch.id
          ).toBeGreaterThan(0);

          expect(
            createdBranch.name
          ).toBe(
            branchName
          );

          expect(
            createdBranch.slug
          ).toBe(
            branchSlug
          );

          expect(
            createdBranch.email
          ).toBe(
            branchEmail
          );

          expect(
            createdBranch.phone
          ).toBe(
            `+977${branchPhone}`
          );

          expect(
            createdBranch.address
          ).toBe(
            'Shankhamul, Kathmandu'
          );

          expect(
            createdBranch.status
          ).toBe(
            'active'
          );

          expect(
            createdBranch.admin
          ).toBeDefined();

          expect(
            createdBranch.admin.email
          ).toBe(
            adminEmail
          );

          // =================================================
          // STEP 2 — UI VERIFY API CREATE
          // =================================================

          await page.goto(
            'https://qa03.stage.chairlyo.com/',
            {
              waitUntil:
                'domcontentloaded',
            }
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

          // UI displays the admin email.
          await expect(
            branchRow
          ).toContainText(
            adminEmail
          );

          // =================================================
          // STEP 3 — UI UPDATE
          // =================================================

          await crudPage.openEditBranch(
            branchName,
            branchSlug
          );

          // Verify existing data
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

          // Update through UI
          await crudPage.updateBranchName(
            updatedBranchName,
            branchSlug
          );

          // =================================================
          // STEP 4 — API VERIFY UI UPDATE
          // =================================================

          const updatedBranch =
            await branchService.getBranch(
              branchSlug
            );

          expect(
            updatedBranch.id
          ).toBe(
            createdBranchId
          );

          expect(
            updatedBranch.name
          ).toBe(
            updatedBranchName
          );

          expect(
            updatedBranch.slug
          ).toBe(
            branchSlug
          );

          expect(
            updatedBranch.email
          ).toBe(
            branchEmail
          );

          expect(
            updatedBranch.address
          ).toBe(
            'Shankhamul, Kathmandu'
          );

          // =================================================
          // STEP 5 — API DELETE
          // =================================================

          await branchService.deleteBranch(
            branchSlug
          );

          deletedByApi = true;

          // =================================================
          // STEP 6 — API VERIFY DELETION
          // =================================================

          await expect(
            branchService.getBranch(
              branchSlug
            )
          ).rejects.toThrow();

          // =================================================
          // STEP 7 — UI VERIFY DELETION
          // =================================================

          await page.goto(
            'https://qa03.stage.chairlyo.com/',
            {
              waitUntil:
                'domcontentloaded',
            }
          );

          await crudPage.searchBranch(
            updatedBranchName
          );

          const deletedBranchRow =
            crudPage.getBranchRow(
              updatedBranchName
            );

          await expect(
            deletedBranchRow
          ).toBeHidden({
            timeout: 15000,
          });

        } finally {

          // Safety cleanup if API delete was not reached.
          if (
            createdBranchSlug &&
            !deletedByApi
          ) {
            try {
              await branchService.deleteBranch(
                createdBranchSlug
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