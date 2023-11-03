import { chromium } from 'playwright';

const url = 'https://www.quizne.com/room/fdqqk/multiple-play';
function splitArray<T>(array: T[], childArraySize: number): T[][] {
  const splittedArray: T[][] = [];

  for (let i = 0; i < array.length; i += childArraySize) {
      const childArray = array.slice(i, i + childArraySize);
      splittedArray.push(childArray);
  }

  return splittedArray;
}

(async () => {
  const numberOfInstances = 80; // Adjust the number of Chrome instances you want
  const numberUserJoinSameTime = 10; // Adjust the number of Chrome instances you want

  const instances = [...Array.from({length:numberOfInstances}).keys()].map((_,i)=>`ThienLam ${i+1}`)
  const browserPromises = instances.map((e,i)=>chromium.launch({ headless: true, timeout: 0 }));

  const browsers = await Promise.all(browserPromises);
  console.log("🚀 Load chrome success: ", browsers.length)

  const groupBrowsers = splitArray(browsers, 10);

  for (let index = 0; index < groupBrowsers.length; index++) {
    const groupBrowser = groupBrowsers[index];
    const promiseGroupBrowserJoinRoom = groupBrowser.map(async (browser,i)=>{
      const joinRoom = async ()=>{
       const page = await browser.newPage();
       await page.goto(url);
       const userName = instances[index*numberUserJoinSameTime+i]
       await page.getByPlaceholder('Type your name here').fill(userName)
       await page.keyboard.down('Enter');
       page.setDefaultTimeout(0)
       console.log(`User ${userName} joined`)
      }

      return joinRoom()
     })
     await Promise.all(promiseGroupBrowserJoinRoom)
  }
 

})();
