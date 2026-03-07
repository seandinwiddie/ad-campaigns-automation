import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from '../components/elements/generic/Separator';

const meta: Meta<typeof Separator> = {
    title: 'Generic/Separator',
    component: Separator,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

export const Horizontal: StoryObj<typeof Separator> = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <div>
                <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
                <p className="text-sm text-muted-foreground">
                    An open-source UI component library.
                </p>
            </div>
            <Separator />
            <div className="flex h-5 items-center space-x-4 text-sm">
                <div>Blog</div>
                <Separator orientation="vertical" />
                <div>Docs</div>
                <Separator orientation="vertical" />
                <div>Source</div>
            </div>
        </div>
    ),
};

export const Vertical: StoryObj<typeof Separator> = {
    render: () => (
        <div className="flex h-5 items-center space-x-4 text-sm">
            <div>Blog</div>
            <Separator orientation="vertical" />
            <div>Docs</div>
            <Separator orientation="vertical" />
            <div>Source</div>
        </div>
    ),
};
