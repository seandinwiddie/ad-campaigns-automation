/**
 * Brief slice manages the campaign requirements, product list, and brand guidelines.
 * It handles the loading and validation of the campaign brief.
 * 
 * **User Story:**
 * - As a marketer, I want to upload a campaign brief so the system can extract 
 *   product details and brand guidelines automatically.
 */
import { createSlice } from '@reduxjs/toolkit';
import type { BriefState } from '../types/briefStateType';
import { loadBrief } from '@/features/brief/thunks/briefThunks';

const initialState: BriefState = {
  brief: null,
  isValid: false,
  validationErrors: [],
  loading: false,
  error: null,
};

export const briefSlice = createSlice({
  name: 'brief',
  initialState,
  reducers: {
    resetBrief(state) {
      Object.assign(state, initialState);
    },
    clearBrief(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBrief.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = [];
      })
      .addCase(loadBrief.fulfilled, (state, action) => {
        state.loading = false;
        state.brief = action.payload;
        state.isValid = true;
        state.validationErrors = [];
      })
      .addCase(loadBrief.rejected, (state, action) => {
        state.loading = false;
        state.isValid = false;
        state.brief = null;
        if (action.payload) {
          state.validationErrors = action.payload;
          state.error = null;
        } else {
          state.error = action.error.message ?? 'Failed to load brief';
        }
      });
  },
});

/**
 * Redux action creators for the brief slice.
 */
export const { resetBrief, clearBrief } = briefSlice.actions;

export default briefSlice.reducer;
