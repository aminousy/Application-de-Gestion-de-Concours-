/**
 * Configuration de production.
 * Substituee a `environment.ts` lors du `ng build` via `fileReplacements`
 * declare dans angular.json.
 *
 * Adaptez `urlApi` a votre deploiement :
 *  - '/api'  si le frontend et le backend partagent le meme hote (reverse proxy) ;
 *  - 'https://mon-domaine/api'  sinon.
 */
export const environment = {
  production: true,
  urlApi: '/api',
  cleStockageJeton: 'sunuxam.jeton',
  nomApplication: 'SunuXam'
};
