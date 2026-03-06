import type { FormatCreativeStatus } from './formatCreativeStatusType';

export interface CreativeOutput {
  productName: string;
  format: string;
  outputPath: string | null;
  status: FormatCreativeStatus;
}
