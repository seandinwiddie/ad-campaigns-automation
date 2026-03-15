'use client';

import { Button } from '@/components/elements/generic/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/elements/generic/Card';
import { Separator } from '@/components/elements/generic/Separator';

type HomeDashboardCardProps = {
  isBriefValid: boolean;
  runPipelineLabel: string;
  onOpenSettings: () => void;
  onRunPipeline: () => void;
  children: React.ReactNode;
};

/**
 * HomeDashboardCard provides the primary entry point for the application.
 * It houses the brief editor and the main action to initiate the automation pipeline.
 * 
 * **User Story:**
 * - As a marketer, I want a centralized dashboard where I can configure my campaign
 *   requirements and start the generation process with one click.
 * 
 * @param props - Component properties including brief validity and callbacks.
 */
export function HomeDashboardCard({
  isBriefValid,
  runPipelineLabel,
  onOpenSettings,
  onRunPipeline,
  children,
}: HomeDashboardCardProps) {
  return (
    <>
      <Card className="border-none shadow-lg lg:border">
        <CardHeader className="pb-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">Creative Automation</CardTitle>
              <CardDescription className="mt-2 text-base">
                Configure your campaign brief to generate optimized ad creatives.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenSettings}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Settings
            </Button>
          </div>
        </CardHeader>

        <Separator className="opacity-50" />

        <CardContent className="pt-8">{children}</CardContent>

        <Separator className="mt-4 opacity-50" />

        <CardContent className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <Button
              onClick={onRunPipeline}
              disabled={!isBriefValid}
              size="lg"
              className="px-8 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {runPipelineLabel}
            </Button>
            {isBriefValid && (
              <span className="animate-in slide-in-from-left-2 fade-in text-sm font-medium text-primary">
                Brief Validated
              </span>
            )}
          </div>

          {!isBriefValid && (
            <p className="text-sm italic text-muted-foreground">
              Please validate your brief to continue.
            </p>
          )}
        </CardContent>
      </Card>

      <footer className="mt-8 text-center text-xs uppercase tracking-widest text-muted-foreground opacity-50">
        Ad Campaigns Automation Pipeline v0.1.0
      </footer>
    </>
  );
}
