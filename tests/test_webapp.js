const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Web App Tests', function() {
    let driver;

    before(async function() {
        this.timeout(10000); // Set timeout to 10 seconds
        driver = await new Builder().forBrowser('chrome').build();
    });
    

    after(async function() {
        await driver.quit();
    });

    it('Should open the login page', async function() {
        await driver.get('http://localhost:3000');
        const title = await driver.getTitle();
        assert.strictEqual(title, 'Secure TO-DO List');
    });

    it('Should login successfully', async function() {
        await driver.get('http://localhost:3000');
        await driver.findElement(By.id('username')).sendKeys('admin');
        await driver.findElement(By.id('password')).sendKeys('adminpass', Key.RETURN);
        await driver.wait(until.elementLocated(By.id('authMessage')));
        const message = await driver.findElement(By.id('authMessage')).getText();
        assert.strictEqual(message, 'Login successful');
    });

    it('Should add a task', async function() {
        await driver.get('http://localhost:3000');
        await driver.findElement(By.id('username')).sendKeys('admin2');
        await driver.findElement(By.id('password')).sendKeys('password', Key.RETURN);
        await driver.wait(until.elementLocated(By.id('authMessage')));
        await driver.findElement(By.id('taskInput')).sendKeys('Test Task', Key.RETURN);
        await driver.wait(until.elementLocated(By.id('taskList')));
        const tasks = await driver.findElements(By.css('#taskList li'));
        assert.ok(tasks.length > 0);
    });
});
