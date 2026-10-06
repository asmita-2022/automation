import { Page,expect } from "@playwright/test";
import { loginLocators,LoginLocators } from "../locator/login-locator";

export class LoginPage{
    readonly page:Page;
    readonly locators:LoginLocators;

constructor(page:Page){
    this.page=page;
    this.locators=loginLocators(page);
}
async gotoChairlyo(url:string){
    await this.page.goto(url);
}
async loginToChairlyo(email:string,password:string){
    await this.locators.emailInput.fill(email);
    await this.locators.passwordInput.fill(password);
    await this.locators.loginButton.click();
}
async verifySuccessfulLogin(url:string){
    await expect(this.page).toHaveURL(url);
    await expect(this.locators.loggeddInUser).toBeVisible();
    await expect(this.locators.successToast).toBeHidden();
    await expect(this.locators.successMessage).toBeVisible();
}}