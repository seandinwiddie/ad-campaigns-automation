'use client';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  selectPipelineHasCredentialIssue,
  selectPipelineError,
  selectPipelineErrors,
  selectPipelineStatus,
} from '@/features/pipeline/slice/pipelineSelectors';
import { setCurrentPage } from '@/features/core/ui/slice/uiActions';
import { PipelineStatusCard } from '@/components/elements/unique/PipelineStatusCard';

/**
 * The PipelineScreen component displays the active progress of the campaign generation pipeline.
 * It uses the `PipelineStatusCard` to show real-time updates, handled errors, and provides
 * navigation once the process is complete or if settings need adjustment.
 * 
 * **User Story:**
 * - As a user, I want to watch the progress of my campaign generation so I know when it's done.
 * - As a user, I want to see if any specific products failed so I can address them later.
 */
export function PipelineScreen() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectPipelineStatus);
  const fatalError = useAppSelector(selectPipelineError);
  const errors = useAppSelector(selectPipelineErrors);
  const hasCredentialIssue = useAppSelector(selectPipelineHasCredentialIssue);

  return (
    <PipelineStatusCard
      status={status}
      fatalError={fatalError}
      errors={errors}
      hasCredentialIssue={hasCredentialIssue}
      onViewResults={() => dispatch(setCurrentPage('results'))}
      onOpenSettings={() => dispatch(setCurrentPage('settings'))}
      onBackToBrief={() => dispatch(setCurrentPage('home'))}
    />
  );
}
