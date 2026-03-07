'use client';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  selectIsBriefValid,
  selectProductIds,
  selectRunPipelineLabel,
} from '@/features/brief/slice/briefSelectors';
import { startPipeline } from '@/features/pipeline/slice/pipelineActions';
import { setCurrentPage } from '@/features/core/ui/slice/uiActions';
import { motion } from 'framer-motion';
import { BriefEditor } from '@/components/elements/unique/BriefEditor';
import { HomeDashboardCard } from '@/components/elements/unique/HomeDashboardCard';

export function HomeScreen() {
  const dispatch = useAppDispatch();
  const isBriefValid = useAppSelector(selectIsBriefValid);
  const productIds = useAppSelector(selectProductIds);
  const runPipelineLabel = useAppSelector(selectRunPipelineLabel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto mt-8 max-w-4xl px-4"
    >
      <HomeDashboardCard
        isBriefValid={isBriefValid}
        runPipelineLabel={runPipelineLabel}
        onOpenSettings={() => dispatch(setCurrentPage('settings'))}
        onRunPipeline={() => dispatch(startPipeline({ productIds }))}
      >
        <BriefEditor />
      </HomeDashboardCard>
    </motion.div>
  );
}
