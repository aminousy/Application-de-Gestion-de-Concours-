import { Injectable, signal } from '@angular/core';

export type TypeNotification = 'succes' | 'erreur' | 'info' | 'avertissement';

export interface Notification {
  id: number;
  type: TypeNotification;
  message: string;
}

/**
 * File de notifications transitoires (toasts). Auto-fermeture apres 5 secondes.
 */
@Injectable({ providedIn: 'root' })
export class ServiceNotification {
  private readonly _notifications = signal<Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();

  private compteur = 0;
  private readonly dureeMs = 5000;

  succes(message: string): void {
    this.ajouter('succes', message);
  }

  erreur(message: string): void {
    this.ajouter('erreur', message);
  }

  info(message: string): void {
    this.ajouter('info', message);
  }

  avertissement(message: string): void {
    this.ajouter('avertissement', message);
  }

  fermer(id: number): void {
    this._notifications.update((liste) => liste.filter((n) => n.id !== id));
  }

  private ajouter(type: TypeNotification, message: string): void {
    const id = ++this.compteur;
    this._notifications.update((liste) => [...liste, { id, type, message }]);
    setTimeout(() => this.fermer(id), this.dureeMs);
  }
}
