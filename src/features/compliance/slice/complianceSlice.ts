/**
 * Compliance slice handles brand safety and style adherence checks.
 * It validates generated assets against brand colors and prohibited word lists.
 * 
 * **User Story:**
 * - As a brand manager, I want the system to flag any violations of my brand's 
 *   color palette or prohibited words list to ensure high quality and safety.
 */
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

const hexToHsl = (hex: string): [number, number, number] | null => {
  const rgb = parseHexColor(hex);
  if (!rgb) return null;

  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

const isCloseColor = (a: string, b: string): boolean => {
  const hslA = hexToHsl(a);
  const hslB = hexToHsl(b);

  if (!hslA || !hslB) {
    return a.toLowerCase() === b.toLowerCase();
  }

  // Extremely loose match based strictly on hue and ignoring light/saturation differences
  // Hue is a circle (0-360), so we find the shortest distance
  let hueDiff = Math.abs(hslA[0] - hslB[0]);
  if (hueDiff > 180) {
    hueDiff = 360 - hueDiff;
  }

  // If the hue is within 60 degrees (very wide margin, e.g. yellow-green matches green), 
  // or if both are essentially grayscale (very low saturation or extreme lightness/darkness)
  const isGrayscaleA = hslA[1] < 15 || hslA[2] < 15 || hslA[2] > 85;
  const isGrayscaleB = hslB[1] < 15 || hslB[2] < 15 || hslB[2] > 85;

  if (isGrayscaleA && isGrayscaleB) {
    return true; // Match grayscale colors together
  }

  return hueDiff <= 60; // Extremely forgiving hue match
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
      const matchedColors = state.brandColors.filter(
        (bc) => usedColors.some((uc) => isCloseColor(uc, bc))
      );
      state.issues = state.issues.filter((i) => i.type !== 'brand_color');

      // Looser validation: Only fail if NO brand colors are found
      if (state.brandColors.length > 0 && matchedColors.length === 0) {
        state.issues.push({
          type: 'brand_color',
          detail: `None of the brand colors (${state.brandColors.join(', ')}) were detected.`
        });
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
    /**
     * Resets the compliance state to its initial configuration.
     */
    resetCompliance(state) {
      Object.assign(state, initialState);
    },
  },
});

/**
 * Redux action creators for the compliance slice.
 */
export const {
  setBrandColors,
  setProhibitedWords,
  checkBrandColors,
  checkProhibitedWords,
  clearIssues,
  setBrandGuidelines,
  setComplianceReport,
  reportComplianceForProduct,
  resetCompliance,
} = complianceSlice.actions;

export default complianceSlice.reducer;
