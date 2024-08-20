const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeLogic(res) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto('https://www.facebook.com/');
  
  console.log('Please log in to Facebook manually.');

  let foundFrCookie = false;

  while (!foundFrCookie) {
    const cookies = await page.cookies();

    foundFrCookie = cookies.some(cookie => cookie.name === 'c_user');

    if (foundFrCookie) {
      console.log('"c_user" cookie detected! Saving all cookies.');

      const cookieJSON = JSON.stringify(cookies, null, 2);
      fs.writeFileSync('facebookCookies.json', cookieJSON);

      console.log('Cookies have been saved to facebookCookies.json');
      
      await browser.close();
      return; // Exit the function after closing the browser
    } else {
      console.log('"c_user" cookie not found, checking again in 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

module.exports = { scrapeLogic };