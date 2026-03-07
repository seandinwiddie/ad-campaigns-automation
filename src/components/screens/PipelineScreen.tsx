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
