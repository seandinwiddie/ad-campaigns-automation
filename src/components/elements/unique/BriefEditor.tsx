'use client';

/**
 * The BriefEditor component allows users to input and validate campaign requirements.
 * supports JSON and YAML formats and provides real-time validation feedback.
 * 
 * **User Story:**
 * - As a marketer, I want to paste my campaign brief and see which products were identified.
 * - As a developer, I want to load example data to quickly test the end-to-end flow.
 */
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadExampleBriefText, setBriefRawText } from '@/features/core/ui/slice/uiActions';
import { selectBriefRawText, selectCanLoadBrief } from '@/features/core/ui/slice/uiSelectors';
import { clearBriefEditor } from '@/features/brief/slice/briefWorkflowActions';
import { loadBrief } from '@/features/brief/thunks/briefThunks';
import { selectProducts, selectValidationErrors, selectIsBriefValid } from '@/features/brief/slice/briefSelectors';
import { Textarea } from '@/components/elements/generic/Textarea';
import { Button } from '@/components/elements/generic/Button';
import { Alert, AlertTitle, AlertDescription } from '@/components/elements/generic/Alert';

export function BriefEditor() {
  const dispatch = useAppDispatch();
  const rawText = useAppSelector(selectBriefRawText);
  const products = useAppSelector(selectProducts);
  const validationErrors = useAppSelector(selectValidationErrors);
  const isBriefValid = useAppSelector(selectIsBriefValid);
  const canLoadBrief = useAppSelector(selectCanLoadBrief);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(loadExampleBriefText())}
        >
          Load Example
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(clearBriefEditor())}
        >
          Clear
        </Button>
      </div>

      <Textarea
        value={rawText}
        onChange={(e) => dispatch(setBriefRawText(e.target.value))}
        placeholder="Paste your campaign brief as JSON or YAML..."
        rows={14}
        className="min-h-[300px] font-mono text-sm"
      />

      <div className="flex items-center justify-between">
        <Button
          onClick={() => dispatch(loadBrief(rawText))}
          disabled={!canLoadBrief}
          size="lg"
        >
          Validate &amp; Load Brief
        </Button>
      </div>

      {validationErrors.length > 0 && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Validation Errors</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-1">
              {validationErrors.map((err, i) => (
                <div key={i} className="text-sm">
                  <span className="font-semibold uppercase">{err.field}:</span> {err.message}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isBriefValid && products.length > 0 && (
        <Alert className="mt-4 border-primary/20 bg-primary/5">
          <AlertTitle className="text-primary">
            Brief Loaded — {products.length} Products Found
          </AlertTitle>
          <AlertDescription>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {products.map((product) => (
                <div key={product.id} className="rounded-md border bg-background p-3 shadow-sm">
                  <div className="font-semibold">{product.name}</div>
                  <div className="text-xs text-muted-foreground">{product.description}</div>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
