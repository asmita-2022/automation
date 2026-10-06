import { Locator, Page } from '@playwright/test';

export interface CrudLocators {
  addBranchBtn: Locator;
  branchNameInput: Locator;
  slugInput: Locator;
  phoneInput: Locator;
  emailInput: Locator;
  statusDropdown: Locator;
  addressInput: Locator;
  
  adminFirstName: Locator;
  adminLastName: Locator;
  adminEmail: Locator;
  adminPassword: Locator;
  adminPhone: Locator;
  phoneNumber: Locator;
  saveChangesBtn: Locator;
  timezoneDropdown: Locator;
  timezoneoption: Locator;
  tableRows: Locator;
}

export const crudLocators = (page: Page): CrudLocators => ({
  addBranchBtn: page.getByRole('button', { name: /add|create/i }),
  
  branchNameInput: page.locator('input#name'),
  slugInput: page.locator('input[name="slug"], input#slug'),
  
  // FIXED: Explicitly matches native telephone input tag index position structures to prevent focus shifts
  phoneInput: page.locator('input[type="tel"]').first(),
  emailInput: page.locator('input[type="email"], input[name="email"]').first(),
  
  statusDropdown: page.getByText('Select Status', { exact: true }),
  addressInput: page.locator('input[placeholder*="Shankhanmul"], input[placeholder*="Address"]'),
  
  adminFirstName: page.locator('input#admin_first_name'),
  adminLastName: page.locator('input#admin_last_name'),
  adminEmail: page.locator('input#admin_email, input[name="admin_email"]'),
  adminPassword: page.locator('input[type="password"], input#admin_password'),
  
  // FIXED: Uniquely targets the absolute second native telephone field instance in DOM hierarchy
  adminPhone: page.locator('input[type="tel"]').nth(1),
  phoneNumber: page.getByPlaceholder('Enter phone number').first(),
  saveChangesBtn: page.getByText('Save Changes', { exact: true }),
  tableRows: page.locator('table tbody tr, [role="row"]'),
  timezoneDropdown: page.locator('select#timezone, select[name="timezone"]'),
  timezoneoption: page.locator('ul[role="listbox"] li, [role="option"]').filter({ hasText: 'Kathmandu' }).first(),
});