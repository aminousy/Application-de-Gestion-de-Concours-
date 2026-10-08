import { HttpErrorResponse } from '@angular/common/http';

import { erreursChamps, messageErreur } from './erreur-http.utils';

describe('erreur-http.utils', () => {
  it('privilegie le message du corps ReponseErreur', () => {
    const err = new HttpErrorResponse({
      status: 404,
      error: { statut: 404, message: 'Concours introuvable', date: '' }
    });
    expect(messageErreur(err)).toBe('Concours introuvable');
  });

  it('retourne un message par defaut selon le code HTTP', () => {
    const err = new HttpErrorResponse({ status: 403, error: null });
    expect(messageErreur(err)).toContain('droits');
  });

  it('retourne le message par defaut pour une erreur non HTTP', () => {
    expect(messageErreur('boom', 'defaut')).toBe('defaut');
  });

  it("extrait les erreurs de champ d'une reponse 400", () => {
    const err = new HttpErrorResponse({
      status: 400,
      error: {
        statut: 400,
        message: 'x',
        date: '',
        erreurs: [{ champ: 'titre', message: 'requis' }]
      }
    });
    expect(erreursChamps(err)).toEqual([{ champ: 'titre', message: 'requis' }]);
    expect(erreursChamps('autre')).toEqual([]);
  });
});
