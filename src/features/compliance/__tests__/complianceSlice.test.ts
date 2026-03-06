import { configureStore } from '@reduxjs/toolkit';
import complianceReducer, {
} from '../slice/complianceSlice';
import { setBrandColors, setProhibitedWords, checkBrandColors, checkProhibitedWords } from '../slice/complianceActions';
import { selectComplianceIssues, selectIsCompliant } from '../slice/complianceSelectors';
import type { ComplianceState } from '../types/complianceStateType';

function createTestStore(preloadedState?: { compliance: ComplianceState }) {
  return configureStore({
    reducer: { compliance: complianceReducer },
    preloadedState,
  });
}

describe('Story 7: Brand Compliance', () => {
  describe('Given brand colors configured', () => {
    it('Then checkBrandColors reports missing colors when not all are present', () => {
      const store = createTestStore();
      store.dispatch(setBrandColors(['#FF0000', '#00FF00', '#0000FF']));
      // Only using 2 of 3 brand colors
      store.dispatch(checkBrandColors(['#FF0000', '#00FF00']));
      const state = store.getState();
      const issues = selectComplianceIssues({ compliance: state.compliance } as any);
      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('brand_color');
      expect(issues[0].detail).toContain('#0000FF');
    });

    it('Then checkBrandColors reports no issues when all are present', () => {
      const store = createTestStore();
      store.dispatch(setBrandColors(['#FF0000', '#00FF00']));
      store.dispatch(checkBrandColors(['#FF0000', '#00FF00', '#FFFFFF']));
      const state = store.getState();
      expect(selectIsCompliant({ compliance: state.compliance } as any)).toBe(true);
    });
  });

  describe('Given prohibited words list', () => {
    it('Then checkProhibitedWords flags matches in message', () => {
      const store = createTestStore();
      store.dispatch(setProhibitedWords(['free', 'guaranteed']));
      store.dispatch(checkProhibitedWords('Get your free EcoBottle'));
      const state = store.getState();
      const issues = selectComplianceIssues({ compliance: state.compliance } as any);
      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('prohibited_word');
      expect(issues[0].detail).toContain('free');
    });

    it('Then "Get your free EcoBottle" with prohibited words ["free"] flags "free"', () => {
      const store = createTestStore();
      store.dispatch(setProhibitedWords(['free']));
      store.dispatch(checkProhibitedWords('Get your free EcoBottle'));
      const state = store.getState();
      const issues = selectComplianceIssues({ compliance: state.compliance } as any);
      expect(issues).toHaveLength(1);
      expect(issues[0].detail).toBe('Prohibited word found: "free"');
      expect(selectIsCompliant({ compliance: state.compliance } as any)).toBe(false);
    });

    it('Then reports no issues when message has no prohibited words', () => {
      const store = createTestStore();
      store.dispatch(setProhibitedWords(['free', 'guaranteed']));
      store.dispatch(checkProhibitedWords('Buy our EcoBottle today'));
      const state = store.getState();
      expect(selectIsCompliant({ compliance: state.compliance } as any)).toBe(true);
    });
  });
});
