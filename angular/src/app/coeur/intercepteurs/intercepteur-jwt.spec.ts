import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { ServiceAuthentification } from '../services/service-authentification';
import { intercepteurJwt } from './intercepteur-jwt';

describe('intercepteurJwt', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let deconnexion: jasmine.Spy;

  beforeEach(() => {
    deconnexion = jasmine.createSpy('deconnexion');
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([intercepteurJwt])),
        provideHttpClientTesting(),
        { provide: ServiceAuthentification, useValue: { jeton: () => 'MON_JETON', deconnexion } }
      ]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it("ajoute l'en-tete Authorization aux requetes API", () => {
    http.get(`${environment.urlApi}/concours`).subscribe();
    const requete = httpMock.expectOne(`${environment.urlApi}/concours`);
    expect(requete.request.headers.get('Authorization')).toBe('Bearer MON_JETON');
    requete.flush([]);
  });

  it("n'ajoute pas l'en-tete aux requetes d'authentification", () => {
    http.post(`${environment.urlApi}/authentification/connexion`, {}).subscribe();
    const requete = httpMock.expectOne(`${environment.urlApi}/authentification/connexion`);
    expect(requete.request.headers.has('Authorization')).toBeFalse();
    requete.flush({});
  });

  it('declenche la deconnexion sur une reponse 401', () => {
    http.get(`${environment.urlApi}/concours`).subscribe({ error: () => undefined });
    httpMock
      .expectOne(`${environment.urlApi}/concours`)
      .flush('Non autorise', { status: 401, statusText: 'Unauthorized' });
    expect(deconnexion).toHaveBeenCalled();
  });
});
