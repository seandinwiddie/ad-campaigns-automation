'use client';

import type { ValidationStatus } from '@/features/core/ui/types/uiStateType';
import { Button } from '@/components/elements/generic/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/elements/generic/Card';
import { Input } from '@/components/elements/generic/Input';
import { Label } from '@/components/elements/generic/Label';
import { Separator } from '@/components/elements/generic/Separator';

type SettingsCredentialsCardProps = {
  leonardoApiKeyInput: string;
  dropboxAccessTokenInput: string;
  leonardoValidationStatus: ValidationStatus;
  dropboxValidationStatus: ValidationStatus;
  leonardoValidationMessage: string | null;
  dropboxValidationMessage: string | null;
  canTestLeonardo: boolean;
  canTestDropbox: boolean;
  canSaveCredentials: boolean;
  showBackToApp: boolean;
  onLeonardoApiKeyInputChange: (value: string) => void;
  onDropboxAccessTokenInputChange: (value: string) => void;
  onTestLeonardo: () => void;
  onTestDropbox: () => void;
  onBackToApp: () => void;
  onSaveCredentials: () => void;
};

export function SettingsCredentialsCard({
  leonardoApiKeyInput,
  dropboxAccessTokenInput,
  leonardoValidationStatus,
  dropboxValidationStatus,
  leonardoValidationMessage,
  dropboxValidationMessage,
  canTestLeonardo,
  canTestDropbox,
  canSaveCredentials,
  showBackToApp,
  onLeonardoApiKeyInputChange,
  onDropboxAccessTokenInputChange,
  onTestLeonardo,
  onTestDropbox,
  onBackToApp,
  onSaveCredentials,
}: SettingsCredentialsCardProps) {
  return (
    <>
      <Card className="border-none shadow-xl lg:border">
        <CardHeader className="pb-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">System Credentials</CardTitle>
              <CardDescription className="mt-1 text-sm">
                Configure Leonardo image generation and Dropbox output persistence.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <Separator className="opacity-50" />

        <CardContent className="space-y-8 pt-8">
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="api-key" className="text-sm font-bold uppercase tracking-wider text-primary">
                Leonardo API Key
              </Label>
              <p className="text-xs text-muted-foreground">
                Get your key:{' '}
                <a
                  href="https://app.leonardo.ai/api-access"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline transition-colors hover:text-primary"
                >
                  Leonardo API Access
                </a>
              </p>
            </div>

            <div className="flex gap-3">
              <Input
                id="api-key"
                type="password"
                value={leonardoApiKeyInput}
                onChange={(event) => onLeonardoApiKeyInputChange(event.target.value)}
                placeholder="Enter your Leonardo API key"
                className="font-mono text-sm"
              />
              <Button
                variant="secondary"
                size="sm"
                className="px-6 text-[10px] font-bold uppercase tracking-widest"
                disabled={!canTestLeonardo}
                onClick={onTestLeonardo}
              >
                {leonardoValidationStatus === 'pending' ? 'Testing...' : 'Test'}
              </Button>
            </div>
            {leonardoValidationStatus === 'success' && (
              <p className="animate-in slide-in-from-top-1 fade-in text-xs font-bold text-green-600">
                Leonardo connection successful
              </p>
            )}
            {leonardoValidationStatus === 'error' && leonardoValidationMessage && (
              <p className="animate-in slide-in-from-top-1 fade-in text-xs font-bold text-destructive">
                Leonardo connection failed. Reason: {leonardoValidationMessage}
              </p>
            )}
          </div>

          <Separator className="opacity-30" />

          <div className="space-y-4 text-left">
            <div className="space-y-1">
              <Label htmlFor="dropbox-token" className="text-sm font-bold uppercase tracking-wider text-primary">
                Dropbox Access Token
              </Label>
              <p className="text-xs text-muted-foreground">
                Generate token:{' '}
                <a
                  href="https://www.dropbox.com/developers/apps"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline transition-colors hover:text-primary"
                >
                  Dropbox Developers
                </a>
              </p>
            </div>

            <div className="flex gap-3">
              <Input
                id="dropbox-token"
                type="password"
                value={dropboxAccessTokenInput}
                onChange={(event) => onDropboxAccessTokenInputChange(event.target.value)}
                placeholder="Enter your Dropbox access token"
                className="font-mono text-sm"
              />
              <Button
                variant="secondary"
                size="sm"
                className="px-6 text-[10px] font-bold uppercase tracking-widest"
                disabled={!canTestDropbox}
                onClick={onTestDropbox}
              >
                {dropboxValidationStatus === 'pending' ? 'Testing...' : 'Test'}
              </Button>
            </div>
            {dropboxValidationStatus === 'success' && (
              <p className="animate-in slide-in-from-top-1 fade-in text-xs font-bold text-green-600">
                Dropbox linked successfully
              </p>
            )}
            {dropboxValidationStatus === 'error' && dropboxValidationMessage && (
              <p className="animate-in slide-in-from-top-1 fade-in text-xs font-bold text-destructive">
                Dropbox link failed. Reason: {dropboxValidationMessage}
              </p>
            )}
          </div>
        </CardContent>

        <Separator className="opacity-50" />

        <CardContent className="flex items-center justify-end gap-3 bg-muted/20 py-6">
          {showBackToApp && (
            <Button
              variant="ghost"
              className="text-xs font-bold uppercase tracking-widest"
              onClick={onBackToApp}
            >
              Back to App
            </Button>
          )}
          <Button
            size="lg"
            className="px-10 font-bold uppercase tracking-widest"
            onClick={onSaveCredentials}
            disabled={!canSaveCredentials}
          >
            Save Credentials
          </Button>
        </CardContent>
      </Card>

      <footer className="mt-8 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-40">
        Secure Credential Management Engine v1.0
      </footer>
    </>
  );
}
