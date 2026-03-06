import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ComplianceReport } from '@/features/compliance/types/complianceReportType';
import type { ComplianceState } from '@/features/compliance/types/complianceStateType';

const parseHexColor = (value: string): [number, number, number] | null => {
  const clean = value.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    return null;
  }
  return [
    Number.parseInt(clean.slice(0, 2), 16),
    Number.parseInt(clean.slice(2, 4), 16),
    Number.parseInt(clean.slice(4, 6), 16),
  ];
};

const isCloseColor = (a: string, b: string): boolean => {
  const rgbA = parseHexColor(a);
  const rgbB = parseHexColor(b);
  if (!rgbA || !rgbB) {
    return a.toLowerCase() === b.toLowerCase();
  }
  const distance = Math.sqrt(
    (rgbA[0] - rgbB[0]) ** 2 +
    (rgbA[1] - rgbB[1]) ** 2 +
    (rgbA[2] - rgbB[2]) ** 2
  );
  return distance <= 45;
};

const initialState: ComplianceState = {
  brandColors: [],
  prohibitedWords: [],
  issues: [],
  reports: {},
};

export const complianceSlice = createSlice({
  name: 'compliance',
  initialState,
  reducers: {
    setBrandColors(state, action: PayloadAction<string[]>) {
      state.brandColors = action.payload;
    },
    setProhibitedWords(state, action: PayloadAction<string[]>) {
      state.prohibitedWords = action.payload;
    },
    checkBrandColors(state, action: PayloadAction<string[]>) {
      const usedColors = action.payload;
      const missing = state.brandColors.filter(
        (bc) => !usedColors.some((uc) => isCloseColor(uc, bc))
      );
      state.issues = state.issues.filter((i) => i.type !== 'brand_color');
      for (const color of missing) {
        state.issues.push({ type: 'brand_color', detail: `Missing brand color: ${color}` });
      }
    },
    checkProhibitedWords(state, action: PayloadAction<string>) {
      const message = action.payload.toLowerCase();
      state.issues = state.issues.filter((i) => i.type !== 'prohibited_word');
      for (const word of state.prohibitedWords) {
        if (message.includes(word.toLowerCase())) {
          state.issues.push({ type: 'prohibited_word', detail: `Prohibited word found: "${word}"` });
        }
      }
    },
    clearIssues(state) {
      state.issues = [];
    },
    setBrandGuidelines(state, action: PayloadAction<{ colors: string[]; prohibitedWords: string[] }>) {
      state.brandColors = action.payload.colors;
      state.prohibitedWords = action.payload.prohibitedWords;
    },
    setComplianceReport(state, action: PayloadAction<ComplianceReport>) {
      state.reports[action.payload.productName] = action.payload;
    },
    reportComplianceForProduct(
      state,
      action: PayloadAction<{ productName: string; colorCompliance: boolean; detectedColors?: string[] }>
    ) {
      const prohibitedWordsFound = state.issues
        .filter((issue) => issue.type === 'prohibited_word')
        .map((issue) => issue.detail.replace('Prohibited word found: "', '').replace('"', ''));

      state.reports[action.payload.productName] = {
        productName: action.payload.productName,
        colorCompliance: action.payload.colorCompliance,
        detectedColors: action.payload.detectedColors ?? [],
        prohibitedWordsFound,
        isCompliant: action.payload.colorCompliance && prohibitedWordsFound.length === 0,
      };
    },
    resetCompliance(state) {
      Object.assign(state, initialState);
    },
  },
});

export default complianceSlice.reducer;
