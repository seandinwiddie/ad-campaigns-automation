import { expect, test, type Page } from '@playwright/test';

const GEMINI_API_PATTERN = '**/v1beta/models/gemini-*:generateContent**';
const OPENAI_IMAGE_API_PATTERN = '**/v1/images/generations';
const DROPBOX_API_PATTERN = '**/2/files/upload';
const POLLINATIONS_IMAGE_PATTERN = '**/gen.pollinations.ai/**';

type StoredCredentials = {
  geminiKey?: string;
  openAiKey?: string;
  pollinationsKey?: string;
  dropboxToken?: string;
};

const seedStoredCredentials = async (page: Page, credentials: StoredCredentials) => {
  await page.addInitScript((nextCredentials) => {
    window.localStorage.setItem('ad-campaigns-api-key', nextCredentials.geminiKey ?? '');
    window.localStorage.setItem('ad-campaigns-openai-api-key', nextCredentials.openAiKey ?? '');
    window.localStorage.setItem('ad-campaigns-pollinations-api-key', nextCredentials.pollinationsKey ?? '');
    window.localStorage.setItem('ad-campaigns-dropbox-token', nextCredentials.dropboxToken ?? '');
  }, credentials);
};

const openHomeScreen = async (page: Page) => {
  await page.goto('/');

  const homeHeading = page.getByText('Creative Automation');
  const backToAppButton = page.getByRole('button', { name: 'Back to App' });
  let navigatedFromSettings = false;

  try {
    await homeHeading.waitFor({ state: 'visible', timeout: 3_000 });
  } catch {
    await backToAppButton.waitFor({ state: 'visible', timeout: 5_000 });
    await backToAppButton.click();
    navigatedFromSettings = true;
  }

  if (!navigatedFromSettings && await backToAppButton.isVisible().catch(() => false)) {
    await page.getByRole('button', { name: 'Back to App' }).click();
  }

  await expect(homeHeading).toBeVisible();
};

const loadExampleBrief = async (page: Page) => {
  await page.getByRole('button', { name: 'Load Example' }).click();
};

const validateLoadedBrief = async (page: Page) => {
  await page.getByRole('button', { name: 'Validate & Load Brief' }).click();
  await expect(page.getByText(/Brief Validated/i)).toBeVisible();
};

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

    await seedStoredCredentials(page, { geminiKey: 'test-key', openAiKey: '', dropboxToken: 'test-token' });
    await openHomeScreen(page);
    await loadExampleBrief(page);
    await validateLoadedBrief(page);
    await page.getByRole('button', { name: 'Run Pipeline' }).click();

    await expect(page.getByText('Campaign Results', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Generated Asset Gallery', { exact: true }).first()).toBeVisible();
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

    await seedStoredCredentials(page, { geminiKey: 'test-key', openAiKey: '', dropboxToken: 'test-token' });
    await openHomeScreen(page);
    await loadExampleBrief(page);

    const briefArea = page.getByPlaceholder('Paste your campaign brief as JSON or YAML...');
    const current = await briefArea.inputValue();
    await briefArea.fill(current.replace('"United States"', '"Mexico"'));

    await validateLoadedBrief(page);
    await page.getByRole('button', { name: /Run Pipeline for \d+ Products/ }).click();

    await expect(page.getByText('Campaign Results', { exact: true }).first()).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('Given no credentials, Then user can validate brief and run pipeline (Pollinations free fallback)', async ({ page }) => {
    await page.route(POLLINATIONS_IMAGE_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgQXv3XQAAAAASUVORK5CYII=',
          'base64'
        ),
      });
    });
    await page.route(DROPBOX_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ path_lower: '/test/path', rev: 'test-rev' }),
      });
    });

    await seedStoredCredentials(page, { geminiKey: '', openAiKey: '', dropboxToken: '' });
    await openHomeScreen(page);
    await loadExampleBrief(page);
    await expect(page.getByRole('button', { name: 'Validate & Load Brief' })).toBeEnabled();
    await validateLoadedBrief(page);
    await expect(page.getByRole('button', { name: /Run Pipeline for \d+ Products/ })).toBeEnabled();
    await page.getByRole('button', { name: /Run Pipeline for \d+ Products/ }).click();
    await expect(page.getByText('Campaign Results', { exact: true }).first()).toBeVisible();
  });

  test('Given credentials are removed in Settings and user returns, Then validate and run remain enabled (Pollinations available)', async ({ page }) => {
    await seedStoredCredentials(page, { geminiKey: 'test-key', openAiKey: '', dropboxToken: 'test-token' });

    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
    await page.getByRole('button', { name: 'Settings' }).click();
    await expect(page.getByText('System Credentials')).toBeVisible();

    await page.getByPlaceholder('Enter your API key').fill('');
    await page.getByPlaceholder('Enter your OpenAI API key (optional)').fill('');
    await page.getByRole('button', { name: 'Back to App' }).click();

    await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
    await loadExampleBrief(page);
    await expect(page.getByRole('button', { name: 'Validate & Load Brief' })).toBeEnabled();
    await validateLoadedBrief(page);
    await expect(page.getByRole('button', { name: /Run Pipeline for \d+ Products/ })).toBeEnabled();
  });

  test('Given an invalid Gemini API key, Then the pipeline displays an explicit error message instead of pending indefinitely', async ({ page }) => {
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

    // Pollinations fallback must also fail so we see the Gemini error (no OpenAI key configured)
    await page.route(POLLINATIONS_IMAGE_PATTERN, async (route) => {
      await route.fulfill({ status: 500, body: 'Pollinations unavailable' });
    });

    await seedStoredCredentials(page, { geminiKey: 'invalid-key', openAiKey: '', dropboxToken: 'test-token' });
    await openHomeScreen(page);
    await loadExampleBrief(page);
    await validateLoadedBrief(page);
    await page.getByRole('button', { name: /Run Pipeline for \d+ Products/ }).click();

    await expect(page.getByText('Campaign Results', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Failed', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('API key not valid', { exact: false }).first()).toBeVisible();
  });

  test('Given DALL-E 3 fails and DALL-E 2 succeeds, Then pipeline completes with OpenAI fallback', async ({ page }) => {
    let openAiCallCount = 0;

    await page.route(GEMINI_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: { message: 'API key not valid' } }),
      });
    });

    await page.route(OPENAI_IMAGE_API_PATTERN, async (route) => {
      openAiCallCount += 1;
      const body = await route.request().postDataJSON();
      const isDalle3 = body?.model === 'dall-e-3';
      if (isDalle3) {
        await route.fulfill({
          status: 402,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Billing limit exceeded for DALL-E 3' } }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [
              {
                b64_json: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgQXv3XQAAAAASUVORK5CYII=',
              },
            ],
          }),
        });
      }
    });

    await page.route(DROPBOX_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ path_lower: '/test/path', rev: 'test-rev' }),
      });
    });

    await seedStoredCredentials(page, { geminiKey: 'gemini-key', openAiKey: 'openai-key', dropboxToken: 'test-token' });
    await openHomeScreen(page);
    await loadExampleBrief(page);
    await validateLoadedBrief(page);
    await page.getByRole('button', { name: /Run Pipeline for \d+ Products/ }).click();

    await expect(page.getByText('Campaign Results', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Download PNG' }).first()).toBeVisible();
    expect(openAiCallCount).toBeGreaterThan(0);
  });

  test('Given Gemini returns high demand and OpenAI key exists, Then pipeline uses OpenAI fallback and completes', async ({ page }) => {
    let openAiGenerationCount = 0;

    await page.route(GEMINI_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: 'This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.',
          },
        }),
      });
    });

    await page.route(OPENAI_IMAGE_API_PATTERN, async (route) => {
      openAiGenerationCount += 1;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              b64_json: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgQXv3XQAAAAASUVORK5CYII=',
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

    await seedStoredCredentials(page, { geminiKey: 'gemini-key', openAiKey: 'openai-key', dropboxToken: 'test-token' });
    await openHomeScreen(page);
    await loadExampleBrief(page);
    await validateLoadedBrief(page);
    await page.getByRole('button', { name: /Run Pipeline for \d+ Products/ }).click();

    await expect(page.getByText('Campaign Results', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Download PNG' }).first()).toBeVisible();
    expect(openAiGenerationCount).toBeGreaterThan(0);
  });

  test('Given only an OpenAI key and Dropbox token are configured, Then the app can validate and run the pipeline', async ({ page }) => {
    await page.route(OPENAI_IMAGE_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              b64_json: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgQXv3XQAAAAASUVORK5CYII=',
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

    await seedStoredCredentials(page, { geminiKey: '', openAiKey: 'openai-key', dropboxToken: 'test-token' });
    await openHomeScreen(page);
    await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
    await loadExampleBrief(page);
    await validateLoadedBrief(page);
    await page.getByRole('button', { name: /Run Pipeline for \d+ Products/ }).click();

    await expect(page.getByText('Campaign Results', { exact: true }).first()).toBeVisible();
  });

  test('Given no Dropbox token is configured, Then the pipeline still completes and offers downloads', async ({ page }) => {
    await page.route(OPENAI_IMAGE_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              b64_json: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgQXv3XQAAAAASUVORK5CYII=',
            },
          ],
        }),
      });
    });

    await seedStoredCredentials(page, { geminiKey: '', openAiKey: 'openai-key', dropboxToken: '' });
    await openHomeScreen(page);
    await loadExampleBrief(page);
    await validateLoadedBrief(page);
    await page.getByRole('button', { name: /Run Pipeline for \d+ Products/ }).click();

    await expect(page.getByText('Campaign Results', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Dropbox unavailable for one or more assets')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Download PNG' }).first()).toBeVisible();
  });

  test('Given Gemini and OpenAI both fail, Then pipeline uses Pollinations fallback and completes', async ({ page }) => {
    const tinyPngBase64 =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgQXv3XQAAAAASUVORK5CYII=';

    await page.route(GEMINI_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: { message: 'API key not valid' } }),
      });
    });

    await page.route(OPENAI_IMAGE_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ error: { message: 'Rate limit exceeded' } }),
      });
    });

    await page.route(POLLINATIONS_IMAGE_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: Buffer.from(tinyPngBase64, 'base64'),
      });
    });

    await page.route(DROPBOX_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ path_lower: '/test/path', rev: 'test-rev' }),
      });
    });

    await seedStoredCredentials(page, {
      geminiKey: 'invalid-gemini',
      openAiKey: 'invalid-openai',
      dropboxToken: 'test-token',
    });
    await openHomeScreen(page);
    await loadExampleBrief(page);
    await validateLoadedBrief(page);
    await page.getByRole('button', { name: /Run Pipeline for \d+ Products/ }).click();

    await expect(page.getByText('Campaign Results', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('1:1').first()).toBeVisible();
  });

  test('Given Dropbox upload fails, Then the pipeline still completes and offers direct downloads', async ({ page }) => {
    await page.route(OPENAI_IMAGE_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              b64_json: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgQXv3XQAAAAASUVORK5CYII=',
            },
          ],
        }),
      });
    });

    await page.route(DROPBOX_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'text/plain',
        body: 'The given OAuth 2 access token is malformed.',
      });
    });

    await seedStoredCredentials(page, { geminiKey: '', openAiKey: 'openai-key', dropboxToken: 'invalid-dropbox-token' });
    await openHomeScreen(page);
    await loadExampleBrief(page);
    await validateLoadedBrief(page);
    await page.getByRole('button', { name: /Run Pipeline for \d+ Products/ }).click();

    await expect(page.getByText('Campaign Results', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Dropbox unavailable for one or more assets')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Download PNG' }).first()).toBeVisible();
  });
});
