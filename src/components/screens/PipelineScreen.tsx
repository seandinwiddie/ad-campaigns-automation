'use client';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  selectPipelineStatus,
  selectPipelineErrors,
} from '@/features/pipeline/slice/pipelineSelectors';
import { setCurrentPage } from '@/features/core/ui/slice/uiActions';
import { Button } from '@/components/elements/generic/Button';
import { Alert, AlertTitle, AlertDescription } from '@/components/elements/generic/Alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/elements/generic/Card';
import { PipelineProgress } from '@/components/elements/unique/PipelineProgress';

export function PipelineScreen() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectPipelineStatus);
  const errors = useAppSelector(selectPipelineErrors);

  return (
    <Card className="mx-auto mt-8 max-w-4xl">
      <CardHeader>
        <CardTitle>Pipeline Execution</CardTitle>
        <CardDescription>Generating ad creatives for your campaign.</CardDescription>
      </CardHeader>
      <CardContent>
      <PipelineProgress />
      </CardContent>

      {status === 'complete' && (
        <Alert className="mt-8">
          <AlertTitle>
            Pipeline complete! All creatives have been generated.
          </AlertTitle>
          <AlertDescription>
          <Button
            onClick={() => dispatch(setCurrentPage('results'))}
            className="mt-3"
          >
            View Results
          </Button>
          </AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Alert variant="destructive" className="mt-8">
          <AlertTitle>Pipeline encountered errors.</AlertTitle>
          {errors.length > 0 && (
            <AlertDescription>
              {errors.map((err, i) => (
                <CardDescription key={i} className="m-0 mt-2">
                  {err.productName} ({err.step}): {err.message}
                </CardDescription>
              ))}
            </AlertDescription>
          )}
          <Button
            variant="outline"
            onClick={() => dispatch(setCurrentPage('home'))}
            className="mt-3"
          >
            Back to Brief
          </Button>
        </Alert>
      )}
    </Card>
  );
}
