import { test, expect } from '@playwright/test';

test.describe('Settings API Configurations', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await expect(page.getByText('System Credentials')).toBeVisible();
    });

    test('Valid Leonardo API Key', async ({ page }) => {
        await page.route('**/api/leonardo/validate', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true }),
            });
        });

        const apiKeyInput = page.getByLabel('Leonardo API Key');
        await apiKeyInput.fill('valid-leonardo-key');

        const leonardoTestBtn = page.getByRole('button', { name: 'Test' }).first();
        await leonardoTestBtn.click();

        await expect(page.getByText('✓ Leonardo connection successful')).toBeVisible();
    });

    test('Invalid Leonardo API Key', async ({ page }) => {
        const errorMessage = 'Leonardo API key is invalid.';
        await page.route('**/api/leonardo/validate', async (route) => {
            await route.fulfill({
                status: 400,
                contentType: 'text/plain',
                body: errorMessage,
            });
        });

        const apiKeyInput = page.getByLabel('Leonardo API Key');
        await apiKeyInput.fill('invalid-leonardo-key');

        const leonardoTestBtn = page.getByRole('button', { name: 'Test' }).first();
        await leonardoTestBtn.click();

        await expect(page.getByText(`✗ Leonardo connection failed. Reason: ${errorMessage}`)).toBeVisible();
    });

    test('Valid Dropbox Token', async ({ page }) => {
        await page.route('https://api.dropboxapi.com/2/check/user', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ result: 'ok' }),
            });
        });

        const dropboxInput = page.getByLabel('Dropbox Access Token');
        await dropboxInput.fill('valid-dropbox-token');

        const dropboxTestBtn = page.locator('div').filter({ hasText: /^Dropbox Access Token/ }).getByRole('button', { name: 'Test' }).last();
        await dropboxTestBtn.click();

        await expect(page.getByText('✓ Dropbox linked successfully')).toBeVisible();
    });

    test('Invalid Dropbox Token', async ({ page }) => {
        const errorText = 'The given OAuth 2 access token is malformed.';
        await page.route('https://api.dropboxapi.com/2/check/user', async (route) => {
            await route.fulfill({
                status: 401,
                contentType: 'text/plain',
                body: errorText,
            });
        });

        const dropboxInput = page.getByLabel('Dropbox Access Token');
        await dropboxInput.fill('invalid-dropbox-token');

        const dropboxTestBtn = page.locator('div').filter({ hasText: /^Dropbox Access Token/ }).getByRole('button', { name: 'Test' }).last();
        await dropboxTestBtn.click();

        await expect(page.getByText(`✗ Dropbox link failed. Reason: ${errorText}`)).toBeVisible();
    });
});
