import { chromium } from "playwright";
import { faker } from "@faker-js/faker";
import { generateRandomNumberString } from "./utils/generate-vietnam-phone.util";
import { expect } from "playwright/test";

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
        const page = await browser.newPage();
        const fakePhoneNumber = generateRandomNumberString(10);
        const fakerName = faker.internet.userName();
        try {
          page.setDefaultTimeout(0);
          await page.goto(url);

          await page.getByPlaceholder("Email or Phone").fill(fakePhoneNumber);
          await page.getByPlaceholder("Password").fill(fakerName);
          await page.getByRole("button", { name: "Log in", exact: true }).click();

          // Check contest title
          // await page.getByText('Demo Test Contest');
          await expect(page.getByText("The email or password you entered is incorrect. Please try again."));
        } catch (error) {
          console.log("🚀 ~ goToContestDetail ~ error:", error);
          console.log(`User ${userName} error`);
          console.log("Go to login page");
          await page.getByText("Sign Up").click();
          await page.getByPlaceholder("Full Name").fill(`bot_${fakePhoneNumber}`);
          await page.getByPlaceholder("Email or Phone").fill(fakePhoneNumber);
          await page.getByPlaceholder("Password", { exact: true }).fill(fakePhoneNumber);
          await page.getByPlaceholder("Confirm Password").fill(fakePhoneNumber);
          // await page.getByRole("button", { name: "Sign Up", exact: true }).click();

        }
      };

      return goToContestDetail();
    });
    await Promise.all(promiseGroupBrowserGoToContestDetail);
  }
})();
