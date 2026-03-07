import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import type { RootState } from '@/app/rootReducer';
import { createAppStorybookState, withAppState } from '@/test-support/storybook/withAppState';
import { HomeScreen } from './HomeScreen';

const buildState = (overrides: Partial<RootState>): Partial<RootState> => ({
  ...createAppStorybookState(),
  ...overrides,
});

const meta: Meta<typeof HomeScreen> = {
  title: 'Screens/HomeScreen',
  component: HomeScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withAppState],
};

export default meta;
type Story = StoryObj<{ mockState: Partial<RootState> }>;

export const AwaitingBrief: Story = {
  args: {
    mockState: buildState({
      ui: {
        ...createAppStorybookState().ui,
        currentPage: 'home',
      },
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Run Pipeline' })).toBeDisabled();
    await expect(canvas.getByText('Please validate your brief to continue.')).toBeInTheDocument();
  },
};

export const BriefValidated: Story = {
  args: {
    mockState: buildState({
      ui: {
        ...createAppStorybookState().ui,
        currentPage: 'home',
        briefRawText: '{"campaignName":"Summer Eco Campaign 2025"}',
      },
      brief: {
        brief: {
          campaignName: 'Summer Eco Campaign 2025',
          products: [
            {
              id: 'eco-bottle',
              name: 'EcoBottle',
              description: 'Reusable bottle made from ocean plastic',
            },
            {
              id: 'solar-charger',
              name: 'SolarCharger',
              description: 'Portable charger for outdoor adventures',
            },
          ],
          targetRegion: 'United States',
          targetAudience: 'Eco-conscious commuters',
          campaignMessage: 'Stay Green, Live Clean',
          brandGuidelines: {
            colors: ['#00A86B', '#FFFFFF'],
            prohibitedWords: ['free'],
          },
        },
        isValid: true,
        validationErrors: [],
        loading: false,
        error: null,
      },
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Brief Validated')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Run Pipeline for 2 Products' })).toBeEnabled();
  },
};
