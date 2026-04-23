@echo off
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║          Build Android Bundle pour Play Store                  ║
echo ║              (Tout automatisé)                                 ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Vérifier si Java est installé
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Java n'est pas installé. Installation automatique...
    echo.
    
    REM Vérifier Chocolatey
    choco -v >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Chocolatey n'est pas installé.
        echo.
        echo Pour installer Chocolatey, ouvre PowerShell en admin et exécute :
        echo.
        echo Set-ExecutionPolicy Bypass -Scope Process -Force
        echo [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        echo iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        echo.
        pause
        exit /b 1
    )
    
    echo 📦 Installation de OpenJDK 17 via Chocolatey...
    choco install openjdk17 -y
    
    echo.
    echo ⏳ Actualisez l'invite de commande...
    pause
    exit /b 0
)

echo ✅ Java trouvé
java -version
echo.

REM Vérifier Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé. Veuillez installer Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js trouvé
node --version
echo.

REM Installer/mettre à jour Bubblewrap globalement
echo 📦 Installation de Bubblewrap...
npm install -g @bubblewrap/cli@latest
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation de Bubblewrap
    pause
    exit /b 1
)

echo ✅ Bubblewrap installé
bubblewrap --version
echo.

REM Aller au dossier du projet
cd /d "c:\Users\victo\OneDrive\Bureau\projet appli"
if %errorlevel% neq 0 (
    echo ❌ Impossible d'accéder au répertoire du projet
    pause
    exit /b 1
)

echo 📂 Répertoire du projet : %cd%
echo.

REM Vérifier les fichiers essentiels
if not exist "twa-manifest.json" (
    echo ❌ Fichier twa-manifest.json manquant
    pause
    exit /b 1
)

if not exist "manifest.webmanifest" (
    echo ❌ Fichier manifest.webmanifest manquant
    pause
    exit /b 1
)

echo ✅ Fichiers essentiels présents
echo.

REM Pré-check Play Store
echo 🧪 Vérification readiness Play Store...
call npm run check:playstore
if %errorlevel% neq 0 (
    echo ❌ Le pré-check Play Store a échoué.
    echo Corrige les points FAIL avant de lancer le build.
    pause
    exit /b 1
)
echo ✅ Pré-check Play Store validé
echo.

REM Définir JAVA_HOME
for /f "tokens=*" %%A in ('where java 2^>nul') do set JAVA_BIN=%%A

if defined JAVA_BIN (
    for /f "delims=" %%A in ("%JAVA_BIN%") do Set JAVA_DIR=%%~dpA
    set JAVA_HOME=!JAVA_DIR:~0,-4!
    echo ✅ JAVA_HOME configuré : !JAVA_HOME!
) else (
    echo ⚠️  JAVA_HOME non détecté automatiquement
    echo Veuillez vérifier manuellement l'installation Java
)

echo.

REM Mettre à jour Bubblewrap
echo 🔧 Mise à jour de Bubblewrap (cela peut prendre plusieurs minutes)...
echo.
call bubblewrap update

echo.
echo ══════════════════════════════════════════════════════════════════
echo ✨ Génération du bundle Android AAB...
echo ══════════════════════════════════════════════════════════════════
echo.

REM Lancer le build
call npm run twa:build

if %errorlevel% neq 0 (
    echo.
    echo ❌ Le build a échoué.
    echo Vérifie les messages d'erreur au-dessus.
    pause
    exit /b 1
)

echo.
echo ══════════════════════════════════════════════════════════════════
echo ✅ BUILD RÉUSSI !
echo ══════════════════════════════════════════════════════════════════
echo.
echo Cherche le fichier AAB généré...

REM Chercher le fichier AAB
for /r "android" %%f in (*.aab) do (
    echo.
    echo 📱 Bundle AAB trouvé :
    echo    %%f
    echo.
    echo Prochaines étapes :
    echo 1. Va sur https://play.google.com/console
    echo 2. Importe ce fichier AAB
    echo 3. Remplis la fiche store
    echo 4. Publie pour testing ou production
    echo.
    echo Pour plus d'infos, lis PLAYSTORE_DEPLOYMENT.md
    echo.
    pause
    exit /b 0
)

echo ❌ Fichier AAB non trouvé après le build
echo Cherche manuellement dans le dossier : %cd%\android\build\outputs
pause
exit /b 1
