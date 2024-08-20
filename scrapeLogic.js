const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeLogic(res) {
  let browser;

  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: false, // Set to true to run in headless mode
      defaultViewport: null,
    });

    const page = await browser.newPage();
    console.log('Navigating to Facebook...');
    await page.goto('https://www.facebook.com/', { waitUntil: 'networkidle2' });
    
    console.log('Please log in to Facebook manually.');

    let foundFrCookie = false;

    while (!foundFrCookie) {
      console.log('Checking for "c_user" cookie...');
      const cookies = await page.cookies();

      foundFrCookie = cookies.some(cookie => cookie.name === 'c_user');

      if (foundFrCookie) {
        console.log('"c_user" cookie detected! Saving all cookies.');

        const cookieJSON = JSON.stringify(cookies, null, 2);
        fs.writeFileSync('facebookCookies.json', cookieJSON);

        console.log('Cookies have been saved to facebookCookies.json');
        break;
      } else {
        console.log('"c_user" cookie not found, checking again in 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { scrapeLogic };
