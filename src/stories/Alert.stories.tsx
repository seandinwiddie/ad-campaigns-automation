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

/**
 * Default scenario for general information.
 */
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

/**
 * User Story: Notifying the user of a critical error or destructive action.
 */
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

/**
 * User Story: Form validation success message.
 */
export const SuccessNotification: StoryObj<typeof Alert> = {
    name: 'Success Notification (User Story)',
    render: () => (
        <Alert className="w-[400px] border-green-500 bg-green-50 text-green-800">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
                Your campaign has been successfully launched.
            </AlertDescription>
        </Alert>
    ),
};
