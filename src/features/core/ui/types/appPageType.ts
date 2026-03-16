/**
 * The primary screens available in the single-page application.
 * This union constrains navigation to the known top-level views used during setup,
 * campaign authoring, pipeline execution, and result review.
 *
 * **User Story:**
 * - As a user moving through the application, I want navigation limited to the supported screens
 *   so every route transition lands on a valid part of the workflow.
 */
export type AppPage = 'settings' | 'home' | 'pipeline' | 'results';
