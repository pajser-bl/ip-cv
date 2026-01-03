import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideKeycloak} from 'keycloak-angular';

import {routes} from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideKeycloak({
      config: {
        url: '${KEYCLOAK_URL}',
        realm: '${KEYCLOAK_REALM}',
        clientId: '${KEYCLOAK_CLIENT_ID}',
      },
      initOptions: {
        onLoad: 'login-required',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
      }
    })
  ]
};
