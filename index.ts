import { chromium } from 'playwright';

const url = 'https://www.quizne.com/room/vk349/multiple-play';

(async () => {
  const numberOfInstances = 20; // Adjust the number of Chrome instances you want

  const browserPromises = [];

  for (let i = 0; i < numberOfInstances; i++) {
    browserPromises.push(chromium.launch({ headless: true, timeout: 0 }));
  }

  const browsers = await Promise.all(browserPromises);
  for (const browser of browsers) {
    const page = await browser.newPage();
    await page.goto(url);
    await page.getByPlaceholder('Type your name here').fill('a')
    await page.keyboard.down('Enter');
    await page.setDefaultTimeout(0)
    console.log('Ready for play')
    // Perform actions for each browser instance
    // setTimeout(() => {
    //   for (let i = 0; i < Infinity; i++) {
    //       console.log(i);
    //       const randomAnswer = Math.floor(Math.random() * 4);
    //       page.locator(`//p[contains(@class, 'my-auto break-words')]`).nth(randomAnswer).click();
    //   }
    // },20000)
  }

})();
