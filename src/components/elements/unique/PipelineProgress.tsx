'use client';

import { useAppSelector } from '@/app/hooks';
import {
  selectPipelineStatus,
  selectProgress,
  selectCurrentProduct,
  selectProductStatuses,
} from '@/features/pipeline/slice/pipelineSelectors';
import { selectElapsedSeconds } from '@/features/core/ui/slice/uiSelectors';
import { Progress } from '@/components/elements/generic/Progress';
import { Badge } from '@/components/elements/generic/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/elements/generic/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/elements/generic/Table';

const STATUS_LABELS: Record<string, string> = {
  idle: 'Idle',
  validating: 'Validating brief...',
  resolving: 'Resolving assets...',
  generating: 'Generating creatives...',
  composing: 'Composing outputs...',
  complete: 'Complete',
  error: 'Error',
};

const PRODUCT_BADGE_VARIANT: Record<string, 'default' | 'secondary' | 'destructive'> = {
  pending: 'default',
  in_progress: 'secondary',
  completed: 'default',
  failed: 'destructive',
};

const PRODUCT_BADGE_LABEL: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'Processing',
  completed: 'Completed',
  failed: 'Failed',
};

export function PipelineProgress() {
  const status = useAppSelector(selectPipelineStatus);
  const progress = useAppSelector(selectProgress);
  const currentProduct = useAppSelector(selectCurrentProduct);
  const productStatuses = useAppSelector(selectProductStatuses);
  const elapsed = useAppSelector(selectElapsedSeconds);

  const formatElapsed = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{STATUS_LABELS[status] ?? status}</CardTitle>
        <CardDescription>
          {currentProduct ? `Currently processing: ${currentProduct}` : `Elapsed: ${formatElapsed(elapsed)}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} />
        <CardDescription>{progress}% complete</CardDescription>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(productStatuses).map(([name, pStatus]) => (
              <TableRow key={name}>
                <TableCell>{name}</TableCell>
                <TableCell>
                  <Badge variant={PRODUCT_BADGE_VARIANT[pStatus] ?? 'default'}>
                    {PRODUCT_BADGE_LABEL[pStatus] ?? pStatus}
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
