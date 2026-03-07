import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { resetPipeline } from '@/features/pipeline/slice/pipelineActions';
import { selectMetrics } from '@/features/pipeline/slice/pipelineSelectors';
import { selectAllCreatives } from '@/features/creative/slice/creativeSelectors';
import { Button } from '@/components/elements/generic/Button';
import { Alert, AlertDescription, AlertTitle } from '@/components/elements/generic/Alert';
import { Card, CardTitle, CardDescription, CardContent, CardHeader } from '@/components/elements/generic/Card';
import { Separator } from '@/components/elements/generic/Separator';
import { OutputGallery } from '@/components/elements/unique/OutputGallery';
import { ComplianceReport } from '@/components/elements/unique/ComplianceReport';

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function ResultsScreen() {
  const dispatch = useAppDispatch();
  const metrics = useAppSelector(selectMetrics);
  const creatives = useAppSelector(selectAllCreatives);
  const hasDownloadOnlyAssets = Object.values(creatives).some((creative) => creative.storageMode === 'download');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-8 max-w-6xl px-4 pb-12"
    >
      <Card className="border-none shadow-xl lg:border">
        <CardHeader className="flex flex-row items-center justify-between pb-8">
          <div>
            <CardTitle className="text-3xl font-bold">Campaign Results</CardTitle>
            <CardDescription className="text-base mt-1">
              Review your generated creatives and brand compliance status.
            </CardDescription>
          </div>
          <Button variant="outline" size="lg" onClick={() => dispatch(resetPipeline())}>
            Process New Brief
          </Button>
        </CardHeader>

        <Separator className="opacity-50" />

        {metrics && (
          <CardContent className="py-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Time Saved</p>
                <p className="text-4xl font-bold text-primary">{formatTime(metrics.timeSavedSeconds)}</p>
                <p className="text-xs text-muted-foreground italic">Compared to manual production</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Campaigns Ready</p>
                <p className="text-4xl font-bold text-primary">{metrics.campaignsGenerated}</p>
                <p className="text-xs text-muted-foreground">
                  {metrics.successCount} of {metrics.totalProducts} successfully processed
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Efficiency Gain</p>
                <p className="text-4xl font-bold text-primary">{metrics.efficiencyGain}x</p>
                <p className="text-xs text-muted-foreground">Faster asset turnaround</p>
              </div>
            </div>
          </CardContent>
        )}

        <Separator className="opacity-50" />

        <CardContent className="py-10">
          {hasDownloadOnlyAssets && (
            <Alert className="mb-6 border-amber-300 bg-amber-50 text-amber-950">
              <AlertTitle>Dropbox unavailable for one or more assets</AlertTitle>
              <AlertDescription>
                The pipeline still completed. Use the download buttons below to save the PNG files locally.
              </AlertDescription>
            </Alert>
          )}
          <h3 className="text-xl font-semibold mb-6">Generated Asset Gallery</h3>
          <OutputGallery />
        </CardContent>

        <Separator className="opacity-50" />

        <CardContent className="py-10">
          <h3 className="text-xl font-semibold mb-6">Compliance & Quality Audit</h3>
          <ComplianceReport />
        </CardContent>
      </Card>

      <footer className="mt-8 text-center text-xs text-muted-foreground uppercase tracking-widest opacity-50">
        Results generated at {new Date().toLocaleTimeString()}
      </footer>
    </motion.div>
  );
}
