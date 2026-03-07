import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { SettingsScreen } from './SettingsScreen';
import { uiSlice } from '@/features/core/ui/slice/uiSlice';
import { settingsSlice } from '@/features/core/settings/slice/settingsSlice';
import { apiSlice } from '@/features/core/api/slice/apiSlice';

const rootReducer = combineReducers({
    ui: uiSlice.reducer,
    settings: settingsSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
});

const createMockStore = (preloadedState?: any) => {
    return configureStore({
        reducer: rootReducer as any,
        preloadedState: preloadedState as any,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }).concat(apiSlice.middleware) as any,
    });
};

const meta: Meta<typeof SettingsScreen> = {
    title: 'Screens/SettingsScreen',
    component: SettingsScreen,
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story, context) => {
            const mockState = (context.args as any).mockState;
            const store = createMockStore(mockState);
            return (
                <Provider store={store}>
                    <Story />
                </Provider>
            );
        },
    ],
};

export default meta;
type Story = StoryObj<{ mockState: any }>;

export const Default: Story = {
    args: {
        mockState: {
            ui: {
                currentPage: 'settings',
                apiKeyInput: '',
                dropboxAccessTokenInput: '',
                pipelineElapsedTimeSeconds: 0,
            },
            settings: {
                apiKey: '',
                dropboxAccessToken: '',
            },
        },
    },
};

export const WithInputs: Story = {
    args: {
        mockState: {
            ui: {
                currentPage: 'settings',
                apiKeyInput: 'mock-gemini-key',
                dropboxAccessTokenInput: 'mock-dropbox-token',
                pipelineElapsedTimeSeconds: 0,
            },
            settings: {
                apiKey: '',
                dropboxAccessToken: '',
            },
        },
    },
};
