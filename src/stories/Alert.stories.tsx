import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from '../components/elements/generic/Alert';

const meta: Meta<typeof Alert> = {
    title: 'Generic/Alert',
    component: Alert,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof Alert> = {
    render: () => (
        <Alert className="w-[400px]">
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
                You can add components to your app using the cli.
            </AlertDescription>
        </Alert>
    ),
};

export const Destructive: StoryObj<typeof Alert> = {
    render: () => (
        <Alert variant="destructive" className="w-[400px]">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                Your session has expired. Please log in again.
            </AlertDescription>
        </Alert>
    ),
};
