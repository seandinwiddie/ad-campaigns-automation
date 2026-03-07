import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from '../components/elements/generic/Heading';

const meta: Meta<typeof Heading> = {
    title: 'Generic/Heading',
    component: Heading,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = {
    args: {
        children: 'Heading 1',
        variant: 'h1',
    },
};

export const H2: Story = {
    args: {
        children: 'Heading 2',
        variant: 'h2',
    },
};

export const H3: Story = {
    args: {
        children: 'Heading 3',
        variant: 'h3',
    },
};
