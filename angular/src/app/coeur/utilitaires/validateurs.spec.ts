import { FormControl, FormGroup } from '@angular/forms';

import { validateurCorrespondance, validateurOrdreDates } from './validateurs';

describe('validateurs', () => {
  it('validateurCorrespondance signale des valeurs differentes', () => {
    const groupe = new FormGroup(
      { mdp: new FormControl('abc'), confirmation: new FormControl('xyz') },
      { validators: validateurCorrespondance('mdp', 'confirmation') }
    );
    expect(groupe.hasError('correspondance')).toBeTrue();

    groupe.controls.confirmation.setValue('abc');
    expect(groupe.hasError('correspondance')).toBeFalse();
  });

  it('validateurOrdreDates signale une date de fin anterieure', () => {
    const groupe = new FormGroup(
      { debut: new FormControl('2026-06-01'), fin: new FormControl('2026-05-01') },
      { validators: validateurOrdreDates('debut', 'fin') }
    );
    expect(groupe.hasError('ordreDates')).toBeTrue();

    groupe.controls.fin.setValue('2026-07-01');
    expect(groupe.hasError('ordreDates')).toBeFalse();
  });
});
