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
npm run twa:update
npm run twa:build
```

### Étape 3️⃣ : Importe dans le Play Store

Une fois le `.aab` généré :

1. Va sur [Google Play Console](https://play.google.com/console)
2. Crée une app
3. Importe le fichier `.aab` en "Internal Testing"
4. Complète la fiche store
5. Lance une version de test d'abord

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
| "AAB not found" | Regarde dans `android/build/outputs/bundle/release/` |
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
