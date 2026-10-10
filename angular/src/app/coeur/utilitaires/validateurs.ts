import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


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
