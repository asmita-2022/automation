// import{test,expect} from '@playwright/test';
// import loginLocators from '../locators/login-locator';

// test.describe('login tests',()=>{
//   test.beforeEach(async ({ page }) => {
//     await page.goto('https://qa03.stage.chairlyo.com/');
//   });
  
// test('login to chairlyo with valid credentials test', async ({ page }) => {
//   await page.getByLabel(loginLocators.emailInput).fill('orgadmin@test.com');
//   await page.locator(loginLocators.userpasswordInput).fill('Test@123');
//   await page.getByRole('button', { name: loginLocators.loginButton }).click();
//   //await page.waitForTimeout(5000); 
//   await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
//   await expect(page.getByText('Login successful!')).toBeVisible();
// });
// test('login with Invalid email test', async ({ page }) => {
//     await page.getByLabel('Email*').fill('orgadminn@test.qa');
//     await page.locator('[name="password"]').fill('Test@123');
//     await page.getByRole('button', { name: 'Log in' }).click();
//     await expect(page.getByRole('heading', { name: 'Success' })).not.toBeVisible();
//   });

//   // 2. Invalid Password
//   test('login with Invalid password', async ({ page }) => {
//     await page.getByLabel('Email*').fill('skilladmin@test.com');
//     await page.locator('[name="password"]').fill('wrongpass');
//     await page.getByRole('button', { name: 'Log in' }).click();
//     await expect(page.getByRole('heading', { name: 'Success' })).not.toBeVisible();
//   });

//   // 3. Both Invalid
//   test('login with Both invalid email and password', async ({ page }) => {
//     await page.getByLabel('Email*').fill('invalid@test.com');
//     await page.locator('[name="password"]').fill('wrongpass');
//     await page.getByRole('button', { name: 'Log in' }).click();
//     await expect(page.getByRole('heading', { name: 'Success' })).not.toBeVisible();
//   });

//   // 4. Empty Email
//   test('login withEmpty email', async ({ page }) => {
//     await page.getByLabel('Email*').fill('');
//     await page.locator('[name="password"]').fill('skill@123');
//     await page.getByRole('button', { name: 'Log in' }).click();
//     await expect(page.getByRole('heading', { name: 'Success' })).not.toBeVisible();
//   });

//   // 5. Empty Password
//   test('login with Empty password', async ({ page }) => {
//     await page.getByLabel('Email*').fill('skilladmin@test.com');
//     await page.locator('[name="password"]').fill('');
//     await page.getByRole('button', { name: 'Log in' }).click();
//     await expect(page.getByRole('heading', { name: 'Success' })).not.toBeVisible();
//   });

//   // 6. Both Fields Empty
//   test('login with Both fields empty', async ({ page }) => {
//     await page.getByLabel('Email*').fill('');
//     await page.locator('[name="password"]').fill('');
//     await page.getByRole('button', { name: 'Log in' }).click();
//     await expect(page.getByRole('heading', { name: 'Success' })).not.toBeVisible();
//   });

//   // 7. Invalid Email Format
//   test('login with Invalid email format', async ({ page }) => {
//     await page.getByLabel('Email*').fill('invalid-email-format');
//     await page.locator('[name="password"]').fill('skill@123');
//     await page.getByRole('button', { name: 'Log in' }).click();
//     await expect(page.getByRole('heading', { name: 'Success' })).not.toBeVisible();
//   });

//   // 8. Leading/Trailing Spaces in Email
//   test('login with Spaces in email', async ({ page }) => {
//     await page.getByLabel('Email*').fill('  skilladmin@test.com  ');
//     await page.locator('[name="password"]').fill('skill@123');
//     await page.getByRole('button', { name: 'Log in' }).click();
//     await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
//   });

//   // 9. Error Toast Displayed
//   test('login to Verify toast error message', async ({ page }) => {
//     await page.getByLabel('Email*').fill('orgadmin@test.com');
//     await page.locator('[name="password"]').fill('wrong');
//     await page.getByRole('button', { name: 'Log in' }).click();
//     await expect(page.locator('[role="alert"], .toast, .error').first()).toBeVisible();
//   });

//   // 10. User Not Logged In
//   test('User does not get logged in', async ({ page }) => {
//     await page.getByTestId('Email*').fill('orgadmin@test.com');
//     await page.locator('[name="password"]').fill('wrong');
//     await page.getByRole('button', { name: 'Log in' }).click();
//     await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
//   });

// });

// // test.beforeAll(async ({ page }) => {
// //     await page.goto('https://qa03.stage.chairlyo.com/');
// //   });

import { test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Login Test', () => {
    let loginPage : LoginPage;

    const email = 'orgadmin@test.com';
    const password = 'Test@123';
    const url= 'https://qa03.stage.chairlyo.com/';

    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      await loginPage.gotoChairlyo(url);
    });

    test('Login to Chairlyo with valid credentials', async ({ page }) => {
      await loginPage.loginToChairlyo(email, password);
      await loginPage.verifySuccessfulLogin(url);
    });
});