import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { OutputGallery } from './OutputGallery';
import { getCreativeOutputPath } from '@/features/creative/slice/creativeSlice';
import type { Creative } from '@/features/creative/types/creativeType';
import type { CreativeState } from '@/features/creative/types/creativeStateType';
import { sampleStoryProducts } from '@/stories/fixtures/sampleCampaign';

const mockCreativeSlice = createSlice({
  name: 'creative',
  initialState: {
    creatives: {},
    completedCount: 0,
    totalCount: 0,
    progressPct: 0,
  },
  reducers: {
    setCreatives: (state, action) => {
      state.creatives = action.payload;
    },
  },
});

const createMockStore = (initialState: CreativeState) =>
  configureStore({
    reducer: {
      creative: mockCreativeSlice.reducer,
    },
    preloadedState: {
      creative: initialState,
    },
  });

const primaryProduct = sampleStoryProducts[0];
if (!primaryProduct) {
  throw new Error('Story fixtures require at least one sample product.');
}

const secondaryProduct = sampleStoryProducts[1] ?? primaryProduct;

const createCreative = (creative: Creative): Creative => creative;

const createCreativeState = (creatives: Creative[]): CreativeState => ({
  creatives: Object.fromEntries(creatives.map((creative) => [creative.id, creative])),
  completedCount: creatives.filter((creative) => creative.status !== 'pending').length,
  totalCount: creatives.length,
  progressPct:
    creatives.length === 0
      ? 0
      : Math.round((creatives.filter((creative) => creative.status !== 'pending').length / creatives.length) * 100),
});

const meta = {
  title: 'Features/Creative Pipeline/OutputGallery',
  component: OutputGallery,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const store = createMockStore(context.args.mockState);
      return (
        <Provider store={store}>
          <div className="w-[800px] max-w-full">
            <Story />
          </div>
        </Provider>
      );
    },
  ],
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<{ mockState: any }>;

export const Empty: Story = {
  args: {
    mockState: createCreativeState([]),
  },
};

export const Pending: Story = {
  args: {
    mockState: createCreativeState([
      createCreative({
        id: `${primaryProduct.id}_9:16`,
        productId: primaryProduct.name,
        aspectRatio: '9:16',
        status: 'pending',
      }),
    ]),
  },
};

export const Success: Story = {
  args: {
    mockState: createCreativeState([
      createCreative({
        id: `${primaryProduct.id}_9:16`,
        productId: primaryProduct.name,
        aspectRatio: '9:16',
        status: 'completed',
        outputUrl: 'https://picsum.photos/400/700',
        storageMode: 'dropbox',
      }),
      createCreative({
        id: `${secondaryProduct.id}_1:1`,
        productId: secondaryProduct.name,
        aspectRatio: '1:1',
        status: 'completed',
        outputUrl: 'https://picsum.photos/500/500',
        storageMode: 'dropbox',
      }),
    ]),
  },
};

export const DownloadOnly: Story = {
  args: {
    mockState: createCreativeState([
      createCreative({
        id: `${primaryProduct.id}_9:16`,
        productId: primaryProduct.name,
        aspectRatio: '9:16',
        status: 'completed',
        outputUrl: 'https://picsum.photos/400/700',
        outputPath: getCreativeOutputPath(primaryProduct.name, '9x16'),
        storageMode: 'download',
        storageError: 'Dropbox token not configured. Download this PNG directly from Results.',
      }),
    ]),
  },
};

export const InvalidCredentialsError: Story = {
  args: {
    mockState: createCreativeState([
      createCreative({
        id: `${primaryProduct.id}_9:16`,
        productId: primaryProduct.name,
        aspectRatio: '9:16',
        status: 'failed',
        error: 'API key not valid. Please pass a valid API key.',
      }),
    ]),
  },
};
