# Render Deploy And Validate

## 1. Variables Render a configurer

Copier ces variables dans le dashboard Render du service:

```env
NODE_ENV=production
VAPID_SUBJECT=mailto:contact@victorfntn.com
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
TWA_PACKAGE_NAME=com.victorfntn.stoptabac
TWA_SHA256_CERT_FINGERPRINTS=AA:BB:CC:...:ZZ
ADMIN_API_KEY=...
EXPORT_ADMIN_KEY=...
FEEDBACK_WEBHOOK_URL=
```

## 2. Redéploiement

Dans Render:

1. Ouvrir le service
2. Environment
3. Renseigner ou corriger les variables
4. Save changes
5. Manual Deploy
6. Deploy latest commit

## 3. Tests publics après déploiement

Remplacer l'URL si nécessaire.

```powershell
Invoke-RestMethod -Method Get -Uri "https://calculateur-economies-tabac.onrender.com/healthz" | ConvertTo-Json -Depth 5
Invoke-RestMethod -Method Get -Uri "https://calculateur-economies-tabac.onrender.com/manifest.webmanifest" | ConvertTo-Json -Depth 5
Invoke-RestMethod -Method Get -Uri "https://calculateur-economies-tabac.onrender.com/.well-known/assetlinks.json" | ConvertTo-Json -Depth 8
```

Attendu:

- /healthz -> ok: true
- /healthz -> vapidConfigured: true
- /.well-known/assetlinks.json -> vrai JSON, pas du HTML

## 4. Test admin sécurisé

```powershell
Invoke-RestMethod -Method Get -Uri "https://calculateur-economies-tabac.onrender.com/api/admin/status" -Headers @{ "x-admin-key" = "VOTRE_ADMIN_API_KEY" } | ConvertTo-Json -Depth 5
```

Attendu:

- ok: true
- adminConfigured: true
- assetLinksConfigured: true
- environment: production
- isProduction: true

## 5. Validation automatisée locale

```powershell
$env:APP_BASE_URL="https://calculateur-economies-tabac.onrender.com"
$env:ADMIN_API_KEY="VOTRE_ADMIN_API_KEY"
npm run check:live
```

## 6. Avant Play Store

- Vérifier la vraie empreinte SHA-256 du keystore release
- Mettre cette valeur dans TWA_SHA256_CERT_FINGERPRINTS
- Incrémenter appVersionCode si ce n'est pas une première publication
- Générer le .aab puis tester sur appareil réel Android
