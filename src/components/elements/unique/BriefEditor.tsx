'use client';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadExampleBriefText, setBriefRawText } from '@/features/core/ui/slice/uiActions';
import { selectBriefRawText } from '@/features/core/ui/slice/uiSelectors';
import { clearBrief } from '@/features/brief/slice/briefActions';
import { loadBrief } from '@/features/brief/thunks/briefThunks';
import { selectProducts, selectValidationErrors, selectIsBriefValid } from '@/features/brief/slice/briefSelectors';
import { Textarea } from '@/components/elements/generic/Textarea';
import { Button } from '@/components/elements/generic/Button';
import { Alert, AlertTitle, AlertDescription } from '@/components/elements/generic/Alert';
import { Card, CardContent, CardDescription } from '@/components/elements/generic/Card';

export function BriefEditor() {
  const dispatch = useAppDispatch();
  const rawText = useAppSelector(selectBriefRawText);
  const products = useAppSelector(selectProducts);
  const validationErrors = useAppSelector(selectValidationErrors);
  const isBriefValid = useAppSelector(selectIsBriefValid);

  return (
    <Card>
      <CardContent className="flex flex-wrap gap-2">
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
          onClick={() => {
            dispatch(setBriefRawText(''));
            dispatch(clearBrief());
          }}
        >
          Clear
        </Button>
      </CardContent>

      <CardContent>
        <Textarea
          value={rawText}
          onChange={(e) => dispatch(setBriefRawText(e.target.value))}
          placeholder="Paste your campaign brief as JSON or YAML..."
          rows={14}
        />
      </CardContent>

      <CardContent>
        <Button
          onClick={() => dispatch(loadBrief(rawText))}
          disabled={rawText.trim().length === 0}
        >
          Validate &amp; Load
        </Button>
      </CardContent>

      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertTitle>Validation Errors</AlertTitle>
          <AlertDescription>
            {validationErrors.map((err, i) => (
              <CardDescription key={i} className="m-0 text-sm">
                {err.field}: {err.message}
              </CardDescription>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {isBriefValid && products.length > 0 && (
        <Alert>
          <AlertTitle>
            Brief loaded — {products.length} product{products.length !== 1 ? 's' : ''}
          </AlertTitle>
          <AlertDescription>
            {products.map((p, i) => (
              <CardDescription key={i} className="m-0 text-sm">
                {p.name} — {p.description}
              </CardDescription>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
}
