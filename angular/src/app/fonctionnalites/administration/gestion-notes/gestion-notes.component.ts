import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';

import { Chargement } from '../../../composants-partages/chargement/chargement.component';
import { MessageErreur } from '../../../composants-partages/message-erreur/message-erreur.component';
import { Candidature, Concours, Epreuve, Note } from '../../../coeur/modeles';
import { ServiceCandidature } from '../../../coeur/services/service-candidature';
import { ServiceConcours } from '../../../coeur/services/service-concours';
import { ServiceEpreuve } from '../../../coeur/services/service-epreuve';
import { ServiceNote } from '../../../coeur/services/service-note';
import { messageErreur } from '../../../coeur/utilitaires/erreur-http.utils';

@Component({
  selector: 'app-gestion-notes',
  standalone: true,
  imports: [Chargement, MessageErreur],
  templateUrl: './gestion-notes.component.html'
})
export class GestionNotes implements OnInit {
  private readonly serviceConcours = inject(ServiceConcours);
  private readonly serviceEpreuve = inject(ServiceEpreuve);
  private readonly serviceCandidature = inject(ServiceCandidature);
  private readonly serviceNote = inject(ServiceNote);
  private readonly route = inject(ActivatedRoute);

  readonly chargementConcours = signal(true);
  readonly erreurConcours = signal<string | null>(null);
  readonly concoursListe = signal<Concours[]>([]);
  readonly concoursSelectionne = signal<Concours | null>(null);

  readonly chargementDonnees = signal(false);
  readonly erreurDonnees = signal<string | null>(null);
  readonly epreuves = signal<Epreuve[]>([]);
  readonly candidatures = signal<Candidature[]>([]);
  readonly notesParCandidature = signal<Map<number, Note[]>>(new Map());

  readonly epreuveSelectionneeId = signal<number | ''>('');
  readonly epreuveSelectionnee = computed(
    () => this.epreuves().find((e) => e.id === this.epreuveSelectionneeId()) ?? null
  );

  readonly verrouille = computed(() => this.concoursSelectionne()?.resultatsPublies === true);

  readonly saisies = signal<Record<number, string>>({});
  readonly erreurLigne = signal<Record<number, string>>({});
  readonly ligneEnCours = signal<number | null>(null);
  readonly notification = signal<string | null>(null);

  readonly nbNotesSaisies = computed(() => {
    const epreuveId = this.epreuveSelectionneeId();
    if (!epreuveId) {
      return 0;
    }
    return this.candidatures().filter((c) =>
      (this.notesParCandidature().get(c.id) ?? []).some((n) => n.epreuveId === epreuveId)
    ).length;
  });

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
    this.epreuves.set([]);
    this.candidatures.set([]);
    this.notesParCandidature.set(new Map());
    this.epreuveSelectionneeId.set('');
    this.saisies.set({});
    this.erreurLigne.set({});
    this.notification.set(null);
    this.erreurDonnees.set(null);
    if (concours) {
      this.chargerDonnees(concours.id);
    }
  }

  chargerDonnees(concoursId: number): void {
    this.chargementDonnees.set(true);
    this.erreurDonnees.set(null);

    forkJoin({
      epreuves: this.serviceEpreuve.listerParConcours(concoursId),
      candidatures: this.serviceCandidature.listerParConcours(concoursId)
    })
      .pipe(
        switchMap(({ epreuves, candidatures }) => {
          if (candidatures.length === 0) {
            return of({ epreuves, candidatures, notes: [] as Note[][] });
          }
          return forkJoin(
            candidatures.map((c) => this.serviceNote.listerParCandidature(c.id))
          ).pipe(map((notes) => ({ epreuves, candidatures, notes })));
        })
      )
      .subscribe({
        next: ({ epreuves, candidatures, notes }) => {
          this.epreuves.set(epreuves);
          this.candidatures.set(candidatures);
          const carte = new Map<number, Note[]>();
          candidatures.forEach((c, i) => carte.set(c.id, notes[i] ?? []));
          this.notesParCandidature.set(carte);
          this.chargementDonnees.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.chargementDonnees.set(false);
          this.erreurDonnees.set(messageErreur(err));
        }
      });
  }

  selectionnerEpreuve(valeur: string): void {
    this.epreuveSelectionneeId.set(valeur ? Number(valeur) : '');
    this.rafraichirSaisies();
  }

  private rafraichirSaisies(): void {
    const epreuveId = this.epreuveSelectionneeId();
    this.erreurLigne.set({});
    if (!epreuveId) {
      this.saisies.set({});
      return;
    }
    const valeurs: Record<number, string> = {};
    for (const c of this.candidatures()) {
      const note = (this.notesParCandidature().get(c.id) ?? []).find(
        (n) => n.epreuveId === epreuveId
      );
      valeurs[c.id] = note ? String(note.valeur) : '';
    }
    this.saisies.set(valeurs);
  }

  noteExistante(candidatureId: number): Note | null {
    const epreuveId = this.epreuveSelectionneeId();
    if (!epreuveId) {
      return null;
    }
    return (
      (this.notesParCandidature().get(candidatureId) ?? []).find(
        (n) => n.epreuveId === epreuveId
      ) ?? null
    );
  }

  majSaisie(candidatureId: number, valeur: string): void {
    this.saisies.update((s) => ({ ...s, [candidatureId]: valeur }));
  }

  enregistrerLigne(candidature: Candidature): void {
    const epreuve = this.epreuveSelectionnee();
    if (!epreuve || this.ligneEnCours() !== null) {
      return;
    }
    const brut = (this.saisies()[candidature.id] ?? '').trim().replace(',', '.');
    if (brut === '') {
      this.definirErreurLigne(candidature.id, 'Saisir une note.');
      return;
    }
    const valeur = Number(brut);
    if (Number.isNaN(valeur) || valeur < 0 || valeur > 20) {
      this.definirErreurLigne(candidature.id, 'La note doit etre comprise entre 0 et 20.');
      return;
    }

    this.ligneEnCours.set(candidature.id);
    this.effacerErreurLigne(candidature.id);
    this.serviceNote
      .saisir({ candidatureId: candidature.id, epreuveId: epreuve.id, valeur })
      .subscribe({
        next: (note) => {
          this.ligneEnCours.set(null);
          this.notesParCandidature.update((carte) => {
            const nouvelle = new Map(carte);
            const liste = (nouvelle.get(candidature.id) ?? []).filter(
              (n) => n.epreuveId !== epreuve.id
            );
            liste.push(note);
            nouvelle.set(candidature.id, liste);
            return nouvelle;
          });
          this.saisies.update((s) => ({ ...s, [candidature.id]: String(note.valeur) }));
          this.notification.set('Note enregistree.');
        },
        error: (err: HttpErrorResponse) => {
          this.ligneEnCours.set(null);
          this.definirErreurLigne(candidature.id, messageErreur(err));
        }
      });
  }

  supprimerNote(candidature: Candidature): void {
    const note = this.noteExistante(candidature.id);
    if (!note || this.ligneEnCours() !== null) {
      return;
    }
    this.ligneEnCours.set(candidature.id);
    this.serviceNote.supprimer(note.id).subscribe({
      next: () => {
        this.ligneEnCours.set(null);
        this.notesParCandidature.update((carte) => {
          const nouvelle = new Map(carte);
          nouvelle.set(
            candidature.id,
            (nouvelle.get(candidature.id) ?? []).filter((n) => n.id !== note.id)
          );
          return nouvelle;
        });
        this.saisies.update((s) => ({ ...s, [candidature.id]: '' }));
        this.notification.set('Note supprimee.');
      },
      error: (err: HttpErrorResponse) => {
        this.ligneEnCours.set(null);
        this.definirErreurLigne(candidature.id, messageErreur(err));
      }
    });
  }

  private definirErreurLigne(id: number, message: string): void {
    this.erreurLigne.update((e) => ({ ...e, [id]: message }));
  }

  private effacerErreurLigne(id: number): void {
    this.erreurLigne.update((e) => {
      const copie = { ...e };
      delete copie[id];
      return copie;
    });
  }
}
