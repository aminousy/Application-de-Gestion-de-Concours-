import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BadgeStatut } from '../../../composants-partages/badge-statut/badge-statut.component';
import { BoiteConfirmation } from '../../../composants-partages/boite-confirmation/boite-confirmation.component';
import { Chargement } from '../../../composants-partages/chargement/chargement.component';
import { MessageErreur } from '../../../composants-partages/message-erreur/message-erreur.component';
import { Modale } from '../../../composants-partages/modale/modale.component';
import { Candidature, Concours, Note, StatutCandidature } from '../../../coeur/modeles';
import { ServiceCandidature } from '../../../coeur/services/service-candidature';
import { ServiceConcours } from '../../../coeur/services/service-concours';
import { ServiceNote } from '../../../coeur/services/service-note';
import { messageErreur } from '../../../coeur/utilitaires/erreur-http.utils';
import { LIBELLE_STATUT_CANDIDATURE, STATUTS_CANDIDATURE } from '../../../coeur/utilitaires/libelles';

@Component({
  selector: 'app-gestion-candidatures',
  standalone: true,
  imports: [DatePipe, BadgeStatut, BoiteConfirmation, Chargement, MessageErreur, Modale],
  templateUrl: './gestion-candidatures.component.html'
})
export class GestionCandidatures implements OnInit {
  private readonly serviceConcours = inject(ServiceConcours);
  private readonly serviceCandidature = inject(ServiceCandidature);
  private readonly serviceNote = inject(ServiceNote);
  private readonly route = inject(ActivatedRoute);

  readonly statuts = STATUTS_CANDIDATURE;
  readonly libelleStatut = LIBELLE_STATUT_CANDIDATURE;

  readonly chargementConcours = signal(true);
  readonly erreurConcours = signal<string | null>(null);
  readonly concoursListe = signal<Concours[]>([]);
  readonly concoursSelectionne = signal<Concours | null>(null);

  readonly filtreStatut = signal<'' | StatutCandidature>('');
  readonly chargementCandidatures = signal(false);
  readonly erreurCandidatures = signal<string | null>(null);
  readonly candidatures = signal<Candidature[]>([]);
  readonly notification = signal<string | null>(null);

  readonly candidatureStatut = signal<Candidature | null>(null);
  readonly nouveauStatut = signal<StatutCandidature>(StatutCandidature.EN_ATTENTE);
  readonly statutEnCours = signal(false);
  readonly erreurStatut = signal<string | null>(null);

  readonly dossierAffiche = signal<Candidature | null>(null);
  readonly notesDossier = signal<Note[]>([]);
  readonly chargementNotes = signal(false);

  readonly candidatureASupprimer = signal<Candidature | null>(null);
  readonly suppressionEnCours = signal(false);

  /** Incremente a chaque chargement : permet d'ignorer les reponses obsoletes. */
  private jetonChargement = 0;

  ngOnInit(): void {
    this.serviceConcours.listerTous().subscribe({
      next: (liste) => {
        this.concoursListe.set(liste);
        this.chargementConcours.set(false);
        const parametre = this.route.snapshot.queryParamMap.get('concoursId');
        const preselection = parametre ? Number(parametre) : 0;
        const trouve = liste.find((c) => c.id === preselection);
        if (trouve) {
          this.selectionnerConcours(trouve);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.chargementConcours.set(false);
        this.erreurConcours.set(messageErreur(err));
      }
    });
  }

  selectionnerConcoursParId(valeur: string): void {
    const id = Number(valeur);
    this.selectionnerConcours(this.concoursListe().find((c) => c.id === id) ?? null);
  }

  private selectionnerConcours(concours: Concours | null): void {
    this.concoursSelectionne.set(concours);
    this.filtreStatut.set('');
    this.candidatures.set([]);
    this.notification.set(null);
    this.erreurCandidatures.set(null);
    if (concours) {
      this.chargerCandidatures();
    }
  }

  majFiltreStatut(valeur: string): void {
    this.filtreStatut.set(valeur as '' | StatutCandidature);
    if (this.concoursSelectionne()) {
      this.chargerCandidatures();
    }
  }

  chargerCandidatures(): void {
    const concours = this.concoursSelectionne();
    if (!concours) {
      return;
    }
    const jeton = ++this.jetonChargement;
    this.chargementCandidatures.set(true);
    this.erreurCandidatures.set(null);
    const statut = this.filtreStatut() || undefined;
    this.serviceCandidature.listerParConcours(concours.id, statut).subscribe({
      next: (liste) => {
        if (jeton !== this.jetonChargement) {
          return;
        }
        this.candidatures.set(liste);
        this.chargementCandidatures.set(false);
      },
      error: (err: HttpErrorResponse) => {
        if (jeton !== this.jetonChargement) {
          return;
        }
        this.chargementCandidatures.set(false);
        this.erreurCandidatures.set(messageErreur(err));
      }
    });
  }

  // --- Statut ---
  ouvrirStatut(candidature: Candidature): void {
    this.nouveauStatut.set(candidature.statut);
    this.erreurStatut.set(null);
    this.candidatureStatut.set(candidature);
  }

  fermerStatut(): void {
    this.candidatureStatut.set(null);
  }

  majNouveauStatut(valeur: string): void {
    this.nouveauStatut.set(valeur as StatutCandidature);
  }

  confirmerStatut(): void {
    const candidature = this.candidatureStatut();
    if (!candidature || this.statutEnCours()) {
      return;
    }
    if (this.nouveauStatut() === candidature.statut) {
      this.fermerStatut();
      return;
    }
    this.statutEnCours.set(true);
    this.erreurStatut.set(null);
    this.serviceCandidature
      .changerStatut(candidature.id, { statut: this.nouveauStatut() })
      .subscribe({
        next: (maj) => {
          this.statutEnCours.set(false);
          this.candidatures.update((liste) => liste.map((c) => (c.id === maj.id ? maj : c)));
          this.fermerStatut();
          this.notification.set('Statut mis a jour.');
        },
        error: (err: HttpErrorResponse) => {
          this.statutEnCours.set(false);
          this.erreurStatut.set(messageErreur(err));
        }
      });
  }

  // --- Dossier ---
  ouvrirDossier(candidature: Candidature): void {
    this.dossierAffiche.set(candidature);
    this.notesDossier.set([]);
    this.chargementNotes.set(true);
    this.serviceNote.listerParCandidature(candidature.id).subscribe({
      next: (notes) => {
        this.notesDossier.set(notes);
        this.chargementNotes.set(false);
      },
      error: () => {
        this.notesDossier.set([]);
        this.chargementNotes.set(false);
      }
    });
  }

  fermerDossier(): void {
    this.dossierAffiche.set(null);
  }

  // --- Suppression ---
  demanderSuppression(candidature: Candidature): void {
    this.notification.set(null);
    this.candidatureASupprimer.set(candidature);
  }

  annulerSuppression(): void {
    this.candidatureASupprimer.set(null);
  }

  confirmerSuppression(): void {
    const candidature = this.candidatureASupprimer();
    if (!candidature || this.suppressionEnCours()) {
      return;
    }
    this.suppressionEnCours.set(true);
    this.serviceCandidature.supprimer(candidature.id).subscribe({
      next: () => {
        this.suppressionEnCours.set(false);
        this.candidatures.update((liste) => liste.filter((c) => c.id !== candidature.id));
        this.candidatureASupprimer.set(null);
        this.notification.set('Candidature supprimee.');
      },
      error: (err: HttpErrorResponse) => {
        this.suppressionEnCours.set(false);
        this.candidatureASupprimer.set(null);
        this.notification.set(messageErreur(err));
      }
    });
  }
}
