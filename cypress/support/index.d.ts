/// <reference types="cypress" />
/// <reference types="cypress-plugin-tab" />

declare namespace Cypress {
  interface Chainable {
    tab(options?: { shift?: boolean }): Chainable<JQuery<HTMLElement>>
  }
}
