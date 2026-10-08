import { Component, Input } from '@angular/core';

import { StatutCandidature } from '../../coeur/modeles';
import {
  CLASSE_BADGE_STATUT_CANDIDATURE,
  LIBELLE_STATUT_CANDIDATURE
} from '../../coeur/utilitaires/libelles';

@Component({
  selector: 'app-badge-statut',
  standalone: true,
  template: `<span class="badge {{ classe }}">{{ libelle }}</span>`
})
export class BadgeStatut {
  libelle = '';
  classe = 'text-bg-secondary';

  @Input({ required: true })
  set statut(valeur: StatutCandidature) {
    this.libelle = LIBELLE_STATUT_CANDIDATURE[valeur] ?? valeur;
    this.classe = CLASSE_BADGE_STATUT_CANDIDATURE[valeur] ?? 'text-bg-secondary';
  }
}
