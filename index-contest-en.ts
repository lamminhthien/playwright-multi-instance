import { chromium } from "playwright";
import { generateRandomNumberString } from "./utils/generate-vietnam-phone.util";

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
  const numberOfInstances = 30; // Adjust the number of Chrome instances you want
  const numberUserJoinSameTime = 5; // Adjust the number of Chrome instances you want
  const name = "Random User With Phone Number";

  const instances = [...Array.from({ length: numberOfInstances }).keys()].map((_, i) => `${name} ${i + 1}`);
  const browserPromises = instances.map((e, i) => chromium.launch({ headless: false, timeout: 0 }));

  const browsers = await Promise.all(browserPromises);
  console.log("🚀 Load chrome success: ", browsers.length);

  const groupBrowsers = splitArray(browsers, numberUserJoinSameTime);

  for (let index = 0; index < groupBrowsers.length; index++) {
    const groupBrowser = groupBrowsers[index];
    const promiseGroupBrowserGoToContestDetail = groupBrowser.map(async (browser, i) => {
      const goToContestDetail = async () => {
        // Initial page instance
        const page = await browser.newPage();
        page.setDefaultTimeout(0);

        // Fake data
        const fakePhoneNumber = generateRandomNumberString(10);
        const fakerName = `bot_${fakePhoneNumber}`;

        try {
          // Sign Up
          await page.goto(url);
          await page.getByText("Sign Up").click();
          await page.getByPlaceholder("Full Name").fill(fakerName);
          await page.getByPlaceholder("Email or Phone").fill(fakePhoneNumber);
          await page.getByPlaceholder("Password", { exact: true }).fill(fakePhoneNumber);
          await page.getByPlaceholder("Confirm Password").fill(fakePhoneNumber);

          await page.getByRole("button", { name: "Sign Up", exact: true }).click();
          await page.waitForURL("**/explore");
          await page.goto(url);

          await page.getByText("JOIN").click();

          // Auto answer single choice or multiple choice or type the answer, and auto submit
          setInterval(async () => {
            await page.click(".multiple-choice-answer-button").catch();
            await page.getByPlaceholder('Type your answer here').fill("ABC").catch();
            await page.getByRole("button", { name: "Submit", exact: true }).click().catch();
          }, 10000);
        } catch (error) {
          console.log("🚀 ~ goToContestDetail ~ error:", error);
          console.log(`User ${fakerName} error`);
        }
      };

      return goToContestDetail();
    });
    await Promise.all(promiseGroupBrowserGoToContestDetail);
  }
})();
