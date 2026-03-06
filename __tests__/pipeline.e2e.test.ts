import { expect, test } from '@playwright/test';

const GEMINI_API_PATTERN = '**/v1beta/models/gemini-2.0-flash-exp:generateContent**';

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

    await page.goto('/');
    await page.getByPlaceholder('Enter your API key').fill('test-key');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Load Example' }).click();
    await page.getByRole('button', { name: 'Validate & Load' }).click();
    await expect(page.getByText(/Brief loaded/i)).toBeVisible();
    await page.getByRole('button', { name: 'Run Pipeline' }).click();

    await expect(page.getByRole('heading', { name: 'Campaign Results' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Generated Creatives' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'EcoBottle' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'SolarCharger' })).toBeVisible();
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

    await page.goto('/');
    await page.getByPlaceholder('Enter your API key').fill('test-key');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Load Example' }).click();

    const briefArea = page.getByPlaceholder('Paste your campaign brief as JSON or YAML...');
    const current = await briefArea.inputValue();
    await briefArea.fill(current.replace('"United States"', '"Mexico"'));

    await page.getByRole('button', { name: 'Validate & Load' }).click();
    await page.getByRole('button', { name: 'Run Pipeline' }).click();

    await expect(page.getByRole('heading', { name: 'Campaign Results' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Compliance Report' })).toBeVisible();
  });
});
