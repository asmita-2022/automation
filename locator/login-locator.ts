// interface LoginLocators {
//   emailInput: string;
//   userpasswordInput: string;
//   loginButton: string;
//   errorMessage: string;
//   successMessage: string;
// }

// const loginLocators: LoginLocators = {
//   emailInput: 'Email*',
//   userpasswordInput: '[name="password"]',
//   loginButton: 'Log in',
//   errorMessage: 'error',
//   successMessage: 'Login successfully',
// };
// export default loginLocators

import { Locator, Page } from "@playwright/test";
export interface LoginCredentials{
  email:string;
  password:string;
}
export interface LoginLocators{
  emailInput:Locator;
  passwordInput:Locator;
  loginButton:Locator;
  loggeddInUser:Locator;
  successToast:Locator;
  successMessage:Locator;
}
export const loginLocators=(page:Page):LoginLocators=>({
  emailInput:page.getByLabel('Email*'),
  passwordInput:page.locator('[name="password"]'),
  loginButton:page.getByRole('button', { name: 'Log in' }),
  loggeddInUser:page.getByText('orgadmin@test.com'),
  successToast:page.getByText('success',{exact:true}),
  successMessage:page.getByText('login successful')
});