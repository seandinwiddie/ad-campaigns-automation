'use client';

import { useAppSelector } from '@/app/hooks';
import { selectPipelineProgressViewModel } from '@/features/pipeline/slice/pipelineSelectors';
import { Progress } from '@/components/elements/generic/Progress';
import { Badge } from '@/components/elements/generic/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/elements/generic/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/elements/generic/Table';

/**
 * PipelineProgress renders the granular processing status of the campaign.
 * It includes an overall progress bar and a detailed table of product-specific statuses.
 * 
 * **User Story:**
 * - As a user, I want to see exactly which products are currently being processed
 *   and how far along the overall pipeline is.
 */
export function PipelineProgress() {
  const progressViewModel = useAppSelector(selectPipelineProgressViewModel);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{progressViewModel.title}</CardTitle>
        <CardDescription>{progressViewModel.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progressViewModel.progress} />
        <CardDescription>{progressViewModel.progress}% complete</CardDescription>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {progressViewModel.products.map((product) => (
              <TableRow key={product.productName}>
                <TableCell>{product.productName}</TableCell>
                <TableCell>
                  <Badge variant={product.badgeVariant}>
                    {product.statusLabel}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
