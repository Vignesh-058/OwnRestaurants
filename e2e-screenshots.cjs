const { chromium } = require('playwright');
const fs = require('fs');

const OUTPUT_DIR = './screenshots';
const URL = 'http://localhost:5173';

const viewports = [
  { name: 'Mobile_375px', width: 375, height: 667 },
  { name: 'Desktop_1440px', width: 1440, height: 900 }
];

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  const browser = await chromium.launch();

  for (const vp of viewports) {
    console.log(`Starting run for ${vp.name}...`);
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    const capture = async (name) => {
      await page.waitForTimeout(1000); // Wait for animations
      await page.screenshot({ path: `${OUTPUT_DIR}/${vp.name}_${name}.png`, fullPage: true });
      console.log(`Captured ${vp.name}_${name}`);
    };

    // 1. Home Page
    await page.goto(URL, { waitUntil: 'networkidle' });
    await capture('01_Home');

    // 2. Location Modal
    try {
      const locationBtn = page.locator('button', { hasText: 'SELECT OUTLET' }).or(page.locator('button:has(svg.lucide-map-pin)')).first();
      await locationBtn.click({ timeout: 5000 });
      await capture('02_LocationModal');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    } catch(e) { console.error("Location Modal failed:", e.message); }

    // 3. Products List
    await page.goto(`${URL}/products`, { waitUntil: 'networkidle' });
    await capture('03_Products_List');

    // 4. Product Details & Add to Cart
    try {
      await page.locator('.premium-card').first().click({ timeout: 5000 });
      await capture('04_Product_Details');
      
      const addBtn = page.locator('button', { hasText: /Add/i }).first();
      await addBtn.click({ timeout: 5000 });
      await capture('05_Added_To_Cart_Toast');
    } catch(e) { console.error("Product Details failed:", e.message); }

    // 5. Cart Page
    await page.goto(`${URL}/cart`, { waitUntil: 'networkidle' });
    await capture('06_Cart_Populated');

    // 6. Checkout Page
    await page.goto(`${URL}/checkout`, { waitUntil: 'networkidle' });
    await capture('07_Checkout');

    // 7. Login / OTP
    await page.goto(`${URL}/login`, { waitUntil: 'networkidle' });
    await capture('08_Login_Screen');
    try {
      await page.fill('input[type="tel"]', '9999999999', { timeout: 3000 });
      await page.locator('button', { hasText: /OTP/i }).click({ timeout: 3000 });
      await capture('09_Login_OTP');
    } catch(e) { console.error("Login flow failed:", e.message); }

    // 8. Offers
    await page.goto(`${URL}/offers`, { waitUntil: 'networkidle' });
    await capture('10_Offers');

    // 9. Profile / Orders
    await page.goto(`${URL}/profile/orders`, { waitUntil: 'networkidle' });
    await capture('11_Orders');
    
    // 10. Error Boundary / 404
    await page.goto(`${URL}/not-a-real-page`, { waitUntil: 'networkidle' });
    await capture('12_NotFound');

    await context.close();
  }

  await browser.close();
  console.log("All comprehensive captures complete!");
  process.exit(0);
})();
