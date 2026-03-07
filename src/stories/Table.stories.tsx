import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/elements/generic/Table';

const meta: Meta<typeof Table> = {
    title: 'Generic/Table',
    component: Table,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof Table> = {
    render: () => (
        <Table className="w-[500px]">
            <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Format</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>EcoBottle</TableCell>
                    <TableCell>Complete</TableCell>
                    <TableCell>1:1</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>SolarCharger</TableCell>
                    <TableCell>Processing</TableCell>
                    <TableCell>9:16</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
};
