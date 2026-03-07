'use client';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectIsBriefValid, selectProducts } from '@/features/brief/slice/briefSelectors';
import { startPipeline } from '@/features/pipeline/slice/pipelineActions';
import { setCurrentPage } from '@/features/core/ui/slice/uiActions';
import { motion } from 'framer-motion';
import { Button } from '@/components/elements/generic/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/elements/generic/Card';
import { Separator } from '@/components/elements/generic/Separator';
import { BriefEditor } from '@/components/elements/unique/BriefEditor';

export function HomeScreen() {
  const dispatch = useAppDispatch();
  const isBriefValid = useAppSelector(selectIsBriefValid);
  const products = useAppSelector(selectProducts);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto mt-8 max-w-4xl px-4"
    >
      <Card className="border-none shadow-lg lg:border">
        <CardHeader className="pb-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">Creative Automation</CardTitle>
              <CardDescription className="text-base mt-2">
                Configure your campaign brief to generate optimized ad creatives.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(setCurrentPage('settings'))}
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Settings
            </Button>
          </div>
        </CardHeader>

        <Separator className="opacity-50" />

        <CardContent className="pt-8">
          <BriefEditor />
        </CardContent>

        <Separator className="mt-4 opacity-50" />

        <CardContent className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <Button
              onClick={() =>
                dispatch(startPipeline({ productIds: products.map((p) => p.id) }))
              }
              disabled={!isBriefValid}
              size="lg"
              className="px-8 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isBriefValid ? `Run Pipeline for ${products.length} Products` : 'Run Pipeline'}
            </Button>
            {isBriefValid && (
              <span className="text-sm font-medium text-primary animate-in fade-in slide-in-from-left-2">
                Brief Validated
              </span>
            )}
          </div>

          {!isBriefValid && (
            <p className="text-sm text-muted-foreground italic">
              Please validate your brief to continue.
            </p>
          )}
        </CardContent>
      </Card>

      <footer className="mt-8 text-center text-xs text-muted-foreground uppercase tracking-widest opacity-50">
        Ad Campaigns Automation Pipeline v0.1.0
      </footer>
    </motion.div>
  );
}
