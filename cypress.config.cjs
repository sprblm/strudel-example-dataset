const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');

const DEV_PORT_FILE = path.join(__dirname, '.temp/dev-server-port');

const ensureTrailingSlash = (value) =>
  value.endsWith('/') ? value : `${value}/`;

const readActiveDevPort = () => {
  try {
    if (!fs.existsSync(DEV_PORT_FILE)) {
      return undefined;
    }
    const rawValue = fs.readFileSync(DEV_PORT_FILE, 'utf8').trim();
    const parsed = Number(rawValue);
    if (Number.isNaN(parsed) || parsed <= 0) {
      return undefined;
    }
    return parsed;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      '[cypress.config] Unable to read dev server port file:',
      error
    );
    return undefined;
  }
};

const buildLocalhostUrl = (port) => ensureTrailingSlash(`http://localhost:${port}`);

const resolveBaseUrl = () => {
  const explicitBaseUrl = process.env.CYPRESS_BASE_URL;
  if (explicitBaseUrl) {
    return ensureTrailingSlash(explicitBaseUrl);
  }

  const detectedPort = readActiveDevPort();
  if (detectedPort) {
    return buildLocalhostUrl(detectedPort);
  }

  const preferredPort =
    process.env.VITE_DEV_SERVER_PORT ||
    process.env.DEV_SERVER_PORT ||
    process.env.PORT ||
    '5175';

  return buildLocalhostUrl(preferredPort);
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
