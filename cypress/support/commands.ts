/// <reference types="cypress" />
import "cypress-file-upload";
import { User } from "../model/user";
import { CreditCardFields } from "../model/creditCardFields";

var setCookie = require("set-cookie-parser");

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// in cypress/index.d.ts
// load type definitions that come with Cypress module

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Provides a working example
       */
      fillOutCreditCardForm(type: CreditCardFields, details: any): Cypress.Chainable<Element>;
      iframe(): Cypress.Chainable<Element>;
      signupViaAPI(user: User): Cypress.Chainable<Element>;
      signinViaAPI(
        username: string,
        password: string
      ): Cypress.Chainable<Element>;
      signoutViaAPI(): Cypress.Chainable<Element>;
    }
  }
}

function signupViaAPI(user: User): void {
  cy.request({ method: "GET", url: "/api/v1/current_user.json" }).then(
    (response) => {
      cy.request({
        method: "POST",
        url: "/api/v1/users/sign_up.json",
        body: {
          age_verified: true,
          enable_newsletter: true,
          user: { email: user.email, password: user.password },
        },
        headers: {
          "X-CSRF-Token": getHeaderAndSetCookies(
            setCookie.parse(response.headers["set-cookie"])
          ),
        },
      }).then((response) => {
        getHeaderAndSetCookies(setCookie.parse(response.headers["set-cookie"]));
      });
    }
  );
}

function getHeaderAndSetCookies(cookies) {
  var csrf_token: string;
  cookies.forEach((element: { name: string; value: string }) => {
    cy.setCookie(element.name, element.value);
    if (element.name === "csrf_token") {
      csrf_token = element.value;
    }
  });
  return csrf_token;
}

Cypress.Commands.add("signupViaAPI", signupViaAPI);

Cypress.Commands.add("signinViaAPI", (email, password) => {
  var csrf_token: string;
  //cy.visit('/')
  cy.request({ method: "GET", url: "/api/v1/current_user.json" }).then(
    (response) => {
      var cookies = setCookie.parse(response.headers["set-cookie"], {
        decodeValues: true,
      });

      cookies.forEach((element: { name: string; value: string }) => {
        cy.setCookie(element.name, element.value);
        if (element.name === "csrf_token") {
          csrf_token = element.value;
        }
      });
      cy.request({
        method: "POST",
        url: "/api/v1/users/sign_in.json",
        body: { user: { email: email, password: password } },
        headers: { "X-CSRF-Token": csrf_token },
      }).then((response) => {
        console.log(response);
        var cookies = setCookie.parse(response.headers["set-cookie"], {
          decodeValues: true,
        });

        cookies.forEach((element: { name: string; value: string }) => {
          cy.setCookie(element.name, element.value);
          if (element.name === "csrf_token") {
            csrf_token = element.value;
          }
        });
      });
    }
  );
});

Cypress.Commands.add("signoutViaAPI", (email, password) => {
  var setCookie = require("set-cookie-parser");
  var csrf_token: string;
  cy.request({ method: "DELETE", url: "/api/v1/users/sign_out.json" });
});

const isIframeLoaded = $iframe => {
 const contentWindow = $iframe.contentWindow;

 const src = $iframe.attributes.src;
 const href = contentWindow.location.href;
 if (contentWindow.document.readyState === 'complete') {
   return href !== 'about:blank' || src === 'about:blank' || src === '';
 }

 return false;
};

/**
* Wait for iframe to load, and call callback
*
* Some hints taken and adapted from:
* https://gitlab.com/kgroat/cypress-iframe/-/blob/master/src/index.ts
*/
Cypress.Commands.add('iframe', { prevSubject: 'element' }, $iframes => new Cypress.Promise(resolve => {
 const loaded = [];

 $iframes.each((_, $iframe) => {
   loaded.push(
     new Promise(subResolve => {
       if (isIframeLoaded($iframe)) {
         subResolve($iframe.contentDocument.body);
       } else {
         Cypress.$($iframe).on('load.appearHere', () => {
           if (isIframeLoaded($iframe)) {
             subResolve($iframe.contentDocument.body);
             Cypress.$($iframe).off('load.appearHere');
           }
         });
       }
     })
   );
 });

 return Promise.all(loaded).then(resolve);
}));

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
