import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { resetPipeline } from '@/features/pipeline/slice/pipelineActions';
import {
  selectResultsGeneratedAtLabel,
  selectResultsMetricsViewModel,
} from '@/features/pipeline/slice/pipelineSelectors';
import { ResultsDashboardCard } from '@/components/elements/unique/ResultsDashboardCard';

export function ResultsScreen() {
  const dispatch = useAppDispatch();
  const metrics = useAppSelector(selectResultsMetricsViewModel);
  const generatedAtLabel = useAppSelector(selectResultsGeneratedAtLabel);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-8 max-w-6xl px-4 pb-12"
    >
      <ResultsDashboardCard
        metrics={metrics}
        generatedAtLabel={generatedAtLabel}
        onProcessNewBrief={() => dispatch(resetPipeline())}
      />
    </motion.div>
  );
}
