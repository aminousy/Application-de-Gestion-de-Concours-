import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BoiteConfirmation } from '../../../composants-partages/boite-confirmation/boite-confirmation.component';
import { Chargement } from '../../../composants-partages/chargement/chargement.component';
import { MessageErreur } from '../../../composants-partages/message-erreur/message-erreur.component';
import { Modale } from '../../../composants-partages/modale/modale.component';
import { Concours, Resultat } from '../../../coeur/modeles';
import { ServiceConcours } from '../../../coeur/services/service-concours';
import { ServiceResultat } from '../../../coeur/services/service-resultat';
import { messageErreur } from '../../../coeur/utilitaires/erreur-http.utils';

@Component({
  selector: 'app-gestion-resultats',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    ReactiveFormsModule,
    BoiteConfirmation,
    Chargement,
    MessageErreur,
    Modale
  ],
  templateUrl: './gestion-resultats.component.html'
})
export class GestionResultats implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly serviceConcours = inject(ServiceConcours);
  private readonly serviceResultat = inject(ServiceResultat);
  private readonly route = inject(ActivatedRoute);

  readonly chargementConcours = signal(true);
  readonly erreurConcours = signal<string | null>(null);
  readonly concoursListe = signal<Concours[]>([]);
  readonly concoursSelectionne = signal<Concours | null>(null);

  readonly chargementResultats = signal(false);
  readonly erreurResultats = signal<string | null>(null);
  readonly resultats = signal<Resultat[]>([]);

  readonly notification = signal<string | null>(null);
  readonly erreurAction = signal<string | null>(null);

  readonly calculEnCours = signal(false);
  readonly publicationEnCours = signal(false);
  readonly publicationDemandee = signal(false);

  readonly resultatEnDeliberation = signal<Resultat | null>(null);
  readonly deliberationEnCours = signal(false);
  readonly erreurDeliberation = signal<string | null>(null);
  readonly formDeliberation = this.fb.nonNullable.group({
    admis: [false],
    decision: ['', [Validators.maxLength(500)]]
  });

  readonly publie = computed(() => this.concoursSelectionne()?.resultatsPublies === true);

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
    this.resultats.set([]);
    this.notification.set(null);
    this.erreurAction.set(null);
    this.erreurResultats.set(null);
    if (concours) {
      this.chargerResultats(concours.id);
    }
  }

  chargerResultats(concoursId: number): void {
    this.chargementResultats.set(true);
    this.erreurResultats.set(null);
    this.serviceResultat.listerParConcours(concoursId).subscribe({
      next: (liste) => {
        this.resultats.set(liste);
        this.chargementResultats.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.chargementResultats.set(false);
        this.erreurResultats.set(messageErreur(err));
      }
    });
  }

  calculer(): void {
    const concours = this.concoursSelectionne();
    if (!concours || this.calculEnCours()) {
      return;
    }
    this.calculEnCours.set(true);
    this.erreurAction.set(null);
    this.notification.set(null);
    this.serviceResultat.calculerPourConcours(concours.id).subscribe({
      next: (liste) => {
        this.resultats.set(liste);
        this.calculEnCours.set(false);
        this.notification.set('Resultats calcules et classes.');
      },
      error: (err: HttpErrorResponse) => {
        this.calculEnCours.set(false);
        this.erreurAction.set(messageErreur(err));
      }
    });
  }

  demanderPublication(): void {
    this.erreurAction.set(null);
    this.publicationDemandee.set(true);
  }

  annulerPublication(): void {
    this.publicationDemandee.set(false);
  }

  confirmerPublication(): void {
    const concours = this.concoursSelectionne();
    if (!concours || this.publicationEnCours()) {
      return;
    }
    this.publicationEnCours.set(true);
    this.serviceResultat.publier(concours.id).subscribe({
      next: () => {
        this.publicationEnCours.set(false);
        this.publicationDemandee.set(false);
        const maj: Concours = {
          ...concours,
          resultatsPublies: true,
          datePublicationResultats: new Date().toISOString()
        };
        this.concoursSelectionne.set(maj);
        this.concoursListe.update((liste) => liste.map((c) => (c.id === maj.id ? maj : c)));
        this.notification.set(
          'Resultats publies. Les candidats peuvent desormais les consulter.'
        );
      },
      error: (err: HttpErrorResponse) => {
        this.publicationEnCours.set(false);
        this.publicationDemandee.set(false);
        this.erreurAction.set(messageErreur(err));
      }
    });
  }

  ouvrirDeliberation(r: Resultat): void {
    this.formDeliberation.reset({ admis: r.admis, decision: r.decision ?? '' });
    this.erreurDeliberation.set(null);
    this.resultatEnDeliberation.set(r);
  }

  fermerDeliberation(): void {
    this.resultatEnDeliberation.set(null);
  }

  enregistrerDeliberation(): void {
    const r = this.resultatEnDeliberation();
    if (!r || this.deliberationEnCours()) {
      return;
    }
    if (this.formDeliberation.invalid) {
      this.formDeliberation.markAllAsTouched();
      return;
    }
    this.deliberationEnCours.set(true);
    this.erreurDeliberation.set(null);
    const v = this.formDeliberation.getRawValue();
    this.serviceResultat
      .deliberer(r.candidatureId, { admis: v.admis, decision: v.decision.trim() || undefined })
      .subscribe({
        next: (maj) => {
          this.deliberationEnCours.set(false);
          this.resultats.update((liste) => liste.map((x) => (x.id === maj.id ? maj : x)));
          this.resultatEnDeliberation.set(null);
          this.notification.set('Deliberation enregistree.');
        },
        error: (err: HttpErrorResponse) => {
          this.deliberationEnCours.set(false);
          this.erreurDeliberation.set(messageErreur(err));
        }
      });
  }
}
