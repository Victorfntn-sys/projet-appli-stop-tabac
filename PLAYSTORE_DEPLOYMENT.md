# Guide de déploiement Play Store - Application Stop Tabac

## Résumé rapide

Ton application est une **Trusted Web Activity (TWA)** - une app Android qui lance ta PWA web via un conteneur Android natif. Tout ce qu'il faut pour le Play Store est prêt dans ce projet.

## ✅ Ce qui est déjà configuré

- ✅ `twa-manifest.json` : Configuration TWA complète
- ✅ `manifest.webmanifest` : Manifest PWA
- ✅ `server.js` : Backend avec endpoint `/.well-known/assetlinks.json` pour la vérification Android
- ✅ Package.json avec dépendances Bubblewrap prêtes
- ✅ Icones 512x512 en place

## 📋 Avant de commencer: Points obligatoires

1. **URL HTTPS stable et définitive** (ex: `https://calculateur-economies-tabac.onrender.com`)
   - Vérifie que `/.well-known/assetlinks.json` répond sur cette URL
   - C'est la fondation du lien Android vers ta PWA

2. **Google Play Developer Account** (frais uniques de $25)

3. **Package name Android** (dans `twa-manifest.json`)
   - Actuellement: `com.victorfntn.stoptabac`
   - Doit être unique sur le Play Store

---

## 🔧 Étapes pour générer le bundle AAB

### Option A : Build local avec Windows (Java requis)

#### 1. Installer Java sur le système

**Via Chocolatey** (plus rapide) :
```powershell
choco install openjdk17 -y
```

Ou **manuellement** :
- Télécharge OpenJDK 17 depuis https://adoptium.net/
- Installe-le et ajoute au PATH

Vérifie :
```powershell
java -version
javac -version
```

#### 2. Installer/mettre à jour Bubblewrap

```powershell
npm install -g @bubblewrap/cli@latest
```

#### 3. Configurer Bubblewrap

```powershell
cd "c:\Users\victo\OneDrive\Bureau\projet appli"
bubblewrap update
```

Quand Bubblewrap demande des choix:
- "Do you want to download..." → Appuie sur **Y** pour laisser installer
- Laisse finir l'installation complète du JDK et Android SDK

#### 4. Construire l'app

```powershell
.\gradlew.bat bundleRelease
```

Le fichier généré sera dans `app/build/outputs/bundle/release/app-release.aab`

---

### Option B : Build plus simple avec GitHub Actions (recommandé)

Laisse GitHub construire l'app automatiquement dans le cloud, pas besoin d'installer Java localement.

1. Pousse ce projet sur GitHub
2. Configure un workflow GitHub Actions pour builder automatiquement l'AAB
3. Récupère l'AAB généré dans les artifacts

**Je peux créer ce workflow pour toi si tu donnes les détails GitHub.**

---

## 📱 Créer le compte Play Store et la fiche

### 1. Créer l'application sur Google Play Console

1. Va sur https://play.google.com/console
2. "Create app"
3. Remplis :
   - **Nom d'app** : "Stop Tabac" ou "Calculateur d'économies"
   - **Langue par défaut** : Français
   - **Catégorie** : Santé et fitness / Productivité
   - **Type de contenu** : App non-jeu

### 2. Remplir la fiche store

**À compléter dans Play Console :**

- **Titre de l'app** (50 car max) : "Stop Tabac - Calcul d'économies"
- **Description courte** : "Suivi complet de l'arrêt du tabac avec calcul des économies et notifications."
- **Description complète** : 
  ```
  Calculateur d'économies pour l'arrêt du tabac.
  
  Fonctionnalités :
  - Suivi en temps réel des cigarettes économisées et de l'argent épargné
  - Objectifs personnalisés (voyage, véhicule, etc.)
  - Badges de réussite et statistiques
  - Mode pause pour les rechutes
  - Synchronisation cloud
  - Notifications de rappel
  - Export des données CSV/Excel
  
  Données : tes données restent locales sur ton téléphone. Aucune publication d'infos personnelles.
  ```

- **Icone de l'app** : `icon-512.png` (au minimum 512x512)
- **Captures d'écran** : 2-5 captures de l'interface (min 1080x1920)
- **Bannière** : 1024x500 (optionnel mais recommandé)
- **Catégorie de contenu** : "Santé et bien-être"

### 3. Créer les screenshots (rapide)

Prends des screenshots de l'app sur un émulateur ou téléphone Android:
- Écran principal avec les stats
- Écran de configuration
- Écran des badges

Stocke-les dans un dossier `screenshots/` du projet.

---

## 🔐 Générer la signature (Keystore)

**Une seule fois**, crée une clé de signature pour l'app:

```powershell
# Si Java est installé
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias release-key -keyalg RSA -keysize 2048 -validity 10000
```

Quand du te demande les infos, remplis:
- **First and Last Name** : Ton nom
- **Organization** : Stop Tabac / Ton nom
- **Country Code** : FR
- **Password du keystore** : Crée un mot de passe fort

Récupère l'**empreinte SHA-256** :
```powershell
keytool -list -v -keystore release.keystore -alias release-key
```

Copie l'empreinte et mets-la dans `.env` :
```env
TWA_SHA256_CERT_FINGERPRINTS=AA:BB:CC:DD:...
```

---

## 📤 Importer et tester l'AAB

### Dans Play Console :

1. Va dans **"Testing" → "Internal testing"**
2. Crée un groupe de test (ex: "alpha")
3. Ajoute le fichier `.aab` généré
4. Lance un test sur un vrai téléphone Android

### Après les tests :

1. Remplis le **"Content rating questionnaire"**
2. Remplis la **"Politique de confidentialité"** (vers `https://tonsite.com/privacy.html`)
3. Sélectionne les pays de distribution
4. Vérifie les **"App permission"** (sinon les utilisateurs vont refuser)

### Permissions demandées actuellement :

L'app demande :
- **Notifications** (push via Web Push API)
- **Données du téléphone** (pour le stockage local)

**À documenter bien dans la fiche : aucune donnée personnelle transmise, tout reste localement.**

---

## 🚀 Soumettre en production

1. Remplis toutes les sections dans Play Console
2. Va dans **"Release" → "Production"**
3. Crée une release, importe l'AAB
4. Corrige tous les avertissements de pré-lancement si nécessaire
5. **"Review and publish"**

**Attente typique : 2-24h** pour la révision Google

---

## 🛡️ Checklist finale avant publication

- [ ] L'URL HTTPS du backend est définitive
- [ ] `/.well-known/assetlinks.json` retourne ton package + fingerprint SHA-256
- [ ] Fiche store complétée (titre, description, icones, screenshots)
- [ ] Politique de confidentialité publiée à une URL
- [ ] Testé l'AAB sur un appareil Android réel
- [ ] Keystore généré et l'empreinte SHA-256 configurée
- [ ] Budgets et permissions revues
- [ ] Pas de crash au lancement de l'app

---

## 📞 Support

- **Erreur "assetlinks.json returned HTTP 404"** → Redéploie le backend `server.js` et vérifie les variables VAPID
- **Erreur de signature** → Régénère la clé ou utilise Gradle directement
- **Bubblewrap échoue avec `Cannot read properties of undefined (reading 'path')`** → utilise directement `./gradlew.bat bundleRelease`, vérifie `local.properties` et pointe `sdk.dir` vers ton SDK Android
- **Lenteurs du téléchargement JDK** → Installe OpenJDK manuellement via Chocolatey

---

## 📚 Ressources

- [TWA Documentation](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Google Play Developer Console](https://play.google.com/console)
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)
- [Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap)

---

**Ton app est prête. Suis ces étapes dans l'ordre et tu seras sur le Play Store en 1-2j max. 🎉**
