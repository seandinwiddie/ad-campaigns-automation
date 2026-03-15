/**
 * Vitest setup configuration for Storybook portable stories.
 * Applies project-level annotations from Storybook preview and accessibility 
 * addons to ensure consistent behavior between the Storybook UI and Vitest tests.
 */
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from '@storybook/nextjs';
import * as projectAnnotations from './preview';

/**
 * Apply project annotations to global Vitest testing environment.
 * Documentation: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
 */
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);
