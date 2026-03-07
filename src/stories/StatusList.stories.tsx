import type { Meta, StoryObj } from '@storybook/react';
import { StatusList, StatusListItem } from '../components/elements/generic/StatusList';

const meta: Meta<typeof StatusList> = {
    title: 'Generic/StatusList',
    component: StatusList,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof StatusList> = {
    render: () => (
        <StatusList className="w-[300px]">
            <StatusListItem status="complete" label="Validate Campaign Brief" description="Brief parsed successfully" />
            <StatusListItem status="running" label="Resolve Assets" description="Fetching SolarCharger assets..." isHighlighted />
            <StatusListItem status="idle" label="Compose Creatives" description="Waiting for image resolution" />
            <StatusListItem status="idle" label="Analyze Compliance" description="Legal and brand checks" />
        </StatusList>
    ),
};

export const ErrorState: StoryObj<typeof StatusList> = {
    render: () => (
        <StatusList className="w-[300px]">
            <StatusListItem status="complete" label="Validate Campaign Brief" />
            <StatusListItem status="error" label="Generate Hero Image" description="GenAI API quota exceeded" isHighlighted />
        </StatusList>
    ),
};
