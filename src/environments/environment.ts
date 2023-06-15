// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL:'https://da-app.creditenable.com/api/',
  clientId: "14f23fd4-f067-4613-ab4f-599cc22988ea",
  tenantId: "b5242107-a98d-44a5-a3df-5063c58f0d57",
  redirectURI: 'http://localhost:17836/',
  postLogoutRedirectUri: "http://localhost:17836/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
