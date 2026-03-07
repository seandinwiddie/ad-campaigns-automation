import type { Meta, StoryObj } from '@storybook/react';
import type { RootState } from '@/app/rootReducer';
import { createAppStorybookState, withAppState } from '@/test-support/storybook/withAppState';
import { SettingsScreen } from './SettingsScreen';

const buildState = (overrides: Partial<RootState>): Partial<RootState> => ({
  ...createAppStorybookState(),
  ...overrides,
});

const meta: Meta<typeof SettingsScreen> = {
  title: 'Screens/SettingsScreen',
  component: SettingsScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [withAppState],
};

export default meta;
type Story = StoryObj<{ mockState: Partial<RootState> }>;

export const Default: Story = {
  args: {
    mockState: buildState({
      ui: {
        ...createAppStorybookState().ui,
        currentPage: 'settings',
      },
    }),
  },
};

export const WithInputs: Story = {
  args: {
    mockState: buildState({
      ui: {
        ...createAppStorybookState().ui,
        currentPage: 'settings',
        leonardoApiKeyInput: 'mock-leonardo-key',
        dropboxAccessTokenInput: 'mock-dropbox-token',
      },
    }),
  },
};
