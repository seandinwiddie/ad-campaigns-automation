'use client';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setApiKey, setDropboxAccessToken } from '@/features/core/settings/slice/settingsActions';
import { selectApiKey, selectDropboxAccessToken } from '@/features/core/settings/slice/settingsSelectors';
import { setApiKeyInput, setCurrentPage, setDropboxAccessTokenInput } from '@/features/core/ui/slice/uiActions';
import { selectApiKeyInput, selectDropboxAccessTokenInput } from '@/features/core/ui/slice/uiSelectors';
import { Label } from '@/components/elements/generic/Label';
import { Input } from '@/components/elements/generic/Input';
import { Button } from '@/components/elements/generic/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/elements/generic/Card';

export function SettingsScreen() {
  const dispatch = useAppDispatch();
  const apiKeyInput = useAppSelector(selectApiKeyInput);
  const dropboxAccessTokenInput = useAppSelector(selectDropboxAccessTokenInput);
  const currentApiKey = useAppSelector(selectApiKey);
  const currentDropboxAccessToken = useAppSelector(selectDropboxAccessToken);
  const hasValidInputs = apiKeyInput.trim().length > 0 && dropboxAccessTokenInput.trim().length > 0;

  return (
    <Card className="mx-auto mt-8 max-w-xl">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Configure your API and Dropbox credentials.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label htmlFor="api-key">Gemini Nano Banana API Key</Label>
        <Input
          id="api-key"
          type="password"
          value={apiKeyInput}
          onChange={(e) => dispatch(setApiKeyInput(e.target.value))}
          placeholder="Enter your API key"
        />
        <Label htmlFor="dropbox-token">Dropbox Access Token</Label>
        <Input
          id="dropbox-token"
          type="password"
          value={dropboxAccessTokenInput}
          onChange={(e) => dispatch(setDropboxAccessTokenInput(e.target.value))}
          placeholder="Enter your Dropbox access token"
        />

        <CardContent className="flex gap-3 px-0">
          <Button
            onClick={() => {
              dispatch(setApiKey(apiKeyInput.trim()));
              dispatch(setDropboxAccessToken(dropboxAccessTokenInput.trim()));
            }}
            disabled={!hasValidInputs}
          >
            Save
          </Button>
          {currentApiKey && currentDropboxAccessToken && (
            <Button
              variant="outline"
              onClick={() => dispatch(setCurrentPage('home'))}
            >
              Cancel
            </Button>
          )}
        </CardContent>
      </CardContent>
    </Card>
  );
}
