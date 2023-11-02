import { chromium } from 'playwright';

const url = 'https://www.quizne.com/room/7ki1k/multiple-play';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const numberOfInstances = 5; // Adjust the number of Chrome instances you want

  const browserPromises = [];

  for (let i = 0; i < numberOfInstances; i++) {
    browserPromises.push(chromium.launch({ headless: false, timeout: 9999999 }));
  }

  const browsers = await Promise.all(browserPromises);

  for (const browser of browsers) {
    let howManyPeopleJoinRoomOk = 0;

    const page = await browser.newPage();
    await page.goto(url);
    try {
      await page.getByPlaceholder('Type your name here').fill('a')
      await page.keyboard.down('Enter');
      howManyPeopleJoinRoomOk+=1;
      console.log(`${howManyPeopleJoinRoomOk} already join room`)
    } catch (error) {
      console.log('Skip this error chrome instance');
    }
    console.log(`Page title: ${await page.title()}`);
    await sleep(5700);
    console.log('Ready for play')
    // Perform actions for each browser instance
    for (let i = 0; i < 50; i++) {
      try {
        await sleep(5000);
        const randomAnswer = Math.floor(Math.random() * 4);
        await page.locator(`//p[contains(@class, 'my-auto break-words')]`).nth(randomAnswer).click();
      } catch (error) {
        await sleep(2500)
        console.log(`Nothing ${JSON.stringify(error)}`);
      }
    }
  }

  // Close all browser instances when done
  for (const browser of browsers) {
    await sleep(Infinity);
    // await browser.close();
  }
})();
