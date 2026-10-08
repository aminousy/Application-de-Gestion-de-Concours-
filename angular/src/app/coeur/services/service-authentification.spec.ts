import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { Role } from '../modeles';
import { ServiceAuthentification } from './service-authentification';

function base64Url(objet: object): string {
  return btoa(JSON.stringify(objet)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fabriquerJeton(role: Role): string {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  return `${base64Url({ alg: 'HS256' })}.${base64Url({ sub: 'awa@test.sn', role, exp })}.sig`;
}

describe('ServiceAuthentification', () => {
  let service: ServiceAuthentification;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        ServiceAuthentification,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    });
    service = TestBed.inject(ServiceAuthentification);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it("connecte l'utilisateur et enregistre la session", () => {
    service.connexion({ email: 'awa@test.sn', motDePasse: 'x' }).subscribe();

    const requete = httpMock.expectOne((r) => r.url.endsWith('/authentification/connexion'));
    expect(requete.request.method).toBe('POST');
    requete.flush({
      token: fabriquerJeton(Role.CANDIDAT),
      typeToken: 'Bearer',
      email: 'awa@test.sn',
      role: Role.CANDIDAT,
      dureeValiditeMs: 3600000
    });

    expect(service.estAuthentifie()).toBeTrue();
    expect(service.role()).toBe(Role.CANDIDAT);
    expect(service.jeton()).not.toBeNull();
  });

  it('deconnecte et purge la session', () => {
    service.connexion({ email: 'a', motDePasse: 'b' }).subscribe();
    httpMock.expectOne((r) => r.url.endsWith('/authentification/connexion')).flush({
      token: fabriquerJeton(Role.ADMIN),
      typeToken: 'Bearer',
      email: 'awa@test.sn',
      role: Role.ADMIN,
      dureeValiditeMs: 3600000
    });

    service.deconnexion(false);

    expect(service.estAuthentifie()).toBeFalse();
    expect(service.jeton()).toBeNull();
    expect(service.estSessionActive()).toBeFalse();
  });
});
