import { decoderJeton, estChargeExpiree } from './jeton.utils';

function base64Url(objet: object): string {
  return btoa(JSON.stringify(objet)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fabriquerJeton(charge: object): string {
  return `${base64Url({ alg: 'HS256' })}.${base64Url(charge)}.signature`;
}

describe('jeton.utils', () => {
  it("decode la charge utile d'un jeton bien forme", () => {
    const jeton = fabriquerJeton({ sub: 'awa@test.sn', role: 'ROLE_CANDIDAT', exp: 9999999999 });
    const charge = decoderJeton(jeton);

    expect(charge?.sub).toBe('awa@test.sn');
    expect(charge?.role).toBe('ROLE_CANDIDAT');
  });

  it('retourne null pour un jeton mal forme', () => {
    expect(decoderJeton('pas-un-jeton')).toBeNull();
    expect(decoderJeton('a.b')).toBeNull();
  });

  it('detecte une charge expiree', () => {
    expect(estChargeExpiree({ sub: 'x', role: 'y', exp: 1 })).toBeTrue();
    expect(estChargeExpiree({ sub: 'x', role: 'y', exp: 9999999999 })).toBeFalse();
    expect(estChargeExpiree(null)).toBeTrue();
    expect(estChargeExpiree({ sub: 'x', role: 'y' })).toBeTrue();
  });
});
