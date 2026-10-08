import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validateur de groupe : verifie que deux champs ont la meme valeur.
 * Ajoute l'erreur `correspondance` sur le groupe si elles different.
 */
export function validateurCorrespondance(
  nomChamp: string,
  nomChampConfirmation: string
): ValidatorFn {
  return (groupe: AbstractControl): ValidationErrors | null => {
    const valeur = groupe.get(nomChamp)?.value;
    const confirmation = groupe.get(nomChampConfirmation)?.value;
    if (valeur && confirmation && valeur !== confirmation) {
      return { correspondance: true };
    }
    return null;
  };
}

/**
 * Validateur de groupe : verifie que `nomApres` n'est pas anterieur a `nomAvant`.
 * Compare des chaines de date ISO ('AAAA-MM-JJ'). Ajoute l'erreur `ordreDates`.
 */
export function validateurOrdreDates(nomAvant: string, nomApres: string): ValidatorFn {
  return (groupe: AbstractControl): ValidationErrors | null => {
    const avant = groupe.get(nomAvant)?.value;
    const apres = groupe.get(nomApres)?.value;
    if (avant && apres && apres < avant) {
      return { ordreDates: true };
    }
    return null;
  };
}
