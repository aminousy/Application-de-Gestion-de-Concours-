import { Role, StatutCandidature } from '../modeles';

export const LIBELLE_STATUT_CANDIDATURE: Record<StatutCandidature, string> = {
  [StatutCandidature.EN_ATTENTE]: 'En attente',
  [StatutCandidature.DOSSIER_COMPLET]: 'Dossier complet',
  [StatutCandidature.EN_ATTENTE_DE_DELIBERATION]: 'En attente de deliberation',
  [StatutCandidature.ADMIS]: 'Admis',
  [StatutCandidature.REFUSE]: 'Refuse'
};

export const CLASSE_BADGE_STATUT_CANDIDATURE: Record<StatutCandidature, string> = {
  [StatutCandidature.EN_ATTENTE]: 'text-bg-secondary',
  [StatutCandidature.DOSSIER_COMPLET]: 'text-bg-info',
  [StatutCandidature.EN_ATTENTE_DE_DELIBERATION]: 'text-bg-warning',
  [StatutCandidature.ADMIS]: 'text-bg-success',
  [StatutCandidature.REFUSE]: 'text-bg-danger'
};


export const STATUTS_CANDIDATURE: StatutCandidature[] = [
  StatutCandidature.EN_ATTENTE,
  StatutCandidature.DOSSIER_COMPLET,
  StatutCandidature.EN_ATTENTE_DE_DELIBERATION,
  StatutCandidature.ADMIS,
  StatutCandidature.REFUSE
];

export const LIBELLE_ROLE: Record<Role, string> = {
  [Role.ADMIN]: 'Administrateur',
  [Role.CANDIDAT]: 'Candidat'
};

export const ROLES: Role[] = [Role.ADMIN, Role.CANDIDAT];
