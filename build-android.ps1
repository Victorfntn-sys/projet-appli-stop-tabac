#!/usr/bin/env pwsh

Write-Host "`n" -ForegroundColor Cyan
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          Build Android Bundle pour Play Store                  ║" -ForegroundColor Cyan
Write-Host "║              Stop Tabac Application                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "`n"

$projectPath = "c:\Users\victo\OneDrive\Bureau\projet appli"

function Test-Command {
    param([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# 1. Vérifier Java
Write-Host "🔍 Vérification de Java..." -ForegroundColor Yellow

if (-not (Test-Command java)) {
    Write-Host "⚠️  Java n'est pas installé." -ForegroundColor Red
    Write-Host "Installation automatique via Chocolatey..." -ForegroundColor Yellow
    
    if (-not (Test-Command choco)) {
        Write-Host "❌ Chocolatey n'est pas installé." -ForegroundColor Red
        Write-Host "`nPour installer Chocolatey, exécute en PowerShell Admin :" -ForegroundColor Cyan
        Write-Host @"
Set-ExecutionPolicy Bypass -Scope Process -Force;
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072;
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
"@ -ForegroundColor Gray
        Read-Host "`nAppuie sur Enter pour quitter"
        exit 1
    }
    
    Write-Host "📦 Installation de OpenJDK 17..." -ForegroundColor Green
    choco install openjdk17 -y | Out-Null
    
    Write-Host ✅ OpenJDK 17 installé. Relance ce script." -ForegroundColor Green
    Read-Host "`nAppuie sur Enter"
    exit 0
}

Write-Host "✅ Java trouvé" -ForegroundColor Green
java -version 2>&1 | Select-Object -First 1

# 2. Vérifier Node.js
Write-Host "`n🔍 Vérification de Node.js..." -ForegroundColor Yellow

if (-not (Test-Command node)) {
    Write-Host "❌ Node.js n'est pas installé." -ForegroundColor Red
    Write-Host "Installe-le depuis : https://nodejs.org" -ForegroundColor Cyan
    Read-Host "`nAppuie sur Enter"
    exit 1
}

Write-Host "✅ Node.js trouvé" -ForegroundColor Green
node --version

# 3. Installer Bubblewrap
Write-Host "`n🔍 Vérification de Bubblewrap..." -ForegroundColor Yellow

if (-not (Test-Command bubblewrap)) {
    Write-Host "📦 Installation de Bubblewrap CLI..." -ForegroundColor Green
    npm install -g @bubblewrap/cli@latest *>&1 | Out-Null
}

Write-Host "✅ Bubblewrap disponible" -ForegroundColor Green
bubblewrap --version

# 4. Aller au répertoire du projet
Write-Host "`n📂 Accès au répertoire du projet..." -ForegroundColor Yellow

if (-not (Test-Path $projectPath)) {
    Write-Host "❌ Le répertoire du projet n'existe pas : $projectPath" -ForegroundColor Red
    Read-Host "`nAppuie sur Enter"
    exit 1
}

Set-Location $projectPath
Write-Host "✅ Répertoire : $(Get-Location)" -ForegroundColor Green

# 5. Vérifier les fichiers essentiels
Write-Host "`n✅ Vérification des fichiers essentiels..." -ForegroundColor Yellow

$essentialFiles = @("twa-manifest.json", "manifest.webmanifest", "package.json", "server.js")
foreach ($file in $essentialFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file"
    } else {
        Write-Host "   ❌ $file MANQUANT" -ForegroundColor Red
        exit 1
    }
}

# 6. Configurer JAVA_HOME
Write-Host "`n🔧 Configuration de JAVA_HOME..." -ForegroundColor Yellow

$javaPath = (Get-Command java -ErrorAction SilentlyContinue).Source
if ($javaPath) {
    $javaHome = Split-Path (Split-Path $javaPath -Parent) -Parent
    $env:JAVA_HOME = $javaHome
    Write-Host "✅ JAVA_HOME = $env:JAVA_HOME" -ForegroundColor Green
}

# 7. Lancer la mise à jour Bubblewrap
Write-Host "`n🔄 Mise à jour de Bubblewrap..." -ForegroundColor Yellow
Write-Host "(Cela peut prendre quelques minutes - JDK et SDK Android vont s'installer)`n" -ForegroundColor Gray

$updateProcess = Start-Process -FilePath "bubblewrap" -ArgumentList "update" -NoNewWindow -PassThru
$updateProcess.WaitForExit()

if ($updateProcess.ExitCode -ne 0) {
    Write-Host "`n⚠️  La mise à jour de Bubblewrap a signalé un problème." -ForegroundColor Yellow
    Write-Host "C'est souvent normal pour la première exécution." -ForegroundColor Gray
}

# 8. Build l'AAB
Write-Host "`n" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🚀 Lancement du build du bundle Android..." -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$buildProcess = Start-Process -FilePath "npm" -ArgumentList "run twa:build" -NoNewWindow -PassThru
$buildProcess.WaitForExit()

if ($buildProcess.ExitCode -ne 0) {
    Write-Host "`n❌ Le build a échoué." -ForegroundColor Red
    Write-Host "Vérifie les messages d'erreur au-dessus." -ForegroundColor Yellow
    Read-Host "`nAppuie sur Enter"
    exit 1
}

# 9. Trouver l'AAB généré
Write-Host "`n" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✨ BUILD RÉUSSI !" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$aabFile = Get-ChildItem -Recurse -Filter "*.aab" -ErrorAction SilentlyContinue | Select-Object -First 1

if ($aabFile) {
    Write-Host "📱 Fichier Android Bundle trouvé :" -ForegroundColor Green
    Write-Host "   $($aabFile.FullName)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Prochaines étapes :" -ForegroundColor Yellow
    Write-Host "   1. Va sur https://play.google.com/console" -ForegroundColor Gray
    Write-Host "   2. Importe ce fichier AAB en version de test" -ForegroundColor Gray
    Write-Host "   3. Complète la fiche store (description, images, etc.)" -ForegroundColor Gray
    Write-Host "   4. Publie pour testing interne ou production" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📖 Pour les détails complets, consulte PLAYSTORE_DEPLOYMENT.md" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "❌ Fichier AAB non trouvé après le build" -ForegroundColor Red
    Write-Host "Cherche manuellement dans : $projectPath\android\build\outputs\bundle\release\" -ForegroundColor Yellow
}

Read-Host "`nAppuie sur Enter pour terminer"
