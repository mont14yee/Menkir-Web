import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://mont14yee-menkr-impo-3wd3.bolt.host/', { waitUntil: 'networkidle2' });
  
  // Extract all image sources
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => img.src);
  });
  
  // Extract all text to understand what the site is about
  const text = await page.evaluate(() => document.body.innerText);
  
  console.log("IMAGES:", images);
  console.log("TEXT START===\n", text.substring(0, 1000), "\n===TEXT END");
  
  await browser.close();
})();
