
export interface ChargeJeton {
  sub: string;
  role: string;
  iss?: string;
  iat?: number;
  exp?: number;
}


export function decoderJeton(jeton: string): ChargeJeton | null {
  const segments = jeton.split('.');
  if (segments.length !== 3) {
    return null;
  }
  try {
    const base64 = segments[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((caractere) => '%' + ('00' + caractere.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json) as ChargeJeton;
  } catch {
    return null;
  }
}


export function estChargeExpiree(charge: ChargeJeton | null): boolean {
  if (!charge || typeof charge.exp !== 'number') {
    return true;
  }
  return charge.exp * 1000 <= Date.now();
}
