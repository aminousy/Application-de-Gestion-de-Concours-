import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { Role } from '../modeles';
import { ServiceAuthentification } from '../services/service-authentification';


export function gardeRole(roleRequis: Role): CanActivateFn {
  return (_route, etat): boolean | UrlTree => {
    const servAuth = inject(ServiceAuthentification);
    const router = inject(Router);

    if (!servAuth.estSessionActive()) {
      return router.createUrlTree(['/connexion'], { queryParams: { retour: etat.url } });
    }
    if (servAuth.role() === roleRequis) {
      return true;
    }
    return router.createUrlTree([cheminAccueilSelonRole(servAuth.role())]);
  };
}

function cheminAccueilSelonRole(role: Role | null): string {
  switch (role) {
    case Role.ADMIN:
      return '/administration/tableau-de-bord';
    case Role.CANDIDAT:
      return '/candidat/tableau-de-bord';
    default:
      return '/';
  }
}
