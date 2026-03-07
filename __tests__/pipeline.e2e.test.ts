import { expect, test } from '@playwright/test';

const GEMINI_API_PATTERN = '**/v1beta/models/gemini-*:generateContent**';
const DROPBOX_API_PATTERN = '**/2/files/upload';

test.describe('Story 5: Organized Output', () => {
  test('Given a completed pipeline run, Then output metadata is organized by product and format', async ({ page }) => {
    await page.route(GEMINI_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    inlineData: {
                      mimeType: 'image/png',
                      data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgQXv3XQAAAAASUVORK5CYII=',
                    },
                  },
                ],
              },
            },
          ],
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
    await page.getByPlaceholder('Enter your API key').fill('test-key');
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

test.describe('Story 9: Localization', () => {
  test('Given target region is Mexico, Then pipeline reaches results with localized flow enabled', async ({ page }) => {
    await page.route(GEMINI_API_PATTERN, async (route) => {
      const requestBody = route.request().postDataJSON() as { contents?: Array<{ parts?: Array<{ text?: string }> }> };
      const prompt = requestBody?.contents?.[0]?.parts?.[0]?.text ?? '';
      const isTranslation = prompt.toLowerCase().includes('translate the following text');

      if (isTranslation) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            candidates: [{ content: { parts: [{ text: 'Mantente hidratado, mantente verde' }] } }],
          }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    inlineData: {
                      mimeType: 'image/png',
                      data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgQXv3XQAAAAASUVORK5CYII=',
                    },
                  },
                ],
              },
            },
          ],
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
    await page.getByPlaceholder('Enter your API key').fill('test-key');
    await page.getByPlaceholder('Enter your Dropbox access token').fill('test-token');
    await page.getByRole('button', { name: 'Save Credentials' }).click();
    await page.getByRole('button', { name: 'Load Example' }).click();

    const briefArea = page.getByPlaceholder('Paste your campaign brief as JSON or YAML...');
    const current = await briefArea.inputValue();
    await briefArea.fill(current.replace('"United States"', '"Mexico"'));

    await page.getByRole('button', { name: 'Validate & Load Brief' }).click();
    await page.getByRole('button', { name: /Run Pipeline for \d+ Products/ }).click();

    await expect(page.getByText('Campaign Results', { exact: true }).first()).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('Given only Gemini credential is present, Then pipeline shows missing token reason and settings action', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('ad-campaigns-api-key', 'test-key');
      window.localStorage.removeItem('ad-campaigns-dropbox-token');
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Load Example' }).click();
    await page.getByRole('button', { name: 'Validate & Load Brief' }).click();
    await page.getByRole('button', { name: /Run Pipeline for \d+ Products/ }).click();

    await expect(page.getByText('Pipeline encountered errors.', { exact: true })).toBeVisible();
    await expect(page.getByText('Reason: Dropbox access token not configured', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open Settings' })).toBeVisible();
  });

  test('Given an invalid Gemini API key, Then the pipeline displays an explicit error message instead of pending indefinitely', async ({ page }) => {
    // Intercept to mock a 400 Bad Request due to invalid API key
    await page.route(GEMINI_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 400,
            message: 'API key not valid. Please pass a valid API key.',
            status: 'INVALID_ARGUMENT',
            details: [
              {
                '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
                reason: 'API_KEY_INVALID',
                domain: 'googleapis.com',
                metadata: {
                  service: 'generativelanguage.googleapis.com',
                },
              },
            ],
          },
        }),
      });
    });

    await page.goto('/');
    await page.getByPlaceholder('Enter your API key').fill('invalid-key');
    await page.getByPlaceholder('Enter your Dropbox access token').fill('test-token');
    await page.getByRole('button', { name: 'Save Credentials' }).click();
    await page.getByRole('button', { name: 'Load Example' }).click();
    await page.getByRole('button', { name: 'Validate & Load Brief' }).click();
    await expect(page.getByText(/Brief Validated/i)).toBeVisible();
    await page.getByRole('button', { name: /Run Pipeline for \d+ Products/ }).click();

    await expect(page.getByText('Campaign Results', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Failed', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('API key not valid', { exact: false }).first()).toBeVisible();
  });
});
