import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { Role } from '../modeles';
import { ServiceAuthentification } from '../services/service-authentification';
import { gardeRole } from './garde-role';

describe('gardeRole', () => {
  function configurer(session: boolean, role: Role | null): Router {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ServiceAuthentification,
          useValue: { estSessionActive: () => session, role: () => role }
        },
        {
          provide: Router,
          useValue: {
            createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue('URLTREE')
          }
        }
      ]
    });
    return TestBed.inject(Router);
  }

  const routeVide = {} as ActivatedRouteSnapshot;
  const etat = { url: '/administration' } as RouterStateSnapshot;

  it('autorise si le role correspond', () => {
    configurer(true, Role.ADMIN);
    const resultat = TestBed.runInInjectionContext(() =>
      gardeRole(Role.ADMIN)(routeVide, etat)
    );
    expect(resultat).toBeTrue();
  });

  it('redirige si le role ne correspond pas', () => {
    const router = configurer(true, Role.CANDIDAT);
    TestBed.runInInjectionContext(() => gardeRole(Role.ADMIN)(routeVide, etat));
    expect(router.createUrlTree).toHaveBeenCalled();
  });

  it('redirige vers /connexion si non connecte', () => {
    const router = configurer(false, null);
    TestBed.runInInjectionContext(() => gardeRole(Role.ADMIN)(routeVide, etat));
    expect(router.createUrlTree).toHaveBeenCalledWith(
      ['/connexion'],
      jasmine.objectContaining({ queryParams: { retour: '/administration' } })
    );
  });
});
