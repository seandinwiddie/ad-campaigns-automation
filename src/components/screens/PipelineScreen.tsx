'use client';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  selectPipelineStatus,
  selectPipelineError,
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
  const fatalError = useAppSelector(selectPipelineError);
  const errors = useAppSelector(selectPipelineErrors);
  const hasCredentialIssue =
    typeof fatalError === 'string' &&
    (fatalError.toLowerCase().includes('api key') || fatalError.toLowerCase().includes('dropbox'));

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
          {fatalError && (
            <AlertDescription>
              <CardDescription className="m-0 mt-2 font-medium text-destructive">
                Reason: {fatalError}
              </CardDescription>
            </AlertDescription>
          )}
          {errors.length > 0 && (
            <AlertDescription>
              {errors.map((err, i) => (
                <CardDescription key={i} className="m-0 mt-2">
                  {err.productName} ({err.step}): {err.message}
                </CardDescription>
              ))}
            </AlertDescription>
          )}
          <div className="mt-3 flex gap-2">
            {hasCredentialIssue && (
              <Button
                variant="default"
                onClick={() => dispatch(setCurrentPage('settings'))}
              >
                Open Settings
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => dispatch(setCurrentPage('home'))}
            >
              Back to Brief
            </Button>
          </div>
        </Alert>
      )}
    </Card>
  );
}
