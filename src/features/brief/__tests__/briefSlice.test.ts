import { configureStore } from '@reduxjs/toolkit';
import briefReducer from '../slice/briefSlice';
import type { CampaignBrief } from '../types/campaignBriefType';
import type { BriefState } from '../types/briefStateType';
import { loadBrief } from '../thunks/briefThunks';
import { selectBrief, selectIsBriefValid, selectValidationErrors } from '../slice/briefSelectors';

function createTestStore(preloadedState?: { brief: BriefState }) {
  return configureStore({
    reducer: { brief: briefReducer },
    preloadedState,
  });
}

function makeValidBrief(overrides: Partial<CampaignBrief> = {}): CampaignBrief {
  return {
    campaignName: 'Summer Campaign',
    products: [
      { id: 'p1', name: 'EcoBottle', description: 'Reusable water bottle' },
      { id: 'p2', name: 'EcoBag', description: 'Reusable shopping bag' },
    ],
    targetRegion: 'US',
    targetAudience: 'Eco-conscious millennials',
    campaignMessage: 'Go green with our products',
    ...overrides,
  };
}

describe('Story 2: Campaign Brief Input', () => {
  describe('Given valid JSON brief with 2+ products', () => {
    it('Then loadBrief succeeds and selectIsBriefValid is true', async () => {
      const store = createTestStore();
      const brief = makeValidBrief();
      await store.dispatch(loadBrief(JSON.stringify(brief)));
      const state = store.getState();
      expect(selectIsBriefValid({ brief: state.brief } as any)).toBe(true);
      expect(selectBrief({ brief: state.brief } as any)).toEqual(brief);
    });
  });

  describe('Given valid YAML brief', () => {
    it('Then loadBrief succeeds', async () => {
      const store = createTestStore();
      const yamlInput = `
campaignName: Summer Campaign
products:
  - id: p1
    name: EcoBottle
    description: Reusable water bottle
  - id: p2
    name: EcoBag
    description: Reusable shopping bag
targetRegion: US
targetAudience: Eco-conscious millennials
campaignMessage: Go green with our products
`;
      await store.dispatch(loadBrief(yamlInput));
      const state = store.getState();
      expect(selectIsBriefValid({ brief: state.brief } as any)).toBe(true);
    });
  });

  describe('Given brief missing required fields', () => {
    it('Then loadBrief rejects with field-level errors', async () => {
      const store = createTestStore();
      const brief = { campaignName: 'Test' } as CampaignBrief;
      await store.dispatch(loadBrief(JSON.stringify(brief)));
      const state = store.getState();
      expect(selectIsBriefValid({ brief: state.brief } as any)).toBe(false);
      const errors = selectValidationErrors({ brief: state.brief } as any);
      expect(errors.length).toBeGreaterThan(0);
      const errorFields = errors.map((e) => e.field);
      expect(errorFields).toContain('products');
      expect(errorFields).toContain('targetRegion');
      expect(errorFields).toContain('targetAudience');
      expect(errorFields).toContain('campaignMessage');
    });
  });

  describe('Given brief with <2 products', () => {
    it('Then validation fails with products error', async () => {
      const store = createTestStore();
      const brief = makeValidBrief({
        products: [{ id: 'p1', name: 'EcoBottle', description: 'Bottle' }],
      });
      await store.dispatch(loadBrief(JSON.stringify(brief)));
      const state = store.getState();
      expect(selectIsBriefValid({ brief: state.brief } as any)).toBe(false);
      const errors = selectValidationErrors({ brief: state.brief } as any);
      expect(errors.some((e) => e.field === 'products')).toBe(true);
    });
  });

  describe('Given brief missing targetRegion', () => {
    it('Then validation fails with targetRegion error', async () => {
      const store = createTestStore();
      const brief = makeValidBrief({ targetRegion: '' });
      await store.dispatch(loadBrief(JSON.stringify(brief)));
      const state = store.getState();
      expect(selectIsBriefValid({ brief: state.brief } as any)).toBe(false);
      const errors = selectValidationErrors({ brief: state.brief } as any);
      expect(errors.some((e) => e.field === 'targetRegion')).toBe(true);
    });
  });

  describe('Given brief missing targetAudience', () => {
    it('Then validation fails with targetAudience error', async () => {
      const store = createTestStore();
      const brief = makeValidBrief({ targetAudience: '' });
      await store.dispatch(loadBrief(JSON.stringify(brief)));
      const state = store.getState();
      expect(selectIsBriefValid({ brief: state.brief } as any)).toBe(false);
      const errors = selectValidationErrors({ brief: state.brief } as any);
      expect(errors.some((e) => e.field === 'targetAudience')).toBe(true);
    });
  });

  describe('Given brief missing campaignMessage', () => {
    it('Then validation fails with campaignMessage error', async () => {
      const store = createTestStore();
      const brief = makeValidBrief({ campaignMessage: '' });
      await store.dispatch(loadBrief(JSON.stringify(brief)));
      const state = store.getState();
      expect(selectIsBriefValid({ brief: state.brief } as any)).toBe(false);
      const errors = selectValidationErrors({ brief: state.brief } as any);
      expect(errors.some((e) => e.field === 'campaignMessage')).toBe(true);
    });
  });
});
