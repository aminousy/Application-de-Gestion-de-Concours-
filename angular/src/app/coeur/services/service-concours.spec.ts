import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ServiceConcours } from './service-concours';

describe('ServiceConcours', () => {
  let service: ServiceConcours;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceConcours, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ServiceConcours);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('listerOuverts fait un GET sur /concours/ouverts', () => {
    service.listerOuverts().subscribe();
    const requete = httpMock.expectOne((r) => r.url.endsWith('/concours/ouverts'));
    expect(requete.request.method).toBe('GET');
    requete.flush([]);
  });

  it('definirOuverture fait un PATCH avec le parametre ouvert', () => {
    service.definirOuverture(5, true).subscribe();
    const requete = httpMock.expectOne((r) => r.url.endsWith('/concours/5/ouverture'));
    expect(requete.request.method).toBe('PATCH');
    expect(requete.request.params.get('ouvert')).toBe('true');
    requete.flush({});
  });

  it('supprimer fait un DELETE sur /concours/{id}', () => {
    service.supprimer(9).subscribe();
    const requete = httpMock.expectOne((r) => r.url.endsWith('/concours/9'));
    expect(requete.request.method).toBe('DELETE');
    requete.flush(null);
  });
});
