// cypress/plugins/index.ts

/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */

 //results logging 
module.exports = (on, config) => {
    on('task', {
      log(message) {
        console.log(message)
   
        return null
      },
      table(message) {
        console.table(message)
   
        return null
      }
    })
  }