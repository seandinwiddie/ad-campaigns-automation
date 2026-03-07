import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '../components/elements/generic/Text';

const meta: Meta<typeof Text> = {
    title: 'Generic/Text',
    component: Text,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Body: Story = {
    args: {
        children: 'The quick brown fox jumps over the lazy dog.',
        variant: 'body',
    },
};

export const Muted: Story = {
    args: {
        children: 'Muted text for secondary information.',
        variant: 'muted',
    },
};

export const Mono: Story = {
    args: {
        children: 'npm install @reduxjs/toolkit',
        variant: 'mono',
    },
};

export const Bold: Story = {
    args: {
        children: 'Bold text for emphasis.',
        variant: 'bold',
    },
};
