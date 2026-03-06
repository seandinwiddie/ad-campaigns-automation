'use client';

import { useAppSelector } from '@/app/hooks';
import { selectAllCreatives } from '@/features/creative/slice/creativeSelectors';
import { Badge } from '@/components/elements/generic/Badge';
import { Button } from '@/components/elements/generic/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/elements/generic/Card';

const FORMAT_DIMENSIONS: Record<string, string> = {
  '1:1': '1080 x 1080',
  '9:16': '1080 x 1920',
  '16:9': '1920 x 1080',
};

export function OutputGallery() {
  const creatives = useAppSelector(selectAllCreatives);
  const entries = Object.values(creatives);

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generated Creatives</CardTitle>
          <CardDescription>No creatives generated yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const grouped: Record<string, typeof entries> = {};
  for (const c of entries) {
    if (!grouped[c.productId]) grouped[c.productId] = [];
    grouped[c.productId].push(c);
  }

  return (
    <>
      {Object.entries(grouped).map(([productName, productCreatives]) => (
        <Card key={productName} className="mb-4">
          <CardHeader>
            <CardTitle>{productName}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productCreatives.map((creative) => (
              <Card key={creative.id}>
                <CardHeader>
                  <CardTitle className="text-sm">{creative.productId}</CardTitle>
                  <CardDescription>{FORMAT_DIMENSIONS[creative.aspectRatio] ?? creative.aspectRatio}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge>{creative.aspectRatio}</Badge>
                  {creative.outputUrl ? (
                    <>
                      <CardContent
                        className="min-h-40 rounded-md border bg-cover bg-center p-0"
                        style={{ backgroundImage: `url(${creative.outputUrl})` }}
                      />
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(creative.outputUrl, '_blank', 'noopener,noreferrer')}
                      >
                        Open
                      </Button>
                    </>
                  ) : (
                    <CardDescription>
                      {creative.status === 'pending' ? 'Pending' : creative.status === 'failed' ? 'Failed' : 'No preview'}
                    </CardDescription>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      ))}
    </>
  );
}
