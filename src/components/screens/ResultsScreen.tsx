'use client';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { resetPipeline } from '@/features/pipeline/slice/pipelineActions';
import { selectMetrics } from '@/features/pipeline/slice/pipelineSelectors';
import { Button } from '@/components/elements/generic/Button';
import { Card, CardTitle, CardDescription, CardContent, CardHeader } from '@/components/elements/generic/Card';
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

  return (
    <Card className="mx-auto mt-8 max-w-6xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardContent className="p-0">
          <CardTitle>Campaign Results</CardTitle>
          <CardDescription>Review generated creatives and compliance reports.</CardDescription>
        </CardContent>
        <Button variant="outline" onClick={() => dispatch(resetPipeline())}>
          Run Another
        </Button>
      </CardHeader>

      {metrics && (
        <CardContent className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardTitle>Time Saved</CardTitle>
            <CardContent className="px-0 text-2xl font-semibold">{formatTime(metrics.timeSavedSeconds)}</CardContent>
            <CardDescription>vs. manual creation</CardDescription>
          </Card>
          <Card>
            <CardTitle>Campaigns Generated</CardTitle>
            <CardContent className="px-0 text-2xl font-semibold">{metrics.campaignsGenerated}</CardContent>
            <CardDescription>
              {metrics.successCount} / {metrics.totalProducts} products succeeded
            </CardDescription>
          </Card>
          <Card>
            <CardTitle>Efficiency Gain</CardTitle>
            <CardContent className="px-0 text-2xl font-semibold">{metrics.efficiencyGain}x</CardContent>
            <CardDescription>faster than manual</CardDescription>
          </Card>
        </CardContent>
      )}

      <CardContent className="mb-10">
        <CardTitle className="mb-4">Generated Creatives</CardTitle>
        <OutputGallery />
      </CardContent>

      <CardContent>
        <CardTitle className="mb-4">Compliance Report</CardTitle>
        <ComplianceReport />
      </CardContent>
    </Card>
  );
}
