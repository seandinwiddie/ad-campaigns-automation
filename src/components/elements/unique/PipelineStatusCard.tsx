'use client';

import type { PipelineStatus } from '@/features/pipeline/types/pipelineStatusType';
import type { PipelineError } from '@/features/pipeline/types/pipelineErrorType';
import { Alert, AlertDescription, AlertTitle } from '@/components/elements/generic/Alert';
import { Button } from '@/components/elements/generic/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/elements/generic/Card';
import { PipelineProgress } from '@/components/elements/unique/PipelineProgress';

type PipelineStatusCardProps = {
  status: PipelineStatus;
  fatalError: string | null;
  errors: PipelineError[];
  hasCredentialIssue: boolean;
  onViewResults: () => void;
  onOpenSettings: () => void;
  onBackToBrief: () => void;
};

/**
 * PipelineStatusCard is the primary container for the pipeline execution view.
 * it manages the transition between processing, completion, and error states.
 * 
 * **User Story:**
 * - As a user, I want to be notified when my campaign generation is successful
 *   or if there are issues that require my intervention (like credentials).
 * 
 * @param props - Component properties representing the current pipeline state.
 */
export function PipelineStatusCard({
  status,
  fatalError,
  errors,
  hasCredentialIssue,
  onViewResults,
  onOpenSettings,
  onBackToBrief,
}: PipelineStatusCardProps) {
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
          <AlertTitle>Pipeline complete! All creatives have been generated.</AlertTitle>
          <AlertDescription>
            <Button onClick={onViewResults} className="mt-3">
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
              {errors.map((errorEntry) => (
                <CardDescription
                  key={`${errorEntry.productName}-${errorEntry.step}-${errorEntry.message}`}
                  className="m-0 mt-2"
                >
                  {errorEntry.productName} ({errorEntry.step}): {errorEntry.message}
                </CardDescription>
              ))}
            </AlertDescription>
          )}
          <div className="mt-3 flex gap-2">
            {hasCredentialIssue && (
              <Button variant="default" onClick={onOpenSettings}>
                Open Settings
              </Button>
            )}
            <Button variant="outline" onClick={onBackToBrief}>
              Back to Brief
            </Button>
          </div>
        </Alert>
      )}
    </Card>
  );
}
