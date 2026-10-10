import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BoiteConfirmation } from '../../../composants-partages/boite-confirmation/boite-confirmation.component';
import { Chargement } from '../../../composants-partages/chargement/chargement.component';
import { MessageErreur } from '../../../composants-partages/message-erreur/message-erreur.component';
import { Modale } from '../../../composants-partages/modale/modale.component';
import { Concours, Epreuve } from '../../../coeur/modeles';
import { ServiceConcours } from '../../../coeur/services/service-concours';
import { ServiceEpreuve } from '../../../coeur/services/service-epreuve';
import { messageErreur } from '../../../coeur/utilitaires/erreur-http.utils';

@Component({
  selector: 'app-gestion-epreuves',
  standalone: true,
  imports: [ReactiveFormsModule, Modale, BoiteConfirmation, Chargement, MessageErreur],
  templateUrl: './gestion-epreuves.component.html'
})
export class GestionEpreuves implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly serviceConcours = inject(ServiceConcours);
  private readonly serviceEpreuve = inject(ServiceEpreuve);
  private readonly route = inject(ActivatedRoute);

  readonly chargementConcours = signal(true);
  readonly erreurConcours = signal<string | null>(null);
  readonly concoursListe = signal<Concours[]>([]);
  readonly concoursSelectionne = signal<Concours | null>(null);

  readonly chargementEpreuves = signal(false);
  readonly erreurEpreuves = signal<string | null>(null);
  readonly epreuves = signal<Epreuve[]>([]);
  readonly notification = signal<string | null>(null);

  readonly verrouille = computed(() => this.concoursSelectionne()?.resultatsPublies === true);
  readonly totalCoefficients = computed(() =>
    this.epreuves().reduce((somme, e) => somme + e.coefficient, 0)
  );

  readonly creationOuverte = signal(false);
  readonly creationEnCours = signal(false);
  readonly erreurCreation = signal<string | null>(null);
  readonly formCreation = this.fb.nonNullable.group({
    intitule: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(1000)]],
    coefficient: [1, [Validators.required, Validators.min(0.01)]],
    dureeMinutes: [60, [Validators.required, Validators.min(1)]]
  });

  readonly epreuveEnEdition = signal<Epreuve | null>(null);
  readonly editionEnCours = signal(false);
  readonly erreurEdition = signal<string | null>(null);
  readonly formEdition = this.fb.nonNullable.group({
    intitule: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(1000)]],
    coefficient: [1, [Validators.required, Validators.min(0.01)]],
    dureeMinutes: [60, [Validators.required, Validators.min(1)]]
  });

  readonly epreuveASupprimer = signal<Epreuve | null>(null);
  readonly suppressionEnCours = signal(false);

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
    const concours = this.concoursListe().find((c) => c.id === id) ?? null;
    this.selectionnerConcours(concours);
  }

  private selectionnerConcours(concours: Concours | null): void {
    this.concoursSelectionne.set(concours);
    this.epreuves.set([]);
    this.notification.set(null);
    this.erreurEpreuves.set(null);
    if (concours) {
      this.chargerEpreuves(concours.id);
    }
  }

  chargerEpreuves(concoursId: number): void {
    this.chargementEpreuves.set(true);
    this.erreurEpreuves.set(null);
    this.serviceEpreuve.listerParConcours(concoursId).subscribe({
      next: (liste) => {
        this.epreuves.set(liste);
        this.chargementEpreuves.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.chargementEpreuves.set(false);
        this.erreurEpreuves.set(messageErreur(err));
      }
    });
  }

  estInvalideCreation(nom: string): boolean {
    const c = this.formCreation.get(nom);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  estInvalideEdition(nom: string): boolean {
    const c = this.formEdition.get(nom);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  ouvrirCreation(): void {
    this.formCreation.reset({ intitule: '', description: '', coefficient: 1, dureeMinutes: 60 });
    this.erreurCreation.set(null);
    this.creationOuverte.set(true);
  }

  fermerCreation(): void {
    this.creationOuverte.set(false);
  }

  soumettreCreation(): void {
    const concours = this.concoursSelectionne();
    if (!concours || this.creationEnCours()) {
      return;
    }
    if (this.formCreation.invalid) {
      this.formCreation.markAllAsTouched();
      return;
    }
    this.creationEnCours.set(true);
    this.erreurCreation.set(null);

    const v = this.formCreation.getRawValue();
    this.serviceEpreuve
      .creer({
        intitule: v.intitule.trim(),
        description: v.description.trim() || undefined,
        coefficient: v.coefficient,
        dureeMinutes: v.dureeMinutes,
        concoursId: concours.id
      })
      .subscribe({
        next: (creee) => {
          this.creationEnCours.set(false);
          this.epreuves.update((liste) => [...liste, creee]);
          this.creationOuverte.set(false);
          this.notification.set('Epreuve ajoutee.');
        },
        error: (err: HttpErrorResponse) => {
          this.creationEnCours.set(false);
          this.erreurCreation.set(messageErreur(err));
        }
      });
  }

  ouvrirEdition(e: Epreuve): void {
    this.formEdition.reset({
      intitule: e.intitule,
      description: e.description ?? '',
      coefficient: e.coefficient,
      dureeMinutes: e.dureeMinutes
    });
    this.erreurEdition.set(null);
    this.epreuveEnEdition.set(e);
  }

  fermerEdition(): void {
    this.epreuveEnEdition.set(null);
  }

  enregistrerEdition(): void {
    const e = this.epreuveEnEdition();
    if (!e || this.editionEnCours()) {
      return;
    }
    if (this.formEdition.invalid) {
      this.formEdition.markAllAsTouched();
      return;
    }
    this.editionEnCours.set(true);
    this.erreurEdition.set(null);

    const v = this.formEdition.getRawValue();
    this.serviceEpreuve
      .mettreAJour(e.id, {
        intitule: v.intitule.trim(),
        description: v.description.trim() || undefined,
        coefficient: v.coefficient,
        dureeMinutes: v.dureeMinutes
      })
      .subscribe({
        next: (maj) => {
          this.editionEnCours.set(false);
          this.epreuves.update((liste) => liste.map((x) => (x.id === e.id ? maj : x)));
          this.epreuveEnEdition.set(null);
          this.notification.set('Epreuve mise a jour.');
        },
        error: (err: HttpErrorResponse) => {
          this.editionEnCours.set(false);
          this.erreurEdition.set(messageErreur(err));
        }
      });
  }

  demanderSuppression(e: Epreuve): void {
    this.notification.set(null);
    this.epreuveASupprimer.set(e);
  }

  annulerSuppression(): void {
    this.epreuveASupprimer.set(null);
  }

  confirmerSuppression(): void {
    const e = this.epreuveASupprimer();
    if (!e || this.suppressionEnCours()) {
      return;
    }
    this.suppressionEnCours.set(true);
    this.serviceEpreuve.supprimer(e.id).subscribe({
      next: () => {
        this.suppressionEnCours.set(false);
        this.epreuves.update((liste) => liste.filter((x) => x.id !== e.id));
        this.epreuveASupprimer.set(null);
        this.notification.set('Epreuve supprimee.');
      },
      error: (err: HttpErrorResponse) => {
        this.suppressionEnCours.set(false);
        this.epreuveASupprimer.set(null);
        this.notification.set(messageErreur(err));
      }
    });
  }
}
