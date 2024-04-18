import express from 'express';
import puppeteer from 'puppeteer';
import fs from 'fs';

const router = express.Router();

// Variables to store previous values
let prevTitle = '';
let prevPrice = '';
let prevImg = '';

router.get('/nse-data', async (req, res) => {
  // Launch Puppeteer browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: './tmp'
  });
  const page = await browser.newPage();

  try {
    // Navigate to the NSE India website
    await page.goto('https://www.nseindia.com/');

    // Extract data from the page
    const productsHandles = await page.$$('div.nav.nav-tabs > nav-items');
    const scrapedData = [];

    for (const productHandle of productsHandles) {
      let title = "Null";
      let price = "Null";
      let img = "Null";

      try {
        title = await productHandle.$eval('div.tab_box.up > p.tb_name', el => el.textContent);
      } catch (error) {
        console.error('Error getting title:', error);
      }

      try {
        price = await productHandle.$eval('div.tab_box.up > p.tb_val', el => el.textContent);
      } catch (error) {
        console.error('Error getting price:', error);
      }

      try {
        img = await productHandle.$eval('div.tab_box.up > p.tb_per', el => el.textContent);
      } catch (error) {
        console.error('Error getting image:', error);
      }

      // Check if the scraped values are different from previous values
      if (title !== prevTitle || price !== prevPrice || img !== prevImg) {
        // Update previous values
        prevTitle = title;
        prevPrice = price;
        prevImg = img;

        // Append data to CSV file
        fs.appendFile("results.csv", `${title.replace(/,/g, ".")},${price},${img}\n`, function (err) {
          if (err) {
            console.error('Error appending to CSV file:', err);
          }
        });

        // Store scraped data in an array
        scrapedData.push({ title, price, img });
      } else {
        // Throw an error if the scraped values are the same as previous values
        throw new Error('Scraped values are not changing');
      }
    }

    // Send the scraped data in the response
    res.json(scrapedData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  } finally {
    // Close the Puppeteer browser
    await browser.close();
  }
});

export default router;
