import { useAppSelector } from '@/app/hooks';
import { selectAllCreatives } from '@/features/creative/slice/creativeSelectors';
import { Badge } from '@/components/elements/generic/Badge';
import { Button } from '@/components/elements/generic/Button';
import { AspectRatio } from '@/components/elements/generic/AspectRatio';
import { Separator } from '@/components/elements/generic/Separator';

const FORMAT_RATIOS: Record<string, number> = {
  '1:1': 1,
  '9:16': 9 / 16,
  '16:9': 16 / 9,
};

export function OutputGallery() {
  const creatives = useAppSelector(selectAllCreatives);
  const entries = Object.values(creatives);

  if (entries.length === 0) {
    return (
      <div className="py-12 text-center rounded-lg border-2 border-dashed border-muted-foreground/20">
        <p className="text-muted-foreground italic font-medium">No campaign assets generated yet.</p>
        <p className="text-xs text-muted-foreground mt-1">Run the pipeline from the Home screen to see results here.</p>
      </div>
    );
  }

  const grouped: Record<string, typeof entries> = {};
  for (const c of entries) {
    if (!grouped[c.productId]) grouped[c.productId] = [];
    grouped[c.productId].push(c);
  }

  return (
    <div className="space-y-12">
      {Object.entries(grouped).map(([productName, productCreatives]) => (
        <div key={productName} className="space-y-6">
          <div className="flex items-center gap-4">
            <h4 className="text-lg font-bold tracking-tight">{productName}</h4>
            <Badge variant="outline" className="text-[10px] uppercase tracking-tighter opacity-70">
              {productCreatives.length} Variants
            </Badge>
            <Separator className="flex-1 opacity-30" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productCreatives.map((creative) => (
              <div key={creative.id} className="group relative space-y-3">
                <div className="overflow-hidden rounded-xl border bg-muted/30 shadow-sm transition-all hover:shadow-md">
                  <AspectRatio ratio={FORMAT_RATIOS[creative.aspectRatio] ?? 1}>
                    {creative.outputUrl ? (
                      <div
                        className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${creative.outputUrl})` }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-6 text-center">
                        {creative.status === 'pending' && (
                          <div className="flex flex-col items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <span className="text-xs font-medium text-muted-foreground">Generating...</span>
                          </div>
                        )}
                        {creative.status === 'failed' && (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-destructive uppercase">Failed</p>
                            <p className="max-w-[150px] text-[10px] leading-tight text-muted-foreground">
                              {creative.error || 'Unknown generation error'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </AspectRatio>
                </div>

                <div className="flex items-center justify-between px-1">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide opacity-80">{creative.aspectRatio}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Social Format</p>
                  </div>
                  {creative.outputUrl && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 px-3 text-[10px] uppercase font-bold"
                      onClick={() => window.open(creative.outputUrl, '_blank', 'noopener,noreferrer')}
                    >
                      View Full
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
