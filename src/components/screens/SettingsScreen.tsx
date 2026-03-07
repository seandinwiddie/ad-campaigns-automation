import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  clearApiKey,
  clearDropboxAccessToken,
  clearOpenAiApiKey,
  clearPollinationsApiKey,
  setApiKey,
  setDropboxAccessToken,
  setOpenAiApiKey,
  setPollinationsApiKey,
} from '@/features/core/settings/slice/settingsActions';
import { selectApiKey, selectDropboxAccessToken, selectOpenAiApiKey, selectPollinationsApiKey } from '@/features/core/settings/slice/settingsSelectors';
import {
  setApiKeyInput,
  setCurrentPage,
  setDropboxAccessTokenInput,
  setOpenAiApiKeyInput,
  setPollinationsApiKeyInput,
} from '@/features/core/ui/slice/uiActions';
import { selectApiKeyInput, selectDropboxAccessTokenInput, selectOpenAiApiKeyInput, selectPollinationsApiKeyInput } from '@/features/core/ui/slice/uiSelectors';
import { useTestGeminiApiKeyMutation, useTestDropboxTokenMutation, useTestOpenAiApiKeyMutation, useTestPollinationsApiKeyMutation } from '@/features/core/api/slice/apiSlice';
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
  const openAiApiKeyInput = useAppSelector(selectOpenAiApiKeyInput);
  const pollinationsApiKeyInput = useAppSelector(selectPollinationsApiKeyInput);
  const dropboxAccessTokenInput = useAppSelector(selectDropboxAccessTokenInput);
  const currentApiKey = useAppSelector(selectApiKey);
  const currentOpenAiApiKey = useAppSelector(selectOpenAiApiKey);
  const currentPollinationsApiKey = useAppSelector(selectPollinationsApiKey);
  const currentDropboxAccessToken = useAppSelector(selectDropboxAccessToken);
  const normalizedApiKey = apiKeyInput.trim();
  const normalizedOpenAiApiKey = openAiApiKeyInput.trim();
  const normalizedPollinationsApiKey = pollinationsApiKeyInput.trim();
  const normalizedDropboxToken = dropboxAccessTokenInput.trim();
  const hasChanges =
    (currentApiKey ?? '') !== normalizedApiKey
    || (currentOpenAiApiKey ?? '') !== normalizedOpenAiApiKey
    || (currentPollinationsApiKey ?? '') !== normalizedPollinationsApiKey
    || (currentDropboxAccessToken ?? '') !== normalizedDropboxToken;

  const [testGemini, { isLoading: isTestingGemini, isSuccess: geminiSuccess, isError: geminiError, error: geminiErrorObj }] = useTestGeminiApiKeyMutation();
  const [testOpenAi, { isLoading: isTestingOpenAi, isSuccess: openAiSuccess, isError: openAiError, error: openAiErrorObj }] = useTestOpenAiApiKeyMutation();
  const [testPollinations, { isLoading: isTestingPollinations, isSuccess: pollinationsSuccess, isError: pollinationsError, error: pollinationsErrorObj }] = useTestPollinationsApiKeyMutation();
  const [testDropbox, { isLoading: isTestingDropbox, isSuccess: dropboxSuccess, isError: dropboxError, error: dropboxErrorObj }] = useTestDropboxTokenMutation();
  const geminiErrorMessage = extractErrorText(geminiErrorObj as MutationError);
  const openAiErrorMessage = extractErrorText(openAiErrorObj as MutationError);
  const pollinationsErrorMessage = extractErrorText(pollinationsErrorObj as MutationError);
  const dropboxErrorMessage = extractErrorText(dropboxErrorObj as MutationError);
  const applyCredentialChanges = () => {
    if (normalizedApiKey.length > 0) {
      dispatch(setApiKey(normalizedApiKey));
    } else {
      dispatch(clearApiKey());
    }

    if (normalizedOpenAiApiKey.length > 0) {
      dispatch(setOpenAiApiKey(normalizedOpenAiApiKey));
    } else {
      dispatch(clearOpenAiApiKey());
    }

    if (normalizedPollinationsApiKey.length > 0) {
      dispatch(setPollinationsApiKey(normalizedPollinationsApiKey));
    } else {
      dispatch(clearPollinationsApiKey());
    }

    if (normalizedDropboxToken.length > 0) {
      dispatch(setDropboxAccessToken(normalizedDropboxToken));
    } else {
      dispatch(clearDropboxAccessToken());
    }
  };

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
                Configure at least one AI key (Gemini, OpenAI, or free Pollinations) and an optional Dropbox token.
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
                Get your key: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-semibold text-foreground hover:text-primary transition-colors">Google AI Studio</a>
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

          {/* OpenAI API Key Section */}
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="openai-api-key" className="text-sm font-bold uppercase tracking-wider text-primary">
                OpenAI API Key (Fallback)
              </Label>
              <p className="text-xs text-muted-foreground">
                Get your key: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="underline font-semibold text-foreground hover:text-primary transition-colors">OpenAI Platform</a> (used automatically when Gemini returns temporary high-demand errors).
              </p>
            </div>

            <div className="flex gap-3">
              <Input
                id="openai-api-key"
                type="password"
                value={openAiApiKeyInput}
                onChange={(e) => dispatch(setOpenAiApiKeyInput(e.target.value))}
                placeholder="Enter your OpenAI API key (optional)"
                className="font-mono text-sm"
              />
              <Button
                variant="secondary"
                size="sm"
                className="px-6 font-bold uppercase text-[10px] tracking-widest"
                disabled={!openAiApiKeyInput.trim() || isTestingOpenAi}
                onClick={() => testOpenAi({ apiKey: openAiApiKeyInput.trim() })}
              >
                {isTestingOpenAi ? 'Testing...' : 'Test'}
              </Button>
            </div>
            {openAiSuccess && <p className="text-xs font-bold text-green-600 animate-in fade-in slide-in-from-top-1">✓ OpenAI connection successful</p>}
            {openAiError && (
              <p className="text-xs font-bold text-destructive animate-in fade-in slide-in-from-top-1">
                ✗ OpenAI connection failed. Reason: {openAiErrorMessage}
              </p>
            )}
          </div>

          <Separator className="opacity-30" />

          {/* Pollinations API Key Section */}
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="pollinations-api-key" className="text-sm font-bold uppercase tracking-wider text-primary">
                Pollinations API Key (Free fallback)
              </Label>
              <p className="text-xs text-muted-foreground">
                Get a free key: <a href="https://enter.pollinations.ai" target="_blank" rel="noreferrer" className="underline font-semibold text-foreground hover:text-primary transition-colors">enter.pollinations.ai</a>. Required when using Pollinations as fallback (Gemini/OpenAI unavailable).
              </p>
            </div>

            <div className="flex gap-3">
              <Input
                id="pollinations-api-key"
                type="password"
                value={pollinationsApiKeyInput}
                onChange={(e) => dispatch(setPollinationsApiKeyInput(e.target.value))}
                placeholder="Enter your Pollinations API key (optional)"
                className="font-mono text-sm"
              />
              <Button
                variant="secondary"
                size="sm"
                className="px-6 font-bold uppercase text-[10px] tracking-widest"
                disabled={!pollinationsApiKeyInput.trim() || isTestingPollinations}
                onClick={() => testPollinations({ apiKey: pollinationsApiKeyInput.trim() })}
              >
                {isTestingPollinations ? 'Testing...' : 'Test'}
              </Button>
            </div>
            {pollinationsSuccess && <p className="text-xs font-bold text-green-600 animate-in fade-in slide-in-from-top-1">✓ Pollinations connection successful</p>}
            {pollinationsError && (
              <p className="text-xs font-bold text-destructive animate-in fade-in slide-in-from-top-1">
                ✗ Pollinations connection failed. Reason: {pollinationsErrorMessage}
              </p>
            )}
          </div>

          <Separator className="opacity-30" />

          {/* Dropbox Section */}
          <div className="space-y-4 text-left">
            <div className="space-y-1">
              <Label htmlFor="dropbox-token" className="text-sm font-bold uppercase tracking-wider text-primary">
                Dropbox Access Token (Optional)
              </Label>
              <p className="text-xs text-muted-foreground">
                Generate token: <a href="https://www.dropbox.com/developers/apps" target="_blank" rel="noreferrer" className="underline font-semibold text-foreground hover:text-primary transition-colors">Dropbox Developers</a>. If omitted or invalid, the app will keep images local and offer direct downloads in Results.
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
          <Button
            variant="ghost"
            className="text-xs font-bold uppercase tracking-widest"
            onClick={() => {
              applyCredentialChanges();
              dispatch(setCurrentPage('home'));
            }}
          >
            Back to App
          </Button>
          <Button
            size="lg"
            className="px-10 font-bold uppercase tracking-widest"
            onClick={() => {
              applyCredentialChanges();
              dispatch(setCurrentPage('home'));
            }}
            disabled={!hasChanges}
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
