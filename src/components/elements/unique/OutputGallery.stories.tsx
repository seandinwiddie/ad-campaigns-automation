import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { OutputGallery } from './OutputGallery';

const mockCreativeSlice = createSlice({
    name: 'creative',
    initialState: {
        items: {},
    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload;
        },
    },
});

const createMockStore = (initialState: any) =>
    configureStore({
        reducer: {
            creative: mockCreativeSlice.reducer,
        },
        preloadedState: {
            creative: initialState,
        },
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
        mockState: { items: {} } as any,
    },
};

export const Pending: Story = {
    args: {
        mockState: {
            items: {
                'creative-1': {
                    id: 'creative-1',
                    productId: 'EcoBottle',
                    format: 'Instagram Story',
                    aspectRatio: '9:16',
                    status: 'pending',
                    outputUrl: null,
                    error: null,
                },
            },
        } as any,
    },
};

export const Success: Story = {
    args: {
        mockState: {
            items: {
                'creative-1': {
                    id: 'creative-1',
                    productId: 'EcoBottle',
                    format: 'Instagram Story',
                    aspectRatio: '9:16',
                    status: 'completed',
                    outputUrl: 'https://picsum.photos/400/700',
                    error: null,
                },
                'creative-2': {
                    id: 'creative-2',
                    productId: 'EcoBottle',
                    format: 'Instagram Post',
                    aspectRatio: '1:1',
                    status: 'completed',
                    outputUrl: 'https://picsum.photos/500/500',
                    error: null,
                },
            },
        } as any,
    },
};

export const InvalidCredentialsError: Story = {
    args: {
        mockState: {
            items: {
                'creative-1': {
                    id: 'creative-1',
                    productId: 'EcoBottle',
                    format: 'Instagram Story',
                    aspectRatio: '9:16',
                    status: 'failed',
                    outputUrl: null,
                    error: 'API key not valid. Please pass a valid API key.',
                },
            },
        } as any,
    },
};
