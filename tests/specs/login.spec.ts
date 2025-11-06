import { test, expect } from '../hooks/test-hooks'

test.describe.serial("Authenticationtests", ()=>{
    test("@regression @smoke @authentication Login with invalid username", async ({homePage}) => {
        const data = JSON.parse(process.env.TEST_DATA!);
        const loginPage = await homePage.clickLoginMenu();
        const username = data.accounts[0].username + "testsggs";
        const password = data.accounts[0].password;
        const expectedMessage = data.messages
        .find((msg: { hasOwnProperty: (arg0: string) => any; }) => msg.hasOwnProperty('loginWithInvalidUsername'))
        ?.loginWithInvalidUsername;

        const message = await loginPage.login(username, password);
        expect(message).toContain(expectedMessage);  
    });

    test("@regression @smoke @authentication Login with invalid password", async ({homePage}) => {
        const data = JSON.parse(process.env.TEST_DATA!);
        const loginPage = await homePage.clickLoginMenu();
        const username = data.accounts[0].username;
        const password = data.accounts[0].password + "tehsgsh";
        const expectedMessage = data.messages
        .find((msg: { hasOwnProperty: (arg0: string) => any; }) => msg.hasOwnProperty('loginWithInvalidPassword'))
        ?.loginWithInvalidPassword;

        const message = await loginPage.login(username, password);
        
        expect(message).toContain(expectedMessage);
    });

    test("@regression @smoke @authentication Login with valid credentials", async ({homePage}) => {
        const data = JSON.parse(process.env.TEST_DATA!);
        const loginPage = await homePage.clickLoginMenu();
        const username = data.accounts[0].username;
        const password = data.accounts[0].password;
        const expectedMessage = data.messages
        .find((msg: { hasOwnProperty: (arg0: string) => any; }) => msg.hasOwnProperty('loginWithValidCredentials'))
        ?.loginWithValidCredentials;

        const message = await loginPage.login(username, password);
        
        expect(message).toContain(expectedMessage);
    });
});