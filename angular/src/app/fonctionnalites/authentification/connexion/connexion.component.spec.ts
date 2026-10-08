import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { Role } from '../../../coeur/modeles';
import { ServiceAuthentification } from '../../../coeur/services/service-authentification';
import { Connexion } from './connexion.component';

describe('Connexion', () => {
  let connexionSpy: jasmine.Spy;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    connexionSpy = jasmine.createSpy('connexion').and.returnValue(of({ role: Role.CANDIDAT }));
    navigateSpy = jasmine.createSpy('navigate');

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ServiceAuthentification,
          useValue: {
            estSessionActive: () => false,
            role: () => null,
            connexion: connexionSpy
          }
        },
        {
          provide: Router,
          useValue: { navigate: navigateSpy, navigateByUrl: jasmine.createSpy('navigateByUrl') }
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap({}) } }
        }
      ]
    });
  });

  function creer(): Connexion {
    return TestBed.runInInjectionContext(() => new Connexion());
  }

  it('ne soumet pas un formulaire invalide', () => {
    const composant = creer();
    composant.connexion();
    expect(connexionSpy).not.toHaveBeenCalled();
  });

  it('appelle le service avec un formulaire valide', () => {
    const composant = creer();
    composant.formulaire.setValue({ adresseEmail: 'awa@test.sn', motDePasse: 'motdepasse' });
    composant.connexion();

    expect(connexionSpy).toHaveBeenCalledWith({ email: 'awa@test.sn', motDePasse: 'motdepasse' });
    expect(navigateSpy).toHaveBeenCalledWith(['/candidat/tableau-de-bord']);
  });
});
