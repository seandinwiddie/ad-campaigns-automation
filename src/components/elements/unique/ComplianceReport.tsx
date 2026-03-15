'use client';

import { useAppSelector } from '@/app/hooks';
import { selectComplianceReportEntries } from '@/features/compliance/slice/complianceSelectors';
import { Badge } from '@/components/elements/generic/Badge';
import { CardDescription } from '@/components/elements/generic/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/elements/generic/Table';

/**
 * ComplianceReport displays a breakdown of brand safety and guideline adherence
 * for each generated asset in the campaign.
 * 
 * **User Story:**
 * - As a brand manager, I want to see which assets passed or failed compliance checks
 *   (color usage, prohibited words) so I can ensure brand quality.
 */
export function ComplianceReport() {
  const entries = useAppSelector(selectComplianceReportEntries);

  if (entries.length === 0) {
    return <CardDescription>No compliance reports available.</CardDescription>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Brand Colors</TableHead>
          <TableHead>Prohibited Words</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((report) => (
          <TableRow key={report.productName}>
            <TableCell className="font-medium text-gray-900 dark:text-gray-100">
              {report.productName}
            </TableCell>
            <TableCell>
              <Badge variant={report.colorCompliance ? 'secondary' : 'destructive'}>
                {report.colorCompliance ? 'Pass' : 'Fail'}
              </Badge>
              {!report.colorCompliance && report.detectedColors.length > 0 && (
                <CardDescription className="mt-1">
                  Detected: {report.detectedColors.join(', ')}
                </CardDescription>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={report.prohibitedWordsFound.length === 0 ? 'secondary' : 'destructive'}>
                {report.prohibitedWordsFound.length === 0 ? 'Pass' : 'Fail'}
              </Badge>
              {report.prohibitedWordsFound.length > 0 && (
                <CardDescription className="mt-1">
                  Found: {report.prohibitedWordsFound.join(', ')}
                </CardDescription>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={report.isCompliant ? 'secondary' : 'destructive'}>
                {report.isCompliant ? 'Compliant' : 'Violations'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
