import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '../components/elements/generic/Textarea';

const meta: Meta<typeof Textarea> = {
    title: 'Generic/Textarea',
    component: Textarea,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
    args: {
        placeholder: 'Type your message here.',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        placeholder: 'Disabled textarea',
    },
};
