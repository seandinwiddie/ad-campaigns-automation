# Leonardo AI API

## Setup

- **Env:** `NEXT_PUBLIC_LEONARDO_AI_API_KEY` in `.env.local`
- **Base URL:** `https://cloud.leonardo.ai/api/rest/v1`
- **Auth:** Bearer token in header: `Authorization: Bearer <API_KEY>`

---

## Test API key (curl)

```bash
curl -s --request GET \
  --url "https://cloud.leonardo.ai/api/rest/v1/me" \
  --header "accept: application/json" \
  --header "authorization: Bearer YOUR_LEONARDO_API_KEY"
```

Success: HTTP 200 with `user_details` (username, subscription tokens, API paid tokens, apiConcurrencySlots, etc.).

---

## Generate one image

### 1. Create generation (POST)

```bash
curl -s -X POST "https://cloud.leonardo.ai/api/rest/v1/generations" \
  -H "accept: application/json" \
  -H "authorization: Bearer YOUR_LEONARDO_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "prompt": "A serene mountain landscape at sunset, soft clouds, photorealistic",
    "modelId": "b24e16ff-06e3-43eb-8d33-4416c2d75876",
    "num_images": 1,
    "width": 768,
    "height": 768,
    "alchemy": true
  }'
```

Response includes `sdGenerationJob.generationId` and `cost` (e.g. `"amount":"0.0224","unit":"DOLLARS"`).

**Key body params:**

| Param       | Required | Notes |
|------------|----------|--------|
| `prompt`   | yes      | Text description for the image |
| `modelId`  | no       | Default: `b24e16ff-06e3-43eb-8d33-4416c2d75876` (Leonardo Lightning XL) |
| `num_images` | no    | 1–8 (1–4 if width or height > 768). Default 4 |
| `width`    | no       | 32–1536, multiple of 8 |
| `height`   | no       | 32–1536, multiple of 8. Default 768 |
| `alchemy`  | no       | Default true. Uses Alchemy for the model |
| `guidance_scale` | no  | 1–20, 7 recommended |
| `negative_prompt` | no  | What to avoid in the image |

List platform models: `GET https://cloud.leonardo.ai/api/rest/v1/platformModels` (same auth).

### 2. Poll for completion (GET)

```bash
curl -s "https://cloud.leonardo.ai/api/rest/v1/generations/{generationId}" \
  -H "accept: application/json" \
  -H "authorization: Bearer YOUR_LEONARDO_API_KEY"
```

Poll every few seconds until `generations_by_pk.generated_images` has entries with `url`. Status may be `PENDING` or `GENERATING` then complete.

### 3. Image URL and download

From the GET response: `generations_by_pk.generated_images[].url` (temporary CDN URL).

Download with curl:

```bash
curl -sL -o "leonardo-generated.jpg" "IMAGE_URL_FROM_RESPONSE"
```

---

## Example flow (one image)

1. **POST** `/generations` with `prompt`, `num_images: 1`, optional `modelId`/`width`/`height`/`alchemy`.
2. Read `sdGenerationJob.generationId` from the response.
3. **GET** `/generations/{generationId}` until `generated_images` is non-empty.
4. Use `generated_images[0].url` to display or download the image.

---

## Cost

- Billed per generation (e.g. ~$0.02 for one 768×768 image with default model).
- Check balance via **GET** `/me` (e.g. `subscriptionTokens`, `apiPaidTokens`).

---

## Security

- Keep the API key in `.env.local` only; do not commit it.
- Ensure `.env.local` is in `.gitignore`.
- If the key was ever committed or shared, rotate it in [Leonardo API Access](https://leonardo.ai) (API Access → Create New Key / revoke old).
