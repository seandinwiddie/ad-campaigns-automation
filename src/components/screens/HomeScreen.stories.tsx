import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { MotionConfig } from 'framer-motion';
import { HomeScreen } from './HomeScreen';
import { uiSlice } from '@/features/core/ui/slice/uiSlice';
import { settingsSlice } from '@/features/core/settings/slice/settingsSlice';
import { briefSlice } from '@/features/brief/slice/briefSlice';
import { sampleStoryBrief } from '@/stories/fixtures/sampleCampaign';

const rootReducer = combineReducers({
  ui: uiSlice.reducer,
  settings: settingsSlice.reducer,
  brief: briefSlice.reducer,
});

const createMockStore = (preloadedState?: any) => {
  return configureStore({
    reducer: rootReducer as any,
    preloadedState: preloadedState as any,
  });
};

const baseUiState = {
  isLoading: false,
  activeModal: null,
  currentPage: 'home',
  briefRawText: JSON.stringify(sampleStoryBrief, null, 2),
  apiKeyInput: '',
  openAiApiKeyInput: '',
  dropboxAccessTokenInput: '',
  elapsedSeconds: 0,
};

type MockStateOptions = {
  apiKey?: string;
  openAiApiKey?: string;
  dropboxAccessToken?: string;
};

const createMockState = ({
  apiKey = '',
  openAiApiKey = '',
  dropboxAccessToken = '',
}: MockStateOptions = {}) => ({
  ui: {
    ...baseUiState,
    apiKeyInput: apiKey,
    openAiApiKeyInput: openAiApiKey,
    dropboxAccessTokenInput: dropboxAccessToken,
  },
  settings: {
    apiKey,
    openAiApiKey,
    dropboxAccessToken,
  },
  brief: {
    brief: sampleStoryBrief,
    isValid: true,
    validationErrors: [],
    loading: false,
    error: null,
  },
});

const meta: Meta<typeof HomeScreen> = {
  title: 'Screens/HomeScreen',
  component: HomeScreen,
  decorators: [
    (Story, context) => {
      const store = createMockStore((context.args as any).mockState);
      return (
        <MotionConfig reducedMotion="always">
          <Provider store={store}>
            <Story />
          </Provider>
        </MotionConfig>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<{ mockState: any }>;

export const NoKeys: Story = {
  args: {
    mockState: createMockState(),
  },
  parameters: {
    docs: {
      description: {
        story: 'App works without any API keys. Pollinations provides free image generation fallback.',
      },
    },
  },
};

export const ReadyToRun: Story = {
  args: {
    mockState: createMockState({ openAiApiKey: 'openai-key' }),
  },
};

export const ReadyToRunWithDropbox: Story = {
  args: {
    mockState: createMockState({ apiKey: 'gemini-key', dropboxAccessToken: 'dropbox-token' }),
  },
};
