import { expect, test } from '@playwright/test';

const LEONARDO_API_PATTERN = '**/api/leonardo/generate';
const DROPBOX_API_PATTERN = '**/2/files/upload';

test.describe('Story 5: Organized Output', () => {
  test('Given a completed pipeline run, Then output metadata is organized by product and format', async ({ page }) => {
    await page.route(LEONARDO_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          imageData: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgQXv3XQAAAAASUVORK5CYII=',
        }),
      });
    });

    await page.route(DROPBOX_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ path_lower: '/test/path', rev: 'test-rev' }),
      });
    });

    await page.goto('/');
    await page.getByPlaceholder('Enter your Leonardo API key').fill('test-key');
    await page.getByPlaceholder('Enter your Dropbox access token').fill('test-token');
    await page.getByRole('button', { name: 'Save Credentials' }).click();
    await page.getByRole('button', { name: 'Load Example' }).click();
    await page.getByRole('button', { name: 'Validate & Load Brief' }).click();
    await expect(page.getByText(/Brief Validated/i)).toBeVisible();
    await page.getByRole('button', { name: 'Run Pipeline' }).click();

    await expect(page.getByText('Campaign Results', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Generated Asset Gallery', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('EcoBottle', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('SolarCharger', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('1:1').first()).toBeVisible();
    await expect(page.getByText('9:16').first()).toBeVisible();
    await expect(page.getByText('16:9').first()).toBeVisible();
  });
});

test.describe('Post-MVP Localization', () => {
  test('Given target region is Mexico, Then pipeline uses the original campaign message while localization remains disabled for MVP', async ({ page }) => {
    await page.route(LEONARDO_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          imageData: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgQXv3XQAAAAASUVORK5CYII=',
        }),
      });
    });

    await page.route(DROPBOX_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ path_lower: '/test/path', rev: 'test-rev' }),
      });
    });

    await page.goto('/');
    await page.getByPlaceholder('Enter your Leonardo API key').fill('test-key');
    await page.getByPlaceholder('Enter your Dropbox access token').fill('test-token');
    await page.getByRole('button', { name: 'Save Credentials' }).click();
    await page.getByRole('button', { name: 'Load Example' }).click();

    const briefArea = page.getByPlaceholder('Paste your campaign brief as JSON or YAML...');
    const current = await briefArea.inputValue();
    await briefArea.fill(current.replace('"United States"', '"Mexico"'));

    await page.getByRole('button', { name: 'Validate & Load Brief' }).click();
    await page.getByRole('button', { name: /Run Pipeline for \d+ Products/ }).click();

    await expect(page.getByText('Campaign Results', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('EcoBottle', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('SolarCharger', { exact: true }).first()).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('Given only Leonardo credential is present, Then app stays on settings until Dropbox is configured', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('ad-campaigns-leonardo-api-key', 'test-key');
      window.localStorage.removeItem('ad-campaigns-dropbox-token');
    });

    await page.goto('/');
    await expect(page.getByText('System Credentials', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Leonardo API Key')).toHaveValue('test-key');
    await expect(page.getByLabel('Dropbox Access Token')).toHaveValue('');
    await expect(page.getByRole('button', { name: 'Save Credentials' })).toBeDisabled();
  });

  test('Given an invalid Leonardo API key, Then the pipeline displays an explicit error message instead of pending indefinitely', async ({ page }) => {
    await page.route(LEONARDO_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'text/plain',
        body: 'Leonardo API key is invalid.',
      });
    });

    await page.goto('/');
    await page.getByPlaceholder('Enter your Leonardo API key').fill('invalid-key');
    await page.getByPlaceholder('Enter your Dropbox access token').fill('test-token');
    await page.getByRole('button', { name: 'Save Credentials' }).click();
    await page.getByRole('button', { name: 'Load Example' }).click();
    await page.getByRole('button', { name: 'Validate & Load Brief' }).click();
    await expect(page.getByText(/Brief Validated/i)).toBeVisible();
    await page.getByRole('button', { name: /Run Pipeline for \d+ Products/ }).click();

    await expect(page.getByText('Campaign Results', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Failed', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Leonardo API key is invalid.', { exact: false }).first()).toBeVisible();
  });
});
