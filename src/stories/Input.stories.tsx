import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../components/elements/generic/Input';

const meta: Meta<typeof Input> = {
    title: 'Generic/Input',
    component: Input,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        type: 'text',
        placeholder: 'Enter text...',
    },
};

export const Password: Story = {
    args: {
        type: 'password',
        placeholder: 'Enter password...',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        placeholder: 'Disabled input',
    },
};
