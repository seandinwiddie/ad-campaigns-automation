import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/elements/generic/Table';
import { sampleStoryProducts } from './fixtures/sampleCampaign';

const meta: Meta<typeof Table> = {
    title: 'Generic/Table',
    component: Table,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

const storyRows = sampleStoryProducts.map((product, index) => ({
  productName: product.name,
  status: index === 0 ? 'Complete' : 'Processing',
  format: index === 0 ? '1:1' : '9:16',
}));

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
        {storyRows.map((row) => (
          <TableRow key={row.productName}>
            <TableCell>{row.productName}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>{row.format}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
