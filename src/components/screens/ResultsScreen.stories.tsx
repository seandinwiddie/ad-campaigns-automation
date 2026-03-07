import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import type { RootState } from '@/app/rootReducer';
import { createAppStorybookState, withAppState } from '@/test-support/storybook/withAppState';
import { ResultsScreen } from './ResultsScreen';

const IMAGE_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDYwMCA2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiMwMEE4NkIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI0ZGRkZGRiIgZm9udC1zaXplPSI2NCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QWQgQ3JlYXRpdmU8L3RleHQ+PC9zdmc+';

const buildState = (overrides: Partial<RootState>): Partial<RootState> => ({
  ...createAppStorybookState(),
  ...overrides,
});

const meta: Meta<typeof ResultsScreen> = {
  title: 'Screens/ResultsScreen',
  component: ResultsScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withAppState],
};

export default meta;
type Story = StoryObj<{ mockState: Partial<RootState> }>;

export const Populated: Story = {
  args: {
    mockState: buildState({
      ui: {
        ...createAppStorybookState().ui,
        currentPage: 'results',
      },
      creative: {
        creatives: {
          'eco-bottle_1:1': {
            id: 'eco-bottle_1:1',
            productId: 'EcoBottle',
            aspectRatio: '1:1',
            status: 'completed',
            outputUrl: IMAGE_DATA_URL,
          },
          'eco-bottle_9:16': {
            id: 'eco-bottle_9:16',
            productId: 'EcoBottle',
            aspectRatio: '9:16',
            status: 'completed',
            outputUrl: IMAGE_DATA_URL,
          },
          'solar-charger_16:9': {
            id: 'solar-charger_16:9',
            productId: 'SolarCharger',
            aspectRatio: '16:9',
            status: 'failed',
            error: 'Dropbox upload failed',
          },
        },
        completedCount: 3,
        totalCount: 3,
        progressPct: 100,
      },
      compliance: {
        brandColors: ['#00A86B', '#FFFFFF'],
        prohibitedWords: ['free'],
        issues: [],
        reports: {
          EcoBottle: {
            productName: 'EcoBottle',
            colorCompliance: true,
            detectedColors: ['#00A86B', '#FFFFFF'],
            prohibitedWordsFound: [],
            isCompliant: true,
          },
          SolarCharger: {
            productName: 'SolarCharger',
            colorCompliance: false,
            detectedColors: ['#FF8800'],
            prohibitedWordsFound: ['free'],
            isCompliant: false,
          },
        },
      },
      pipeline: {
        status: 'complete',
        startTime: Date.now() - 64000,
        endTime: Date.now(),
        products: {
          EcoBottle: { productId: 'EcoBottle', status: 'completed' },
          SolarCharger: { productId: 'SolarCharger', status: 'failed', error: 'Dropbox upload failed' },
        },
        metrics: {
          timeSavedSeconds: 5312,
          campaignsGenerated: 3,
          efficiencyGain: 42.11,
          successCount: 1,
          totalProducts: 2,
        },
        error: null,
        errors: [
          {
            productName: 'SolarCharger',
            step: 'upload',
            message: 'Dropbox upload failed',
          },
        ],
        currentProduct: null,
        progressPct: 100,
        failedProducts: ['SolarCharger'],
        productStatuses: {
          EcoBottle: 'completed',
          SolarCharger: 'failed',
        },
      },
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Campaign Results')).toBeInTheDocument();
    await expect(canvas.getByText('Generated Asset Gallery')).toBeInTheDocument();
    await expect(canvas.getByText('Compliance & Quality Audit')).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { name: 'EcoBottle' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Process New Brief' })).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: {
    mockState: buildState({
      ui: {
        ...createAppStorybookState().ui,
        currentPage: 'results',
      },
      pipeline: {
        ...createAppStorybookState().pipeline,
        status: 'complete',
        metrics: {
          timeSavedSeconds: 0,
          campaignsGenerated: 0,
          efficiencyGain: 0,
          successCount: 0,
          totalProducts: 0,
        },
      },
    }),
  },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('No campaign assets generated yet.')).toBeInTheDocument();
    await expect(canvas.getByText('No compliance reports available.')).toBeInTheDocument();
  },
};
