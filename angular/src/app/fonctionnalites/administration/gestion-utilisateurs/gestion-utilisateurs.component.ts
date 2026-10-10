import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, forkJoin, switchMap } from 'rxjs';

import { BoiteConfirmation } from '../../../composants-partages/boite-confirmation/boite-confirmation.component';
import { Chargement } from '../../../composants-partages/chargement/chargement.component';
import { MessageErreur } from '../../../composants-partages/message-erreur/message-erreur.component';
import { Modale } from '../../../composants-partages/modale/modale.component';
import { Role, Utilisateur } from '../../../coeur/modeles';
import { ServiceAuthentification } from '../../../coeur/services/service-authentification';
import { ServiceUtilisateur } from '../../../coeur/services/service-utilisateur';
import { messageErreur } from '../../../coeur/utilitaires/erreur-http.utils';
import { LIBELLE_ROLE, ROLES } from '../../../coeur/utilitaires/libelles';

@Component({
  selector: 'app-gestion-utilisateurs',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, Modale, BoiteConfirmation, Chargement, MessageErreur],
  templateUrl: './gestion-utilisateurs.component.html'
})
export class GestionUtilisateurs implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ServiceUtilisateur);
  private readonly servAuth = inject(ServiceAuthentification);

  readonly roles = ROLES;
  readonly libelleRole = LIBELLE_ROLE;

  readonly chargement = signal(true);
  readonly erreur = signal<string | null>(null);
  readonly notification = signal<string | null>(null);
  readonly utilisateurs = signal<Utilisateur[]>([]);
  readonly recherche = signal('');
  readonly filtreRole = signal<'' | Role>('');

  readonly utilisateursAffiches = computed(() => {
    const terme = this.recherche().toLowerCase().trim();
    const role = this.filtreRole();
    return this.utilisateurs().filter((u) => {
      const okRole = !role || u.role === role;
      const okTerme =
        !terme || `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(terme);
      return okRole && okTerme;
    });
  });

  readonly creationOuverte = signal(false);
  readonly creationEnCours = signal(false);
  readonly erreurCreation = signal<string | null>(null);
  readonly formCreation = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.maxLength(100)]],
    prenom: ['', [Validators.required, Validators.maxLength(100)]],
    adresseEmail: ['', [Validators.required, Validators.email, Validators.maxLength(180)]],
    numeroTelephone: ['', [Validators.maxLength(30)]],
    motDePasse: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
    role: [Role.CANDIDAT as Role, [Validators.required]]
  });

  readonly utilisateurEnEdition = signal<Utilisateur | null>(null);
  readonly editionEnCours = signal(false);
  readonly erreurEdition = signal<string | null>(null);
  readonly formEdition = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.maxLength(100)]],
    prenom: ['', [Validators.required, Validators.maxLength(100)]],
    numeroTelephone: ['', [Validators.maxLength(30)]],
    role: [Role.CANDIDAT as Role, [Validators.required]],
    actif: [true]
  });

  readonly utilisateurASupprimer = signal<Utilisateur | null>(null);
  readonly suppressionEnCours = signal(false);

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement.set(true);
    this.erreur.set(null);
    this.service.listerTous().subscribe({
      next: (liste) => {
        this.utilisateurs.set(liste);
        this.chargement.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.chargement.set(false);
        this.erreur.set(messageErreur(err));
      }
    });
  }

  estMoi(u: Utilisateur): boolean {
    return this.servAuth.utilisateurConnecte()?.email === u.email;
  }

  majRecherche(valeur: string): void {
    this.recherche.set(valeur);
  }

  majFiltreRole(valeur: string): void {
    this.filtreRole.set(valeur as '' | Role);
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
    this.formCreation.reset({
      nom: '',
      prenom: '',
      adresseEmail: '',
      numeroTelephone: '',
      motDePasse: '',
      role: Role.CANDIDAT
    });
    this.erreurCreation.set(null);
    this.creationOuverte.set(true);
  }

  fermerCreation(): void {
    this.creationOuverte.set(false);
  }

  soumettreCreation(): void {
    if (this.creationEnCours()) {
      return;
    }
    if (this.formCreation.invalid) {
      this.formCreation.markAllAsTouched();
      return;
    }
    this.creationEnCours.set(true);
    this.erreurCreation.set(null);

    const v = this.formCreation.getRawValue();
    this.service
      .creer({
        nom: v.nom.trim(),
        prenom: v.prenom.trim(),
        email: v.adresseEmail.trim(),
        motDePasse: v.motDePasse,
        telephone: v.numeroTelephone.trim() || undefined,
        role: v.role
      })
      .subscribe({
        next: (cree) => {
          this.creationEnCours.set(false);
          this.utilisateurs.update((liste) => [cree, ...liste]);
          this.creationOuverte.set(false);
          this.notification.set('Utilisateur cree.');
        },
        error: (err: HttpErrorResponse) => {
          this.creationEnCours.set(false);
          this.erreurCreation.set(messageErreur(err));
        }
      });
  }

  ouvrirEdition(u: Utilisateur): void {
    this.formEdition.reset({
      nom: u.nom,
      prenom: u.prenom,
      numeroTelephone: u.telephone ?? '',
      role: u.role,
      actif: u.actif
    });
    if (this.estMoi(u)) {
      this.formEdition.controls.role.disable();
      this.formEdition.controls.actif.disable();
    } else {
      this.formEdition.controls.role.enable();
      this.formEdition.controls.actif.enable();
    }
    this.erreurEdition.set(null);
    this.utilisateurEnEdition.set(u);
  }

  fermerEdition(): void {
    this.utilisateurEnEdition.set(null);
  }

  enregistrerEdition(): void {
    const u = this.utilisateurEnEdition();
    if (!u || this.editionEnCours()) {
      return;
    }
    if (this.formEdition.invalid) {
      this.formEdition.markAllAsTouched();
      return;
    }

    const v = this.formEdition.getRawValue();
    const telephone = v.numeroTelephone.trim() || null;
    const appels: Observable<Utilisateur>[] = [];

    if (v.nom.trim() !== u.nom || v.prenom.trim() !== u.prenom || telephone !== u.telephone) {
      appels.push(
        this.service.mettreAJour(u.id, {
          nom: v.nom.trim(),
          prenom: v.prenom.trim(),
          telephone: telephone ?? undefined
        })
      );
    }
    if (!this.estMoi(u) && (v.role !== u.role || v.actif !== u.actif)) {
      appels.push(this.service.administrer(u.id, { role: v.role, actif: v.actif }));
    }

    if (appels.length === 0) {
      this.fermerEdition();
      return;
    }

    this.editionEnCours.set(true);
    this.erreurEdition.set(null);
    forkJoin(appels)
      .pipe(switchMap(() => this.service.obtenirParId(u.id)))
      .subscribe({
        next: (frais) => {
          this.editionEnCours.set(false);
          this.utilisateurs.update((liste) => liste.map((x) => (x.id === u.id ? frais : x)));
          this.fermerEdition();
          this.notification.set('Utilisateur mis a jour.');
        },
        error: (err: HttpErrorResponse) => {
          this.editionEnCours.set(false);
          this.erreurEdition.set(messageErreur(err));
        }
      });
  }

  demanderSuppression(u: Utilisateur): void {
    this.notification.set(null);
    this.utilisateurASupprimer.set(u);
  }

  annulerSuppression(): void {
    this.utilisateurASupprimer.set(null);
  }

  confirmerSuppression(): void {
    const u = this.utilisateurASupprimer();
    if (!u || this.suppressionEnCours()) {
      return;
    }
    this.suppressionEnCours.set(true);
    this.service.supprimer(u.id).subscribe({
      next: () => {
        this.suppressionEnCours.set(false);
        this.utilisateurs.update((liste) => liste.filter((x) => x.id !== u.id));
        this.utilisateurASupprimer.set(null);
        this.notification.set('Utilisateur supprime.');
      },
      error: (err: HttpErrorResponse) => {
        this.suppressionEnCours.set(false);
        this.utilisateurASupprimer.set(null);
        this.notification.set(messageErreur(err));
      }
    });
  }
}
