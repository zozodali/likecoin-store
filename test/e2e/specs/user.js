const { initBrowser, setAuthLocalStorage } = require('../util/index.js');

module.exports = {
  beforeEach: (browser) => {
    initBrowser(browser);
    browser.pause(1000);
    browser.page.metamask().acceptTerms();
  },

  /* eslint quote-props: "off" */
  'Register': (browser) => {
    const devServer = browser.globals.devServerURL;
    const newId = 'testacct';

    browser
      .url(devServer)
      .click('.lc-container-3 button.account-btn')
      .waitForElementVisible('#registerForm', 5000)
      .setValue('#registerForm input[type=text][required=required]', newId)
      .submitForm('#registerForm')
      .pause(2000)
      .windowHandles(function func(res) {
        const metamaskPopup = res.value[1];
        this.switchWindow(metamaskPopup);
      })
      .pause(1000)
      .verify.title('MetaMask Notification')
      .click('#app-content button:nth-child(2)')
      .pause(1000)
      .windowHandles(function func(res) {
        const originalWindow = res.value[0];
        this.switchWindow(originalWindow);
      })
      .waitForElementVisible('.lc-container-3 button.account-btn', 5000)
      .verify.containsText('.lc-container-3 button.account-btn > div', newId)
      .end();
  },

  // Prerequisite: user registered
  'Edit': (browser) => {
    const devServer = browser.globals.devServerURL;
    const inputSequence = [];
    for (let i = 0; i < 100; i += 1) {
      inputSequence.push(browser.Keys.BACK_SPACE);
    }
    inputSequence.push('Test Name');

    setAuthLocalStorage(browser, devServer, 'testacct', '0x7FCE12d55AcA8a55471CEd6cFd4548b49b0d1AB5');

    browser
      .url(`${devServer}/in`)
      .waitForElementVisible('#user-info-form', 2000)
      .pause(6000)
      .click('#user-info-form .input-display-name')
      .waitForElementVisible('#user-info-form div.btn-container div:nth-child(1) button', 2000)
      .setValue('#user-info-form .input-display-name', inputSequence)
      .pause(2000)
      .click('#user-info-form div.btn-container div:nth-child(1) button')
      .pause(2000)
      .windowHandles(function func(res) {
        const metamaskPopup = res.value[1];
        this.switchWindow(metamaskPopup);
      })
      .pause(1000)
      .verify.title('MetaMask Notification')
      .click('#app-content button:nth-child(2)')
      .pause(2000)
      .windowHandles(function func(res) {
        const originalWindow = res.value[0];
        this.switchWindow(originalWindow);
      })
      .waitForElementVisible('#user-info-form', 5000)
      .waitForElementVisible('.toolbars', 3000)
      .pause(1000)
      .verify.containsText('.toolbars > div > div > span', 'View your page')
      .end();
  },

  // Prerequisite: user registered
  'Claim coupon test and error dialog': (browser) => {
    const devServer = browser.globals.devServerURL;
    setAuthLocalStorage(browser, devServer, 'testacct', '0x7FCE12d55AcA8a55471CEd6cFd4548b49b0d1AB5');

    browser
      .url(`${devServer}/in`)
      .waitForElementVisible('#redeemForm', 2000)
      .click('#redeemForm input[type=text]')
      .setValue('#redeemForm input[type=text]', '22223333')
      .pause(1000)
      .click('#confirm-btn')
      .pause(1000)
      .waitForElementVisible('.md-dialog', 2000)
      .verify.containsText('.md-dialog', 'Coupon Error')
      .click('.md-dialog #btn-confirm')
      .end();
  },

  // Prerequisite: user registered
  'Payment send LIKE': (browser) => {
    const devServer = browser.globals.devServerURL;
    const testUser = 'testing';
    const amount = 0.0001;
    setAuthLocalStorage(browser, devServer, 'testacct', '0x7FCE12d55AcA8a55471CEd6cFd4548b49b0d1AB5');

    browser
      .url(`${devServer}/${testUser}/${amount}`)
      .waitForElementVisible('.address-container', 5000)
      .verify.containsText('.address-container', testUser)
      .submitForm('#paymentInfo')
      .pause(2000)
      .windowHandles(function func(res) {
        const metamaskPopup = res.value[1];
        this.switchWindow(metamaskPopup);
      })
      .pause(2000)
      .waitForElementVisible('div.font-small', 5000)
      .verify.containsText('div.font-small', '0x4b25758E41f9240C8EB8831cEc7F1a02686387fa')
      .verify.containsText('div.font-small', '100 000 000 000 000')
      .click('div.flex-row.flex-space-around > button:nth-child(2)')
      .pause(2000)
      .windowHandles(function func(res) {
        const originalWindow = res.value[0];
        this.switchWindow(originalWindow);
      })
      .pause(5000)
      .verify.containsText('.md-dialog-container', 'Submitted to blockchain')
      .end();
  },

  // Prerequisite: user registered
  'Payment send ETH': (browser) => {
    const devServer = browser.globals.devServerURL;
    const testUser = 'testing';
    const amount = 0.000001;
    setAuthLocalStorage(browser, devServer, 'testacct', '0x7FCE12d55AcA8a55471CEd6cFd4548b49b0d1AB5');

    browser
      .url(`${devServer}/${testUser}/eth/${amount}`)
      .waitForElementVisible('.address-container', 5000)
      .verify.containsText('.address-container', testUser)
      .submitForm('#paymentInfo')
      .pause(2000)
      .windowHandles(function func(res) {
        const metamaskPopup = res.value[1];
        this.switchWindow(metamaskPopup);
      })
      .pause(2000)
      .waitForElementVisible('#pending-tx-form', 5000)
      .submitForm('#pending-tx-form')
      .pause(2000)
      .windowHandles(function func(res) {
        const originalWindow = res.value[0];
        this.switchWindow(originalWindow);
      })
      .pause(5000)
      .verify.containsText('.md-dialog-container', 'Submitted to blockchain')
      .end();
  },
};
