import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('initial render', async ({ page }) => {
  await expect(page.locator('h1.app-logo')).toHaveText('KanbanBoard');
  const columns = page.locator('.column');
  await expect(columns).toHaveCount(5);
  await expect(page.locator('.card')).toHaveCount(5);
});

test('add a new card', async ({ page }) => {
  const firstColumn = page.locator('.column').first();
  await firstColumn.getByRole('button', { name: '+ Add Card' }).click();
  
  await page.getByPlaceholder('Card Title').fill('New Playwright Card');
  await page.getByPlaceholder('Details').fill('Testing with Playwright');
  await page.getByRole('button', { name: 'Add', exact: true }).click();

  await expect(page.getByText('New Playwright Card')).toBeVisible();
  await expect(page.getByText('Testing with Playwright')).toBeVisible();
});

test('delete a card', async ({ page }) => {
  const firstCard = page.locator('.card').first();
  const cardTitle = await firstCard.locator('.card-title').innerText();
  
  // Use force: true if needed, or ensure we click the delete button specifically
  await firstCard.getByRole('button', { name: 'Delete card' }).click();
  
  await expect(page.locator('.card').filter({ hasText: cardTitle })).not.toBeVisible();
});

test('rename a column', async ({ page }) => {
  const firstColumnHeader = page.locator('.column-title').first();
  await firstColumnHeader.click();
  
  const input = page.locator('.column-title-input');
  await input.fill('New Column Name');
  await input.press('Enter');
  
  await expect(page.locator('.column-title').first()).toHaveText('New Column Name');
});
