import { test, expect } from '../hooks/test-hooks'
import { logger } from '../../utils/logger';
import { PRODUCT_CATEGORIES } from '../../pages/HomePage';

test.describe("Product tests", ()=>{
    test("@regression @product Get products from all categories", async ({homePage}) => {
        const data = JSON.parse(process.env.TEST_DATA!);
        const actualProductList = await homePage.getProductsList(PRODUCT_CATEGORIES.ALL);
        const expectedProductList: string[] = data.allProducts;
        expect(actualProductList).toEqual([]);
    });

    test("@regression @product Get all products from the phones category", async ({homePage}) => {
        const data = JSON.parse(process.env.TEST_DATA!);
        const actualProductList = await homePage.getProductsList(PRODUCT_CATEGORIES.PHONES);
        const expectedProductList: string[] = data.phones;
        expect(actualProductList).toEqual(expectedProductList);
    });

    test("@regression @product Get all products from the laptops category", async ({homePage}) => {
        const data = JSON.parse(process.env.TEST_DATA!);
        const actualProductList = await homePage.getProductsList(PRODUCT_CATEGORIES.LAPTOPS);
        const expectedProductList: string[] = data.laptops;
        expect(actualProductList).toEqual(expectedProductList);
    });

    test("@regression @product Get all products from the monitors category", async ({homePage}) => {
        const data = JSON.parse(process.env.TEST_DATA!);
        const actualProductList = await homePage.getProductsList(PRODUCT_CATEGORIES.MONITORS);
        const expectedProductList: string[] = data.monitors;
        expect(actualProductList).toEqual(expectedProductList);
    });

    test("@regression @smoke @product Add product to cart", async ({homePage}) => {
        const data = JSON.parse(process.env.TEST_DATA!);
        const productName: string= data.phones[0];
        const productPage = await homePage.selectProduct(productName, PRODUCT_CATEGORIES.PHONES);
        const actualProductName = await productPage.getProductTitle();
        expect(actualProductName).toEqual(productName); // Ensure product was selected

        const actualMessage = await productPage.addToCart(productName);
        const expectedMessage = data.messages
        .find((msg: { hasOwnProperty: (arg0: string) => any; }) => msg.hasOwnProperty('AddToCartSuccess'))
        ?.AddToCartSuccess;

        expect(actualMessage).toContain(expectedMessage); // Ensure product is successfully added to cart
    });

    test("@regression @smoke @product Order a product without name and card number", async ({homePage}) => {
        const data = JSON.parse(process.env.TEST_DATA!);
        const productName: string= data.phones[0];
        const productPage = await homePage.selectProduct(productName, PRODUCT_CATEGORIES.PHONES);
        await productPage.addToCart(productName);
        const expectedMessage = data.messages
        .find((msg: { hasOwnProperty: (arg0: string) => any; }) => msg.hasOwnProperty('orderFailureMessage'))
        ?.orderFailureMessage;

        const cartPage = await productPage.gotoCart();
        const actualResult:boolean = await cartPage.checkProduct(productName);
        expect(actualResult).toBeTruthy(); // Product exists in the cart

        //Order the product
        const actualMessage = await cartPage.orderProduct("", "");
        expect(actualMessage).toContain(expectedMessage);

    });

    test("@regression @smoke @product Order a product with name and card number", async ({homePage}) => {
        const data = JSON.parse(process.env.TEST_DATA!);
        const productName: string= data.phones[0];
        const productPage = await homePage.selectProduct(productName, PRODUCT_CATEGORIES.PHONES);
        await productPage.addToCart(productName);
        let expectedMessage = data.messages
        .find((msg: { hasOwnProperty: (arg0: string) => any; }) => msg.hasOwnProperty('loginWithValidCredentials'))
        ?.loginWithValidCredentials;

        const cartPage = await productPage.gotoCart();
        const name = data.orderInfos[0].name;
        const cardNumber = data.orderInfos[0].card;
        const actualResult:boolean = await cartPage.checkProduct(productName);
        expect(actualResult).toBeTruthy(); // Product exists in the cart

        //Order the product
        let actualMessage = await cartPage.orderProduct(name, cardNumber); // from alert
        expect(actualMessage).toContain(expectedMessage); // Product is ordered
        
        actualMessage = await cartPage.getOrderMessage(); // Displayed after alert
        expectedMessage = data.messages
        .find((msg: { hasOwnProperty: (arg0: string) => any; }) => msg.hasOwnProperty('orderSuccessMessage'))
        ?.orderSuccessMessage; // Successful order message
        expect(actualMessage).toContain(expectedMessage);
    });

});