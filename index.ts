import { chromium } from 'playwright';

const url = 'https://www.quizne.com/room/ymoyb/multiple-play';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const numberOfInstances = 3; // Adjust the number of Chrome instances you want

  const browserPromises = [];

  for (let i = 0; i < numberOfInstances; i++) {
    browserPromises.push(chromium.launch({ headless: true, timeout: 9999999 }));
  }

  const browsers = await Promise.all(browserPromises);

  for (const browser of browsers) {
    const page = await browser.newPage();
    await page.goto(url);
    await page.getByPlaceholder('Type your name here').fill('a');
    await page.keyboard.down('Enter');

    // Perform actions for each browser instance
    console.log(`Page title: ${await page.title()}`);
  }

  // Close all browser instances when done
  for (const browser of browsers) {
    await sleep(Infinity);
    // await browser.close();
  }
})();
