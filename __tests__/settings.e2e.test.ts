import { test, expect } from '@playwright/test';

test.describe('Settings API Configurations', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await expect(page.getByText('System Credentials')).toBeVisible();
    });

    test('Valid Gemini API Key', async ({ page }) => {
        // Mock successful Gemini API models response
        await page.route('https://generativelanguage.googleapis.com/v1beta/models?key=*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ models: [] }),
            });
        });

        const apiKeyInput = page.getByLabel('Gemini API Key');
        await apiKeyInput.fill('valid-gemini-key');

        // Click the test button next to it (it's the first "Test" button)
        const geminiTestBtn = page.getByRole('button', { name: 'Test' }).first();
        await geminiTestBtn.click();

        await expect(page.getByText('✓ Connection successful')).toBeVisible();
    });

    test('Invalid Gemini API Key', async ({ page }) => {
        // Mock failed Gemini API key response
        const errorMessage = 'API key not valid. Please pass a valid API key.';
        await page.route('https://generativelanguage.googleapis.com/v1beta/models?key=*', async (route) => {
            await route.fulfill({
                status: 400,
                contentType: 'application/json',
                body: JSON.stringify({ error: { message: errorMessage } }),
            });
        });

        const apiKeyInput = page.getByLabel('Gemini API Key');
        await apiKeyInput.fill('invalid-gemini-key');

        const geminiTestBtn = page.getByRole('button', { name: 'Test' }).first();
        await geminiTestBtn.click();

        await expect(page.getByText(`✗ Connection failed. Reason: ${errorMessage}`)).toBeVisible();
    });

    test('Valid Dropbox Token', async ({ page }) => {
        // Mock successful Dropbox response
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
        // Mock failed Dropbox response
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
