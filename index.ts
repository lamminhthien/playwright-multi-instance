import { chromium } from 'playwright';

const url = 'https://www.quizne.com/room/w0orw/multiple-play';
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
  const name = 'Tường Vy'

  const instances = [...Array.from({length:numberOfInstances}).keys()].map((_,i)=>`${name} ${i+1}`)
  const browserPromises = instances.map((e,i)=>chromium.launch({ headless: true, timeout: 0 }));

  const browsers = await Promise.all(browserPromises);
  console.log("🚀 Load chrome success: ", browsers.length)

  const groupBrowsers = splitArray(browsers, numberUserJoinSameTime);

  for (let index = 0; index < groupBrowsers.length; index++) {
    const groupBrowser = groupBrowsers[index];
    const promiseGroupBrowserJoinRoom = groupBrowser.map(async (browser,i)=>{
      const joinRoom = async ()=>{
       const userName = instances[index*numberUserJoinSameTime+i]
       try{
        const page = await browser.newPage();
       page.setDefaultTimeout(0)
       await page.goto(url);
       await page.getByPlaceholder('Type your name here').fill(userName)
       await page.keyboard.down('Enter');
       console.log(`User ${userName} joined`)
       setInterval(async () => {
        await page.click(".multiple-choice-answer-button").catch();
        await page.getByPlaceholder('Type your answer here').fill("ABC").catch();
        await page.getByRole("button", { name: "Submit", exact: true }).click().catch();
      }, 10000);
       }
       catch(error){
       console.log(`User ${userName} error`)

       }
      }

      return joinRoom()
     })
     await Promise.all(promiseGroupBrowserJoinRoom)
  }
 

})();
