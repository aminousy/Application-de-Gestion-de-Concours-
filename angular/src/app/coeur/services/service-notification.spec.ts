import { fakeAsync, tick } from '@angular/core/testing';

import { ServiceNotification } from './service-notification';

describe('ServiceNotification', () => {
  it('ajoute puis ferme une notification', () => {
    const service = new ServiceNotification();
    service.succes('Enregistre');

    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].type).toBe('succes');

    service.fermer(service.notifications()[0].id);
    expect(service.notifications().length).toBe(0);
  });

  it('ferme automatiquement apres 5 secondes', fakeAsync(() => {
    const service = new ServiceNotification();
    service.erreur('Oups');
    expect(service.notifications().length).toBe(1);

    tick(5000);
    expect(service.notifications().length).toBe(0);
  }));
});
