const express = require('express');
const { scrapeLogic } = require('./scrapeLogic');
const app = express();

const PORT = process.env.PORT || 4000;

app.get('/scrape', async (req, res) => {
  try {
    // Call scrapeLogic and wait for it to complete
    await scrapeLogic();
    res.send('Scraping completed.');
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).send('An error occurred during scraping.');
  }
});

app.get('/', (req, res) => {
  res.send('Render Puppeteer server is up and running!');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
