import type { Meta, StoryObj } from '@storybook/react';
import { ImageCard } from '../components/elements/generic/ImageCard';

const meta: Meta<typeof ImageCard> = {
    title: 'Generic/ImageCard',
    component: ImageCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ImageCard>;

export const Default: Story = {
    args: {
        src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=3540&ixlib=rb-4.0.3',
        alt: 'Example AI generated technology component',
        title: 'Solar Charger V2',
        badgeText: 'Generated',
    },
};

export const NoImage: Story = {
    args: {
        src: '',
        alt: 'No image',
        title: 'Loading Product...',
        badgeText: 'Processing',
        badgeVariant: 'secondary',
    },
};
