'use client';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectIsBriefValid, selectProducts } from '@/features/brief/slice/briefSelectors';
import { startPipeline } from '@/features/pipeline/slice/pipelineActions';
import { setCurrentPage } from '@/features/core/ui/slice/uiActions';
import { Button } from '@/components/elements/generic/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/elements/generic/Card';
import { BriefEditor } from '@/components/elements/unique/BriefEditor';

export function HomeScreen() {
  const dispatch = useAppDispatch();
  const isBriefValid = useAppSelector(selectIsBriefValid);
  const products = useAppSelector(selectProducts);

  return (
    <Card className="mx-auto mt-8 max-w-4xl">
      <CardHeader>
        <CardTitle>Creative Automation Pipeline</CardTitle>
        <CardDescription>Upload a campaign brief to generate ad creatives for all products.</CardDescription>
      </CardHeader>
      <CardContent>
        <BriefEditor />
      </CardContent>
      <CardContent className="flex items-center gap-4">
        <Button
          onClick={() =>
            dispatch(startPipeline({ productIds: products.map((p) => p.id) }))
          }
          disabled={!isBriefValid}
          size="lg"
        >
          Run Pipeline
        </Button>
        {isBriefValid && (
          <CardDescription className="m-0">
            {products.length} product{products.length !== 1 ? 's' : ''} ready
          </CardDescription>
        )}
        <Button
          variant="ghost"
          onClick={() => dispatch(setCurrentPage('settings'))}
          className="ml-auto"
        >
          Settings
        </Button>
      </CardContent>
    </Card>
  );
}
