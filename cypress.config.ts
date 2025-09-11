import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5175/',
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
