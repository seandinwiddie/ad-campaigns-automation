/**
 * UI slice manages global application state such as navigation, loading indicators, 
 * modal visibility, and ephemeral input values (e.g. settings form).
 * 
 * **User Stories:**
 * - "As a user, I want to see a loading indicator when the app is processing."
 * - "As a user, I want to see a sample brief to understand how to format my inputs."
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppPage } from '@/features/core/ui/types/appPageType';
import type { UiState } from '@/features/core/ui/types/uiStateType';

const EXAMPLE_BRIEF_TEMPLATE = `{
  "campaignName": "Summer Eco Campaign 2025",
  "products": [
    {
      "name": "EcoBottle",
      "description": "Sustainable water bottle made from recycled ocean plastic"
    },
    {
      "name": "SolarCharger",
      "description": "Portable solar-powered phone charger for outdoor adventures"
    }
  ],
  "targetRegion": "United States",
  "targetAudience": "Environmentally conscious millennials aged 25-35",
  "campaignMessage": "Stay Green, Live Clean",
  "brandGuidelines": {
    "colors": ["#00A86B", "#FFFFFF"],
    "prohibitedWords": ["free", "guaranteed", "miracle", "unlimited"]
  }
}`;

const initialState: UiState = {
  isLoading: false,
  activeModal: null,
  currentPage: 'settings',
  briefRawText: '',
  leonardoApiKeyInput: '',
  dropboxAccessTokenInput: '',
  leonardoValidationStatus: 'idle',
  leonardoValidationMessage: null,
  dropboxValidationStatus: 'idle',
  dropboxValidationMessage: null,
  elapsedSeconds: 0,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Sets the global loading state for the application.
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    /**
     * Controls the visibility of modals by setting the active modal name.
     */
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload;
    },
    /**
     * Navigates between primary application screens.
     */
    setCurrentPage: (state, action: PayloadAction<AppPage>) => {
      state.currentPage = action.payload;
    },
    /**
     * Updates the raw input text of the campaign brief.
     */
    setBriefRawText: (state, action: PayloadAction<string>) => {
      state.briefRawText = action.payload;
    },
    /**
     * Populates the brief editor with a pre-defined example template.
     */
    loadExampleBriefText: (state) => {
      state.briefRawText = EXAMPLE_BRIEF_TEMPLATE;
    },
    /**
     * Updates the temporary Leonardo API key input value.
     */
    setLeonardoApiKeyInput: (state, action: PayloadAction<string>) => {
      state.leonardoApiKeyInput = action.payload;
      state.leonardoValidationStatus = 'idle';
      state.leonardoValidationMessage = null;
    },
    /**
     * Updates the temporary Dropbox access token input value.
     */
    setDropboxAccessTokenInput: (state, action: PayloadAction<string>) => {
      state.dropboxAccessTokenInput = action.payload;
      state.dropboxValidationStatus = 'idle';
      state.dropboxValidationMessage = null;
    },
    /**
     * Marks the Leonardo API key validation as in-progress.
     */
    requestLeonardoValidation: (state) => {
      state.leonardoValidationStatus = 'pending';
      state.leonardoValidationMessage = null;
    },
    /**
     * Marks the Leonardo API key as successfully validated.
     */
    leonardoValidationSucceeded: (state) => {
      state.leonardoValidationStatus = 'success';
      state.leonardoValidationMessage = null;
    },
    /**
     * Rejects the Leonardo API key and records the error message.
     */
    leonardoValidationFailed: (state, action: PayloadAction<string>) => {
      state.leonardoValidationStatus = 'error';
      state.leonardoValidationMessage = action.payload;
    },
    /**
     * Marks the Dropbox access token validation as in-progress.
     */
    requestDropboxValidation: (state) => {
      state.dropboxValidationStatus = 'pending';
      state.dropboxValidationMessage = null;
    },
    /**
     * Marks the Dropbox access token as successfully validated.
     */
    dropboxValidationSucceeded: (state) => {
      state.dropboxValidationStatus = 'success';
      state.dropboxValidationMessage = null;
    },
    /**
     * Rejects the Dropbox access token and records the error message.
     */
    dropboxValidationFailed: (state, action: PayloadAction<string>) => {
      state.dropboxValidationStatus = 'error';
      state.dropboxValidationMessage = action.payload;
    },
    /**
     * Explicitly sets the elapsed processing time in seconds.
     */
    setElapsedSeconds: (state, action: PayloadAction<number>) => {
      state.elapsedSeconds = action.payload;
    },
    /**
     * Increments the processing timer by 1 second.
     */
    incrementElapsed: (state) => {
      state.elapsedSeconds += 1;
    },
    /**
     * Resets the processing timer to zero.
     */
    resetElapsed: (state) => {
      state.elapsedSeconds = 0;
    },
  },
});

/**
 * Redux action creators for the UI slice.
 */
export const {
  setLoading,
  setActiveModal,
  setCurrentPage,
  setBriefRawText,
  loadExampleBriefText,
  setLeonardoApiKeyInput,
  setDropboxAccessTokenInput,
  requestLeonardoValidation,
  leonardoValidationSucceeded,
  leonardoValidationFailed,
  requestDropboxValidation,
  dropboxValidationSucceeded,
  dropboxValidationFailed,
  setElapsedSeconds,
  incrementElapsed,
  resetElapsed,
} = uiSlice.actions;

export default uiSlice.reducer;
