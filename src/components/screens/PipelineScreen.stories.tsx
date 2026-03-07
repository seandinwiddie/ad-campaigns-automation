import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import type { RootState } from '@/app/rootReducer';
import { createAppStorybookState, withAppState } from '@/test-support/storybook/withAppState';
import { PipelineScreen } from './PipelineScreen';

const buildState = (overrides: Partial<RootState>): Partial<RootState> => ({
  ...createAppStorybookState(),
  ...overrides,
});

const meta: Meta<typeof PipelineScreen> = {
  title: 'Screens/PipelineScreen',
  component: PipelineScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withAppState],
};

export default meta;
type Story = StoryObj<{ mockState: Partial<RootState> }>;

export const InProgress: Story = {
  args: {
    mockState: buildState({
      ui: {
        ...createAppStorybookState().ui,
        currentPage: 'pipeline',
        elapsedSeconds: 83,
      },
      pipeline: {
        status: 'generating',
        startTime: Date.now() - 83000,
        endTime: null,
        products: {
          EcoBottle: { productId: 'EcoBottle', status: 'completed' },
          SolarCharger: { productId: 'SolarCharger', status: 'in_progress' },
        },
        metrics: null,
        error: null,
        errors: [],
        currentProduct: 'SolarCharger',
        progressPct: 50,
        failedProducts: [],
        productStatuses: {
          EcoBottle: 'completed',
          SolarCharger: 'in_progress',
        },
      },
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Generating creatives...')).toBeInTheDocument();
    await expect(canvas.getByText('Currently processing: SolarCharger')).toBeInTheDocument();
    await expect(canvas.getByText('50% complete')).toBeInTheDocument();
    await expect(canvas.getByText('Processing')).toBeInTheDocument();
  },
};

export const CredentialError: Story = {
  args: {
    mockState: buildState({
      ui: {
        ...createAppStorybookState().ui,
        currentPage: 'pipeline',
      },
      pipeline: {
        status: 'error',
        startTime: Date.now() - 12000,
        endTime: null,
        products: {
          EcoBottle: { productId: 'EcoBottle', status: 'failed', error: 'Dropbox access token not configured' },
        },
        metrics: null,
        error: 'Dropbox access token not configured',
        errors: [
          {
            productName: 'EcoBottle',
            step: 'processing',
            message: 'Dropbox access token not configured',
          },
        ],
        currentProduct: null,
        progressPct: 0,
        failedProducts: ['EcoBottle'],
        productStatuses: {
          EcoBottle: 'failed',
        },
      },
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Pipeline encountered errors.')).toBeInTheDocument();
    await expect(canvas.getByText('Reason: Dropbox access token not configured')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Open Settings' })).toBeInTheDocument();
  },
};

export const Completed: Story = {
  args: {
    mockState: buildState({
      ui: {
        ...createAppStorybookState().ui,
        currentPage: 'pipeline',
      },
      pipeline: {
        status: 'complete',
        startTime: Date.now() - 65000,
        endTime: Date.now(),
        products: {
          EcoBottle: { productId: 'EcoBottle', status: 'completed' },
          SolarCharger: { productId: 'SolarCharger', status: 'completed' },
        },
        metrics: {
          timeSavedSeconds: 5300,
          campaignsGenerated: 6,
          efficiencyGain: 49.85,
          successCount: 2,
          totalProducts: 2,
        },
        error: null,
        errors: [],
        currentProduct: null,
        progressPct: 100,
        failedProducts: [],
        productStatuses: {
          EcoBottle: 'completed',
          SolarCharger: 'completed',
        },
      },
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Pipeline complete! All creatives have been generated.')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'View Results' })).toBeInTheDocument();
  },
};
