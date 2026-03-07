import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setApiKey, setDropboxAccessToken } from '@/features/core/settings/slice/settingsActions';
import { selectApiKey, selectDropboxAccessToken } from '@/features/core/settings/slice/settingsSelectors';
import { setApiKeyInput, setCurrentPage, setDropboxAccessTokenInput } from '@/features/core/ui/slice/uiActions';
import { selectApiKeyInput, selectDropboxAccessTokenInput } from '@/features/core/ui/slice/uiSelectors';
import { useTestGeminiApiKeyMutation, useTestDropboxTokenMutation } from '@/features/core/api/slice/apiSlice';
import { Label } from '@/components/elements/generic/Label';
import { Input } from '@/components/elements/generic/Input';
import { Button } from '@/components/elements/generic/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/elements/generic/Card';
import { Separator } from '@/components/elements/generic/Separator';

type MutationError =
  | { data?: unknown; error?: string; status?: number | string }
  | undefined;

const extractErrorText = (error: MutationError): string => {
  if (!error) {
    return 'Unknown validation error.';
  }

  const data = error.data;
  if (typeof data === 'string' && data.trim().length > 0) {
    return data;
  }

  if (data && typeof data === 'object') {
    const nestedMessage = (data as { error?: { message?: unknown } }).error?.message;
    if (typeof nestedMessage === 'string' && nestedMessage.trim().length > 0) {
      return nestedMessage;
    }
  }

  if (typeof error.error === 'string' && error.error.trim().length > 0) {
    return error.error;
  }

  return 'Request failed. Please verify the value and try again.';
};

export function SettingsScreen() {
  const dispatch = useAppDispatch();
  const apiKeyInput = useAppSelector(selectApiKeyInput);
  const dropboxAccessTokenInput = useAppSelector(selectDropboxAccessTokenInput);
  const currentApiKey = useAppSelector(selectApiKey);
  const currentDropboxAccessToken = useAppSelector(selectDropboxAccessToken);
  const hasValidInputs = apiKeyInput.trim().length > 0 && dropboxAccessTokenInput.trim().length > 0;

  const [testGemini, { isLoading: isTestingGemini, isSuccess: geminiSuccess, isError: geminiError, error: geminiErrorObj }] = useTestGeminiApiKeyMutation();
  const [testDropbox, { isLoading: isTestingDropbox, isSuccess: dropboxSuccess, isError: dropboxError, error: dropboxErrorObj }] = useTestDropboxTokenMutation();
  const geminiErrorMessage = extractErrorText(geminiErrorObj as MutationError);
  const dropboxErrorMessage = extractErrorText(dropboxErrorObj as MutationError);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto mt-8 max-w-xl px-4"
    >
      <Card className="border-none shadow-xl lg:border">
        <CardHeader className="pb-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">System Credentials</CardTitle>
              <CardDescription className="text-sm mt-1">
                Configure your API keys and storage tokens.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <Separator className="opacity-50" />

        <CardContent className="space-y-8 pt-8">
          {/* Gemini API Key Section */}
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="api-key" className="text-sm font-bold uppercase tracking-wider text-primary">
                Gemini API Key
              </Label>
              <p className="text-xs text-muted-foreground">
                Get your key: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-medium hover:text-primary transition-colors">Google AI Studio</a>
              </p>
            </div>

            <div className="flex gap-3">
              <Input
                id="api-key"
                type="password"
                value={apiKeyInput}
                onChange={(e) => dispatch(setApiKeyInput(e.target.value))}
                placeholder="Enter your API key"
                className="font-mono text-sm"
              />
              <Button
                variant="secondary"
                size="sm"
                className="px-6 font-bold uppercase text-[10px] tracking-widest"
                disabled={!apiKeyInput.trim() || isTestingGemini}
                onClick={() => testGemini({ apiKey: apiKeyInput.trim() })}
              >
                {isTestingGemini ? 'Testing...' : 'Test'}
              </Button>
            </div>
            {geminiSuccess && <p className="text-xs font-bold text-green-600 animate-in fade-in slide-in-from-top-1">✓ Connection successful</p>}
            {geminiError && (
              <p className="text-xs font-bold text-destructive animate-in fade-in slide-in-from-top-1">
                ✗ Connection failed. Reason: {geminiErrorMessage}
              </p>
            )}
          </div>

          <Separator className="opacity-30" />

          {/* Dropbox Section */}
          <div className="space-y-4 text-left">
            <div className="space-y-1">
              <Label htmlFor="dropbox-token" className="text-sm font-bold uppercase tracking-wider text-primary">
                Dropbox Access Token
              </Label>
              <p className="text-xs text-muted-foreground">
                Generate token: <a href="https://www.dropbox.com/developers/apps" target="_blank" rel="noreferrer" className="underline font-medium hover:text-primary transition-colors">Dropbox Developers</a>
              </p>
            </div>

            <div className="flex gap-3">
              <Input
                id="dropbox-token"
                type="password"
                value={dropboxAccessTokenInput}
                onChange={(e) => dispatch(setDropboxAccessTokenInput(e.target.value))}
                placeholder="Enter your Dropbox access token"
                className="font-mono text-sm"
              />
              <Button
                variant="secondary"
                size="sm"
                className="px-6 font-bold uppercase text-[10px] tracking-widest"
                disabled={!dropboxAccessTokenInput.trim() || isTestingDropbox}
                onClick={() => testDropbox({ accessToken: dropboxAccessTokenInput.trim() })}
              >
                {isTestingDropbox ? 'Testing...' : 'Test'}
              </Button>
            </div>
            {dropboxSuccess && <p className="text-xs font-bold text-green-600 animate-in fade-in slide-in-from-top-1">✓ Dropbox linked successfully</p>}
            {dropboxError && (
              <p className="text-xs font-bold text-destructive animate-in fade-in slide-in-from-top-1">
                ✗ Dropbox link failed. Reason: {dropboxErrorMessage}
              </p>
            )}
          </div>
        </CardContent>

        <Separator className="opacity-50" />

        <CardContent className="flex items-center justify-end gap-3 py-6 bg-muted/20">
          {currentApiKey && currentDropboxAccessToken && (
            <Button
              variant="ghost"
              className="text-xs font-bold uppercase tracking-widest"
              onClick={() => dispatch(setCurrentPage('home'))}
            >
              Back to App
            </Button>
          )}
          <Button
            size="lg"
            className="px-10 font-bold uppercase tracking-widest"
            onClick={() => {
              dispatch(setApiKey(apiKeyInput.trim()));
              dispatch(setDropboxAccessToken(dropboxAccessTokenInput.trim()));
            }}
            disabled={!hasValidInputs}
          >
            Save Credentials
          </Button>
        </CardContent>
      </Card>

      <footer className="mt-8 text-center text-[10px] text-muted-foreground uppercase tracking-[0.2em] opacity-40">
        Secure Credential Management Engine v1.0
      </footer>
    </motion.div>
  );
}
