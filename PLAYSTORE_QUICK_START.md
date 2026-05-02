# 🚀 Construction de l'app Android pour Play Store

Tout ce qu'il faut pour publier ton app Stop Tabac sur le Play Store est maintenant prêt.

## ⚡ Démarrage rapide (3 étapes)

### Étape 1️⃣ : Prépare les prérequis

Avant de lancer le build, vérifie que tu as :

- ✅ **Node.js** installé → [installer](https://nodejs.org)
- ✅ **Java 17+** → on va l'installer automatiquement si besoin
- ✅ **Une URL HTTPS stable** pour le backend (ex: Render, Railway)
- ✅ **Google Play Developer Account** ($25 uniques)

### Étape 2️⃣ : Lance le script de build

Avant le build, lance le pré-check Play Store :

```bash
npm run check:playstore
```

Ce check valide les fichiers critiques (`twa-manifest.json`, `manifest.webmanifest`, icônes, privacy) et les paramètres TWA.

**Choisis une seule option selon ton système :**

#### 🪟 Sur Windows (recommandé)

**Avec PowerShell (moderne)** :
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser -Force
.\build-android.ps1
```

Ou avec **l'ancien CMD** :
```
build-android.bat
```

Le script va automatiquement:
1. Vérifier/installer Java
2. Installer Bubblewrap et l'Android SDK
3. Compiler l'app en bundle AAB
4. T'indiquer où trouver le fichier final

⏱️ **Durée du build** : 10-20 minutes la première fois (installation des outils), 2-5 min ensuite.

#### 🐧 Sur Linux/Mac

```bash
./gradlew bundleRelease
```

### Étape 3️⃣ : Importe dans le Play Store

Une fois le `.aab` généré :

1. Va sur [Google Play Console](https://play.google.com/console)
2. Crée une app
3. Importe le fichier `.aab` en "Internal Testing"
4. Complète la fiche store
5. Lance une version de test d'abord

### Checklist Play Console ecran par ecran

1. `All apps` -> `Create app`
  - App name : `Stop Tabac - Calcul d'economies`
  - Default language : `French (France)`
  - App or game : `App`
  - Free or paid : `Free`
  - Declarations : coche les confirmations demandees

2. `Dashboard`
  - Verifie les taches bloquees affichees par Google
  - Commence par `Set up your app` puis `Grow your app`

3. `Set up your app` -> `App access`
  - Choisis `All functionality is available without special access` si aucun compte n'est requis
  - Si Google demande un acces de demo, fournis un compte test separatement

4. `Set up your app` -> `Ads`
  - Choisis `No` si l'app n'affiche pas de publicites

5. `Set up your app` -> `Content rating`
  - Lance le questionnaire
  - Pour cette app, reste coherent avec un usage `Sante / bien-etre` sans contenu sensible
  - Soumets puis recupere la classification proposee

6. `Set up your app` -> `Target audience`
  - Selectionne plutot `18 and over`
  - L'app traite d'arret du tabac et de suivi personnel, pas d'un produit pour enfants

7. `Set up your app` -> `News apps`
  - Choisis `No`

8. `Grow your app` -> `Store presence` -> `Main store listing`
  - App name : `Stop Tabac - Calcul d'economies`
  - Short description : `Suivi de l'arret du tabac avec economies, objectifs et rappels.`
  - Full description : reprends la version de `PLAYSTORE_DEPLOYMENT.md`
  - App icon : utilise `icon-512.png`
  - Phone screenshots : ajoute 2 a 8 captures propres de l'app
  - Feature graphic : ajoute une image `1024 x 500` si possible

9. `Grow your app` -> `Store settings`
  - App category : `Health & Fitness` ou `Productivity`
  - Tags : choisis des tags proches de `habit tracking`, `health`, `wellbeing`
  - Contact details : ajoute au minimum un email de contact
  - Privacy policy : renseigne l'URL publique de `privacy.html`

10. `Monetize with Play` -> `App content`
  - Verifie que toutes les declarations sont marquees en vert
  - Si une section reste rouge, ouvre-la depuis ce menu plutot que depuis le dashboard

11. `Test and release` -> `Testing` -> `Internal testing`
  - Cree une release
  - Importe `app/build/outputs/bundle/release/app-release.aab`
  - Ajoute des notes de version simples
  - Cree une liste de testeurs ou une liste email

12. `Testing` -> `Internal testing` -> `Testers`
  - Ajoute ton adresse Gmail et celles des testeurs Android
  - Sauvegarde puis copie le lien d'opt-in

13. Installer le build test
  - Ouvre le lien d'opt-in sur le telephone Android
  - Accepte le test
  - Installe l'app depuis le Play Store
  - Verifie lancement, notifications, synchro, asset links, ecran principal

14. `Release` -> `Production`
  - Cree la release production quand le test interne est bon
  - Reutilise le meme AAB ou un AAB incremente si tu as corrige quelque chose

15. `Publishing overview`
  - Controle les avertissements finaux
  - Clique `Send for review` puis `Publish`

### A preparer avant d'ouvrir la console

- Le fichier AAB : `app/build/outputs/bundle/release/app-release.aab`
- L'URL de politique de confidentialite
- 2 a 8 screenshots Android
- 1 email de contact public
- La description courte et longue
- Le package Android : `com.victorfntn.stoptabac`
- Le fingerprint SHA-256 deja configure en production

---

## 📚 Guides détaillés

- **PLAYSTORE_DEPLOYMENT.md** ← Lire pour les détails complets
- Configuration TWA avancée → Voir `twa-manifest.json`
- Backend / API → Voir `server.js` et `README.md`

---

## ⚙️ Configuration avant le build (optionnel)

Si tu veux modifier le package name ou d'autres paramètres de l'app TWA :

Ouvre `twa-manifest.json` et modifie:
```json
{
  "packageId": "com.victorfntn.stoptabac",      // ← Unique sur Play Store
  "name": "Calculateur d'économies",             // ← Nom affiché
  "launcherName": "Stop Tabac",                  // ← Nom du raccourci
  "host": "calculateur-economies-tabac.onrender.com",  // ← Ta URL HTTPS
  ...
}
```

---

## 🆘 Troubleshooting rapide

| Problème | Solution |
|----------|----------|
| "Java not found" | Le script l'installe auto. Redémarre après. |
| "npm not found" | Installe Node.js depuis https://nodejs.org |
| "Build failed" | Cherche le message d'erreur. Généralement un problème d'URL ou de fichiers manquants. |
| "AAB not found" | Regarde dans `app/build/outputs/bundle/release/` |
| "assetlinks.json error" | Redéploie ton backend et vérifie les variables env `TWA_*` |

---

## ✅ Checklist avant publication (IMPORTANT)

Avant de cliquer "Publish", vérifie :

- [ ] L'URL du backend est en HTTPS stable
- [ ] `/.well-known/assetlinks.json` répond correctement
- [ ] Fiche store complète (titre, description, screenshots, icone)
- [ ] Au moins 2-3 bonnes screenshots de l'app
- [ ] Politique de confidentialité en ligne (URL)
- [ ] Testé l'app sur un vrai téléphone Android
- [ ] Les permissions demandées sont correctes (notifications, stockage)
- [ ] Catégorie sélectionnée (Santé ou Productivité)

---

## 🎯 Timing attendu

- ⏱️ **Build local** : 10-20 min la 1re fois, ~2-5 min après
- ⏱️ **Revision Google** : 2-24h généralement
- 🎉 **Publication** : Immédiate une fois approuvé

---

## 💡 Strat de test = Testing interne en premier

1. **Internal Testing** ← Teste avec des amis/bêta-testeurs
2. **Closed Testing** (optionnel) ← Groupe Google fermé
3. **Open Testing** (optionnel) ← Early access public (~20%)
4. **Production** ← Tout le monde

Ne mets pas directement en production, teste d'abord les bugs.

---

## 📞 Besoin d'aide ?

- **Questions sur le Play Store** → [Aide Play Console](https://support.google.com/googleplay)
- **Questions sur TWA** → [TWA Documentation](https://developer.chrome.com/docs/android/trusted-web-activity/)
- **Bug dans l'app** → Vérifie `index.html`, `script.js`, `server.js`

---

**Bon courage ! Ton app va être publiée dès aujourd'hui. 🚀**
