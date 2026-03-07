'use client';

import type { ResultsMetricsViewModel } from '@/features/pipeline/slice/pipelineSelectors';
import { Button } from '@/components/elements/generic/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/elements/generic/Card';
import { Separator } from '@/components/elements/generic/Separator';
import { ComplianceReport } from '@/components/elements/unique/ComplianceReport';
import { OutputGallery } from '@/components/elements/unique/OutputGallery';

type ResultsDashboardCardProps = {
  metrics: ResultsMetricsViewModel | null;
  generatedAtLabel: string | null;
  onProcessNewBrief: () => void;
};

export function ResultsDashboardCard({
  metrics,
  generatedAtLabel,
  onProcessNewBrief,
}: ResultsDashboardCardProps) {
  return (
    <>
      <Card className="border-none shadow-xl lg:border">
        <CardHeader className="flex flex-row items-center justify-between pb-8">
          <div>
            <CardTitle className="text-3xl font-bold">Campaign Results</CardTitle>
            <CardDescription className="mt-1 text-base">
              Review your generated creatives and brand compliance status.
            </CardDescription>
          </div>
          <Button variant="outline" size="lg" onClick={onProcessNewBrief}>
            Process New Brief
          </Button>
        </CardHeader>

        <Separator className="opacity-50" />

        {metrics && (
          <CardContent className="py-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Time Saved</p>
                <p className="text-4xl font-bold text-primary">{metrics.timeSavedLabel}</p>
                <p className="text-xs italic text-muted-foreground">Compared to manual production</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Campaigns Ready</p>
                <p className="text-4xl font-bold text-primary">{metrics.campaignsGenerated}</p>
                <p className="text-xs text-muted-foreground">{metrics.successSummary}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Efficiency Gain</p>
                <p className="text-4xl font-bold text-primary">{metrics.efficiencyGainLabel}</p>
                <p className="text-xs text-muted-foreground">Faster asset turnaround</p>
              </div>
            </div>
          </CardContent>
        )}

        <Separator className="opacity-50" />

        <CardContent className="py-10">
          <h3 className="mb-6 text-xl font-semibold">Generated Asset Gallery</h3>
          <OutputGallery />
        </CardContent>

        <Separator className="opacity-50" />

        <CardContent className="py-10">
          <h3 className="mb-6 text-xl font-semibold">Compliance & Quality Audit</h3>
          <ComplianceReport />
        </CardContent>
      </Card>

      {generatedAtLabel && (
        <footer className="mt-8 text-center text-xs uppercase tracking-widest text-muted-foreground opacity-50">
          Results generated at {generatedAtLabel}
        </footer>
      )}
    </>
  );
}
