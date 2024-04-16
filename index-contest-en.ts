import { chromium } from "playwright";
import { faker } from "@faker-js/faker";
import { generateRandomNumberString } from './utils/generate-vietnam-phone';

const url = "https://www.quizne.vn/en-us/contest/demo-test-contest";
function splitArray<T>(array: T[], childArraySize: number): T[][] {
  const splittedArray: T[][] = [];

  for (let i = 0; i < array.length; i += childArraySize) {
    const childArray = array.slice(i, i + childArraySize);
    splittedArray.push(childArray);
  }

  return splittedArray;
}

(async () => {
  const numberOfInstances = 1; // Adjust the number of Chrome instances you want
  const numberUserJoinSameTime = 1; // Adjust the number of Chrome instances you want
  const name = "Random User";

  const instances = [...Array.from({ length: numberOfInstances }).keys()].map((_, i) => `${name} ${i + 1}`);
  const browserPromises = instances.map((e, i) => chromium.launch({ headless: false, timeout: 0 }));

  const browsers = await Promise.all(browserPromises);
  console.log("🚀 Load chrome success: ", browsers.length);

  const groupBrowsers = splitArray(browsers, numberUserJoinSameTime);

  for (let index = 0; index < groupBrowsers.length; index++) {
    const groupBrowser = groupBrowsers[index];
    const promiseGroupBrowserGoToContestDetail = groupBrowser.map(async (browser, i) => {
      const goToContestDetail = async () => {
        const userName = instances[index * numberUserJoinSameTime + i];
        try {
          const page = await browser.newPage();
          page.setDefaultTimeout(0);
          await page.goto(url);
          //  await page.getByPlaceholder('Type your name here').fill(userName)
          //  await page.keyboard.down('Enter');
          // console.log(`User ${userName} open the door`);
          // console.log(`User ${userName} ready for log in, if cannot login, user will sign up`);
          const fakePhoneNumber = generateRandomNumberString(8)
          const fakerName = faker.internet.userName();
          await page.getByPlaceholder("Email or Phone").fill(fakePhoneNumber);
          await page.getByPlaceholder("Password").fill(fakerName);
          await page.getByRole('button',{ name: /log in/i }).click();
          //  setInterval(() => {
          //   page.click(".multiple-choice-answer-button").catch();
          // }, 10000);
        } catch (error) {
          console.log(`User ${userName} error`);
        }
      };

      return goToContestDetail();
    });
    await Promise.all(promiseGroupBrowserGoToContestDetail);
  }
})();
