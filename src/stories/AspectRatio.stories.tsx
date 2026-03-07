import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from '../components/elements/generic/AspectRatio';

const meta: Meta<typeof AspectRatio> = {
    title: 'Generic/AspectRatio',
    component: AspectRatio,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

export const Ratio16_9: StoryObj<typeof AspectRatio> = {
    render: () => (
        <div className="w-[450px]">
            <AspectRatio ratio={16 / 9} className="bg-muted">
                <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                    16:9 Aspect Ratio
                </div>
            </AspectRatio>
        </div>
    ),
};

export const Ratio1_1: StoryObj<typeof AspectRatio> = {
    render: () => (
        <div className="w-[300px]">
            <AspectRatio ratio={1 / 1} className="bg-muted">
                <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                    1:1 Aspect Ratio
                </div>
            </AspectRatio>
        </div>
    ),
};

export const Ratio9_16: StoryObj<typeof AspectRatio> = {
    render: () => (
        <div className="w-[200px]">
            <AspectRatio ratio={9 / 16} className="bg-muted">
                <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                    9:16 Aspect Ratio
                </div>
            </AspectRatio>
        </div>
    ),
};
