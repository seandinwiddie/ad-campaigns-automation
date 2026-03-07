import { initializeStore } from './persistenceMiddleware';
import { setCurrentPage } from '@/features/core/ui/slice/uiActions';
import {
  setApiKey,
  setDropboxAccessToken,
  setOpenAiApiKey,
} from '@/features/core/settings/slice/settingsActions';

describe('initializeStore', () => {
  const originalEnv = {
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    NEXT_PUBLIC_DROPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_DROPBOX_ACCESS_TOKEN,
  };
  const restoreEnvVar = (name: keyof typeof originalEnv, value: string | undefined) => {
    if (typeof value === 'string') {
      process.env[name] = value;
      return;
    }
    delete process.env[name];
  };

  beforeEach(() => {
    localStorage.clear();
    delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    delete process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    delete process.env.NEXT_PUBLIC_DROPBOX_ACCESS_TOKEN;
  });

  afterAll(() => {
    restoreEnvVar('NEXT_PUBLIC_GEMINI_API_KEY', originalEnv.NEXT_PUBLIC_GEMINI_API_KEY);
    restoreEnvVar('NEXT_PUBLIC_OPENAI_API_KEY', originalEnv.NEXT_PUBLIC_OPENAI_API_KEY);
    restoreEnvVar('NEXT_PUBLIC_DROPBOX_ACCESS_TOKEN', originalEnv.NEXT_PUBLIC_DROPBOX_ACCESS_TOKEN);
  });

  it('hydrates credentials from env when localStorage is empty', () => {
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'env-gemini-key';
    process.env.NEXT_PUBLIC_OPENAI_API_KEY = 'env-openai-key';
    process.env.NEXT_PUBLIC_DROPBOX_ACCESS_TOKEN = 'env-dropbox-token';

    const dispatch = jest.fn();
    initializeStore(dispatch);

    expect(dispatch).toHaveBeenCalledWith(setApiKey('env-gemini-key'));
    expect(dispatch).toHaveBeenCalledWith(setOpenAiApiKey('env-openai-key'));
    expect(dispatch).toHaveBeenCalledWith(setDropboxAccessToken('env-dropbox-token'));
    expect(dispatch).toHaveBeenCalledWith(setCurrentPage('home'));
  });

  it('prefers localStorage values over env defaults', () => {
    process.env.NEXT_PUBLIC_OPENAI_API_KEY = 'env-openai-key';
    localStorage.setItem('ad-campaigns-openai-api-key', 'stored-openai-key');

    const dispatch = jest.fn();
    initializeStore(dispatch);

    expect(dispatch).toHaveBeenCalledWith(setOpenAiApiKey('stored-openai-key'));
    expect(dispatch).not.toHaveBeenCalledWith(setOpenAiApiKey('env-openai-key'));
  });
});
