import { chromium } from 'playwright';

const url = 'https://www.quizne.com/room/qmfn0/multiple-play';

(async () => {
  const numberOfInstances = 10; // Adjust the number of Chrome instances you want

  const browserPromises = [];

  for (let i = 0; i < numberOfInstances; i++) {
    browserPromises.push(chromium.launch({ headless: true, timeout: 9999999 }));
  }

  const browsers = await Promise.all(browserPromises);
  for (const browser of browsers) {
    const page = await browser.newPage();
    await page.goto(url);
      await page.getByPlaceholder('Type your name here').fill('a')
      await page.keyboard.down('Enter');
      console.log('Skip this error chrome instance');
    console.log(`Page title: ${await page.title()}`);
    console.log('Ready for play')
    // Perform actions for each browser instance
    setTimeout(() => {
      for (let i = 0; i < 350; i++) {
        try {
          console.log(i);
          const randomAnswer = Math.floor(Math.random() * 4);
          page.locator(`//p[contains(@class, 'my-auto break-words')]`).nth(randomAnswer).click();
        } catch (error) {
          console.log(`Nothing ${JSON.stringify(error)}`);
        }
      }
    },20000)
  }

})();
