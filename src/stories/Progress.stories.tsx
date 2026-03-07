import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '../components/elements/generic/Progress';

const meta: Meta<typeof Progress> = {
    title: 'Generic/Progress',
    component: Progress,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
    args: {
        value: 33,
        className: "w-[300px]"
    },
};

export const Full: Story = {
    args: {
        value: 100,
        className: "w-[300px]"
    },
};
