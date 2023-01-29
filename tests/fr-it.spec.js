// @ts-check
const { test, expect } = require('@playwright/test');

const url = 'https://tickets.rugbyworldcup.com/fr/revente_france_italie'

test('France-Italie', async ({ page }) => {
  await page.goto(url);
  await expect(page.getByText('FILE D\'ATTENTE')).toHaveCount(0)
  await expect(page.locator('.product-not-on-sale-info')).toHaveCount(0)
});
