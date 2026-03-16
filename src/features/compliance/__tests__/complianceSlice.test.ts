/**
 * Covers the compliance rules that turn brand guidelines into campaign-level pass/fail signals.
 */
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
    it('Then checkBrandColors reports an issue when none of the configured colors are detected', () => {
      const store = createTestStore();
      store.dispatch(setBrandColors(['#FF0000', '#00FF00', '#0000FF']));
      store.dispatch(checkBrandColors(['not-a-color']));
      const state = store.getState();
      const issues = selectComplianceIssues({ compliance: state.compliance } as any);
      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('brand_color');
      expect(issues[0].detail).toContain('None of the brand colors');
    });

    it('Then checkBrandColors accepts a partial match when at least one configured color is present', () => {
      const store = createTestStore();
      store.dispatch(setBrandColors(['#FF0000', '#00FF00', '#0000FF']));
      store.dispatch(checkBrandColors(['#FF0000']));
      const state = store.getState();
      expect(selectComplianceIssues({ compliance: state.compliance } as any)).toHaveLength(0);
      expect(selectIsCompliant({ compliance: state.compliance } as any)).toBe(true);
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
