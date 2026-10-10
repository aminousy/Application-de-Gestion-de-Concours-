import { HttpErrorResponse } from '@angular/common/http';

import { ErreurChamp, ReponseErreur } from '../modeles';

const MESSAGES_PAR_STATUT: Record<number, string> = {
  0: 'Impossible de joindre le serveur. Verifiez votre connexion.',
  400: 'Les donnees envoyees sont invalides.',
  401: 'Identifiants invalides ou session expiree.',
  403: "Vous n'avez pas les droits necessaires pour cette action.",
  404: 'Ressource introuvable.',
  409: "Operation impossible : conflit avec l'etat actuel des donnees.",
  500: 'Une erreur interne est survenue. Reessayez plus tard.'
};


export function messageErreur(
  erreur: unknown,
  messageParDefaut = 'Une erreur est survenue.'
): string {
  if (!(erreur instanceof HttpErrorResponse)) {
    return messageParDefaut;
  }
  const corps = erreur.error as ReponseErreur | string | null;
  if (corps && typeof corps === 'object' && typeof corps.message === 'string') {
    return corps.message;
  }
  return MESSAGES_PAR_STATUT[erreur.status] ?? messageParDefaut;
}


export function erreursChamps(erreur: unknown): ErreurChamp[] {
  if (erreur instanceof HttpErrorResponse) {
    const corps = erreur.error as ReponseErreur | null;
    if (corps && Array.isArray(corps.erreurs)) {
      return corps.erreurs;
    }
  }
  return [];
}
