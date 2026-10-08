import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BadgeStatut } from '../../../composants-partages/badge-statut/badge-statut.component';
import { Chargement } from '../../../composants-partages/chargement/chargement.component';
import { MessageErreur } from '../../../composants-partages/message-erreur/message-erreur.component';
import { Candidature, Note } from '../../../coeur/modeles';
import { ServiceCandidature } from '../../../coeur/services/service-candidature';
import { ServiceNote } from '../../../coeur/services/service-note';
import { messageErreur } from '../../../coeur/utilitaires/erreur-http.utils';

@Component({
  selector: 'app-detail-candidature',
  standalone: true,
  imports: [DatePipe, RouterLink, BadgeStatut, Chargement, MessageErreur],
  templateUrl: './detail-candidature.component.html'
})
export class DetailCandidature {
  private readonly serviceCandidature = inject(ServiceCandidature);
  private readonly serviceNote = inject(ServiceNote);

  readonly chargement = signal(true);
  readonly erreur = signal<string | null>(null);
  readonly introuvable = signal(false);

  readonly candidature = signal<Candidature | null>(null);
  readonly notes = signal<Note[]>([]);
  readonly chargementNotes = signal(false);

  private idCourant = 0;

  @Input()
  set identifiant(valeur: string) {
    const id = Number(valeur);
    if (!Number.isInteger(id) || id <= 0) {
      this.chargement.set(false);
      this.introuvable.set(true);
      return;
    }
    this.idCourant = id;
    this.charger(id);
  }

  charger(id = this.idCourant): void {
    this.chargement.set(true);
    this.erreur.set(null);
    this.introuvable.set(false);

    this.serviceCandidature.obtenirParId(id).subscribe({
      next: (candidature) => {
        this.candidature.set(candidature);
        this.chargement.set(false);
        this.chargerNotes(id);
      },
      error: (err: HttpErrorResponse) => {
        this.chargement.set(false);
        if (err.status === 404 || err.status === 403) {
          this.introuvable.set(true);
        } else {
          this.erreur.set(messageErreur(err));
        }
      }
    });
  }

  private chargerNotes(id: number): void {
    this.chargementNotes.set(true);
    this.serviceNote.listerParCandidature(id).subscribe({
      next: (notes) => {
        this.notes.set(notes);
        this.chargementNotes.set(false);
      },
      error: () => {
        this.notes.set([]);
        this.chargementNotes.set(false);
      }
    });
  }
}
