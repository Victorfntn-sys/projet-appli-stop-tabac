# Checklist Pre-Publication

Date: 2026-04-20

## 1) Securite et secrets

- [ ] Variables de prod configurees: VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY
- [ ] Cle admin configuree: ADMIN_API_KEY (ou EXPORT_ADMIN_KEY)
- [ ] Aucune cle secrète committee dans le depot

## 2) Conformite Play Store

- [ ] Politique de confidentialite publiee et accessible: /privacy.html
- [ ] Description store coherente avec les permissions reelles
- [ ] Captures d'ecran Android preparees
- [ ] URL HTTPS stable et definitive

## 3) TWA / Android

- [ ] TWA_PACKAGE_NAME configure
- [ ] TWA_SHA256_CERT_FINGERPRINTS configure
- [ ] Endpoint asset links valide: /.well-known/assetlinks.json
- [ ] appVersionCode incremente avant chaque nouvelle soumission
- [ ] Bundle AAB genere et teste sur appareil reel

## 4) Qualite applicative

- [ ] Service worker a jour et verifie (mise en cache + updates)
- [ ] Notifications testees (opt-in, envoi, desactivation)
- [ ] Mode pause et objectifs verifies

## 5) Hygiene des donnees

- [ ] Aucun export utilisateur versionne (CSV/XLSX)
- [ ] Fichiers runtime ignores via .gitignore
- [ ] Donnees de test locales nettoyees avant release

## 6) Verification finale

- [ ] /healthz retourne ok: true
- [ ] /manifest.webmanifest et /privacy.html accessibles en prod
- [ ] Parcours complet utilisateur execute une fois sur mobile
- [ ] Pre-launch report Play Console sans alerte bloquante
