import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {
  ApplicationConfig,
  ErrorHandler,
  LOCALE_ID,
  provideZoneChangeDetection
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { intercepteurErreurs } from './coeur/intercepteurs/intercepteur-erreurs';
import { intercepteurJwt } from './coeur/intercepteurs/intercepteur-jwt';
import { GestionnaireErreurs } from './coeur/utilitaires/gestionnaire-erreurs';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: ErrorHandler, useClass: GestionnaireErreurs },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
      withPreloading(PreloadAllModules)
    ),
    provideHttpClient(withInterceptors([intercepteurJwt, intercepteurErreurs]))
  ]
};
