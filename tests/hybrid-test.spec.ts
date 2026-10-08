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

        // ===================================================
        // TEST DATA
        // ===================================================

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

        try {

          // ===================================================
          // LOGIN
          // ===================================================

          await crudPage.goto();

          console.log(
            'HYBRID: Login page opened.'
          );

          await page.waitForLoadState(
            'domcontentloaded'
          );

          await page.waitForTimeout(1000);

          const emailInput =
            page.getByRole(
              'textbox',
              {
                name: 'Email *',
              }
            );

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
            .getByRole(
              'button',
              {
                name: 'Log in',
                exact: true,
              }
            )
            .click();

          await page
            .waitForLoadState(
              'networkidle'
            )
            .catch(() => {
              console.log(
                'HYBRID: Network idle timeout after login - continuing.'
              );
            });

          console.log(
            'HYBRID: Login successful.'
          );

          // ===================================================
          // STEP 1 — API CREATE
          // ===================================================

          console.log(
            'HYBRID STEP 1: Creating branch through API...'
          );

          const createdBranch =
            await branchService.createBranch({
              name: branchName,

              slug: branchSlug,

              email: branchEmail,

              phone:
                `+977${branchPhone}`,

              address:
                'Shankhamul, Kathmandu',

              status:
                'active',

              branch_admin: {

                first_name:
                  adminFirstName,

                last_name:
                  adminLastName,

                email:
                  adminEmail,

                username:
                  adminUsername,

                password:
                  'Paramparaaaa@123',

                phone:
                  `+977${adminPhone}`,
              },
            });

          // Capture created branch information
          createdBranchId =
            createdBranch.id;

          createdBranchSlug =
            createdBranch.slug;

          console.log(
            'HYBRID CREATED BRANCH ID:',
            createdBranchId
          );

          console.log(
            'HYBRID CREATED BRANCH NAME:',
            createdBranch.name
          );

          console.log(
            'HYBRID CREATED BRANCH SLUG:',
            createdBranch.slug
          );

          // ---------------------------------------------------
          // API CREATE ASSERTIONS
          // ---------------------------------------------------

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

          console.log(
            'HYBRID: API CREATE successful.'
          );

          // ===================================================
          // STEP 2 — UI VERIFY API-CREATED BRANCH
          // ===================================================

          console.log(
            'HYBRID STEP 2: Verifying API-created branch in UI...'
          );

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

          // ---------------------------------------------------
          // Verify branch is visible
          // ---------------------------------------------------

          await expect(
            branchRow
          ).toBeVisible({
            timeout: 15000,
          });

          // ---------------------------------------------------
          // Verify branch name
          // ---------------------------------------------------

          await expect(
            branchRow
          ).toContainText(
            branchName
          );

          // ---------------------------------------------------
          // Verify branch slug
          // ---------------------------------------------------

          await expect(
            branchRow
          ).toContainText(
            branchSlug
          );

          // ---------------------------------------------------
          // Verify ADMIN email displayed in UI
          // ---------------------------------------------------
          //
          // The Branch list UI displays the ADMIN email,
          // not the branch email.
          //

          await expect(
            branchRow
          ).toContainText(
            adminEmail
          );

          console.log(
            'HYBRID: API-created branch verified in UI.'
          );

          // ===================================================
          // STEP 3 — UI UPDATE
          // ===================================================

          console.log(
            'HYBRID STEP 3: Updating branch through UI...'
          );

          await crudPage.openEditBranch(
            branchName,
            branchSlug
          );

          // ---------------------------------------------------
          // Verify existing branch data
          // ---------------------------------------------------

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
            'HYBRID: Existing branch data verified.'
          );

          // ---------------------------------------------------
          // Update branch name through UI
          // ---------------------------------------------------

          await crudPage.updateBranchName(
            updatedBranchName,
            branchSlug
          );

          console.log(
            'HYBRID: UI update successful.'
          );

          // ===================================================
          // STEP 4 — API VERIFY UI UPDATE
          // ===================================================

          console.log(
            'HYBRID STEP 4: Verifying UI update through API...'
          );

          const updatedBranch =
            await branchService.getBranch(
              branchSlug
            );

          // ---------------------------------------------------
          // Verify same branch ID
          // ---------------------------------------------------

          expect(
            updatedBranch.id
          ).toBe(
            createdBranchId
          );

          // ---------------------------------------------------
          // Verify updated name
          // ---------------------------------------------------

          expect(
            updatedBranch.name
          ).toBe(
            updatedBranchName
          );

          // ---------------------------------------------------
          // Verify slug
          // ---------------------------------------------------

          expect(
            updatedBranch.slug
          ).toBe(
            branchSlug
          );

          // ---------------------------------------------------
          // Verify email
          // ---------------------------------------------------

          expect(
            updatedBranch.email
          ).toBe(
            branchEmail
          );

          // ---------------------------------------------------
          // Verify address
          // ---------------------------------------------------

          expect(
            updatedBranch.address
          ).toBe(
            'Shankhamul, Kathmandu'
          );

          console.log(
            'HYBRID: API confirmed UI update.'
          );

          // ===================================================
          // STEP 5 — API DELETE
          // ===================================================

          console.log(
            'HYBRID STEP 5: Deleting branch through API...'
          );

          await branchService.deleteBranch(
            branchSlug
          );

          console.log(
            'HYBRID: API delete successful.'
          );

          // ===================================================
          // STEP 6 — API VERIFY DELETION
          // ===================================================

          console.log(
            'HYBRID STEP 6: Verifying API deletion...'
          );

          await expect(
            branchService.getBranch(
              branchSlug
            )
          ).rejects.toThrow();

          console.log(
            'HYBRID: API deletion verified.'
          );

          // ===================================================
          // STEP 7 — UI VERIFY DELETION
          // ===================================================

          console.log(
            'HYBRID STEP 7: Verifying deletion in UI...'
          );

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

          console.log(
            'HYBRID: Deleted branch is no longer visible in UI.'
          );

          // ===================================================
          // FINAL SUCCESS LOG
          // ===================================================

          console.log(
            '=========================================='
          );

          console.log(
            'HYBRID TEST PASSED SUCCESSFULLY.'
          );

          console.log(
            'Created Branch ID:',
            createdBranchId
          );

          console.log(
            'Created Branch Name:',
            branchName
          );

          console.log(
            'Updated Branch Name:',
            updatedBranchName
          );

          console.log(
            '=========================================='
          );

        } finally {

          // ===================================================
          // SAFETY CLEANUP
          // ===================================================

          if (createdBranchSlug) {

            try {

              await branchService.deleteBranch(
                createdBranchSlug
              );

              console.log(
                'HYBRID SAFETY CLEANUP COMPLETED.'
              );

            } catch (error) {

              console.log(
                'HYBRID SAFETY CLEANUP: Branch already deleted or cleanup not required.'
              );

            }
          }
        }
      }
    );
  }
);