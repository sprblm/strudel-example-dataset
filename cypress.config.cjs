const { defineConfig } = require('cypress');

const resolveBaseUrl = () => {
  const explicitBaseUrl = process.env.CYPRESS_BASE_URL;
  if (explicitBaseUrl) {
    return explicitBaseUrl.endsWith('/')
      ? explicitBaseUrl
      : `${explicitBaseUrl}/`;
  }

  const preferredPort =
    process.env.VITE_DEV_SERVER_PORT ||
    process.env.DEV_SERVER_PORT ||
    process.env.PORT ||
    '5175';

  return `http://localhost:${preferredPort}/`;
};

module.exports = defineConfig({
  e2e: {
    baseUrl: resolveBaseUrl(),
    specPattern: [
      'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
      'src/**/*.cy.{js,jsx,ts,tsx}',
    ],
    setupNodeEvents(on) {
      on('task', {
        log(message) {
          // Using console methods in Cypress tasks is intentional
          // eslint-disable-next-line no-console
          console.log(message);
          return null;
        },
      });
    },
  },
});
