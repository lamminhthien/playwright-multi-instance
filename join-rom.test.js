const { expect, test } = require('@playwright/test');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

test('Join Room', async ({ page }) => {
  const userName = 'Thien234';
  await page.goto('https://www.quizne.com/room/i36my/multiple-play');
  await page.setDefaultTimeout(0)
  await page.getByPlaceholder('Type your name here').fill(userName)
  await page.keyboard.down('Enter');
  await sleep(10000);
  expect(page.title).toEqual('Player Play Game | Quizne')
});

