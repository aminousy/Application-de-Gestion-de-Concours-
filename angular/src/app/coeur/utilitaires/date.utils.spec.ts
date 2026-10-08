import { estDatePassee } from './date.utils';

describe('date.utils - estDatePassee', () => {
  it('retourne true pour une date passee', () => {
    expect(estDatePassee('2000-01-01')).toBeTrue();
  });

  it('retourne false pour une date future', () => {
    expect(estDatePassee('2999-01-01')).toBeFalse();
  });

  it('retourne false pour une valeur nulle ou invalide', () => {
    expect(estDatePassee(null)).toBeFalse();
    expect(estDatePassee('pas-une-date')).toBeFalse();
  });
});
