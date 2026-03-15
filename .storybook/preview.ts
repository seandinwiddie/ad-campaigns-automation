/**
 * Storybook preview configuration.
 * Configures global decorators, parameters, and UI controls for component stories.
 */
import type { Preview } from "@storybook/nextjs";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },

    a11y: {
      test: "error",
    },
    layout: 'centered',
  },
};

export default preview;
