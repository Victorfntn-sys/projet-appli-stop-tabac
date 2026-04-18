# Calculateur d'economies - arret du tabac

Application web de suivi d'arret du tabac avec objectifs, badges, graphique, mode pause, notifications locales et backend Web Push pour les rappels hors page.

## Fonctionnalites

- calcul des economies et cigarettes evitees
- objectif personnalise avec progression
- graphique d'evolution des economies
- badges et modal de details
- mode pause du suivi
- notifications navigateur
- fondation PWA installable
- backend Web Push pour notifications meme hors page
- collecte d'idees d'amelioration via un formulaire en bas de page
- export automatique des donnees utilisateur dans un fichier CSV compatible Excel

## Prerequis

- Node.js 18+
- un domaine ou un hebergement HTTPS pour les notifications push en production

## Installation locale

1. Installez les dependances :

```bash
npm install
```

2. Generez des cles VAPID :

```bash
npm run generate:vapid
```

3. Creez un fichier `.env` a partir de `.env.example` puis renseignez :

```env
PORT=3000
VAPID_SUBJECT=mailto:contact@example.com
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

4. Lancez le serveur :

```bash
npm start
```

5. Ouvrez :

```text
http://localhost:3000
```

## Notifications meme application fermee

Le projet inclut maintenant les deux couches necessaires :

1. Frontend PWA + service worker
2. Backend Web Push avec stockage des souscriptions et envoi planifie

Le backend envoie :

- les encouragements quotidiens quand le suivi est en pause
- les alertes quand de nouveaux paquets economises sont detectes a partir de l'etat synchronise
- les retours utilisateurs envoyes depuis l'interface sont stockes dans `data/feedback.json`
- les etats utilisateur (economies, consommation, objectif) sont exportes dans `data/user-states.csv`

Le traitement planifie tourne toutes les minutes dans `server.js`.

## Installation PWA

- le manifest est dans `manifest.webmanifest`
- le service worker est dans `sw.js`
- un bouton `Installer l'application` apparait sur les navigateurs compatibles

Sur mobile, il est recommande d'installer l'application pour un comportement plus proche d'une vraie app.

## Deploiement HTTPS

Pour que les notifications push fonctionnent reellement en production, il faut servir le site en HTTPS.

Options viables :

1. Deployer `server.js` sur Render, Railway, Fly.io ou un VPS Node.js
2. Configurer un domaine avec certificat TLS
3. Renseigner les cles VAPID dans les variables d'environnement du serveur

### Deploy sur Render

Le fichier `render.yaml` est deja pret.

1. Poussez le projet sur GitHub
2. Connectez le repo a Render
3. Creez un nouveau `Blueprint` ou `Web Service`
4. Ajoutez les variables d'environnement :

```env
VAPID_SUBJECT=mailto:contact@example.com
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

5. Verifiez que l'URL `https://votre-app.onrender.com/healthz` repond
6. Ouvrez ensuite l'application publique et acceptez les notifications

### Deploy sur Railway

Le fichier `railway.json` est deja pret.

1. Importez le repo dans Railway
2. Ajoutez les variables d'environnement VAPID
3. Deployez le service
4. Verifiez l'endpoint `/healthz`
5. Utilisez l'URL HTTPS fournie par Railway pour tester les push

### URL publique et HTTPS

Render et Railway fournissent directement une URL HTTPS publique. Cela suffit pour tester les notifications push sur mobile ou desktop.

Si vous ajoutez ensuite un domaine personnalise :

1. pointez le DNS vers la plateforme
2. laissez la plateforme generer le certificat TLS
3. retestez l'inscription aux notifications depuis l'URL finale

Exemples de variables a configurer en production :

```env
PORT=3000
VAPID_SUBJECT=mailto:contact@example.com
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
FEEDBACK_WEBHOOK_URL=
```

## Structure du projet

- `index.html` : interface principale
- `styles.css` : styles
- `script.js` : logique frontend, PWA, notifications, synchronisation push
- `sw.js` : service worker et reception des push
- `manifest.webmanifest` : configuration PWA
- `server.js` : backend Express + Web Push
- `data/subscriptions.json` : stockage local des souscriptions push
- `data/feedback.json` : stockage local des idees d'amelioration
- `data/user-states.csv` : export des informations utilisateur lisible dans Excel

## Limites techniques

- les notifications hors app necessitent un navigateur compatible Push API
- iPhone Safari a plus de restrictions selon version iOS
- sans HTTPS en production, le push ne fonctionnera pas correctement

## Commandes utiles

```bash
npm install
npm run generate:vapid
npm start
```

## Verification apres publication

1. Ouvrir l'URL HTTPS publique
2. Cliquer sur `Installer l'application` si propose
3. Activer les notifications
4. Mettre le suivi en pause pour tester un rappel
5. Verifier `https://votre-url/healthz`
