#!/usr/bin/env pwsh

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host " Build Android Bundle for Play Store" -ForegroundColor Cyan
Write-Host " Stop Tabac Application" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "c:\Users\victo\OneDrive\Bureau\projet appli"

function Test-Command {
    param([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

Write-Host "Checking Java..." -ForegroundColor Yellow
if (-not (Test-Command java)) {
    Write-Host "Java is not installed. Install OpenJDK 17 and rerun this script." -ForegroundColor Red
    exit 1
}
java -version 2>&1 | Select-Object -First 1

Write-Host "Checking Node.js..." -ForegroundColor Yellow
if (-not (Test-Command node)) {
    Write-Host "Node.js is not installed. Install it from https://nodejs.org" -ForegroundColor Red
    exit 1
}
node --version

Write-Host "Checking Bubblewrap..." -ForegroundColor Yellow
if (-not (Test-Command bubblewrap)) {
    Write-Host "Installing Bubblewrap CLI..." -ForegroundColor Green
    npm install -g @bubblewrap/cli@latest
}
bubblewrap --version

if (-not (Test-Path $projectPath)) {
    Write-Host "Project path not found: $projectPath" -ForegroundColor Red
    exit 1
}
Set-Location $projectPath
Write-Host "Project path: $(Get-Location)" -ForegroundColor Green

$essentialFiles = @("twa-manifest.json", "manifest.webmanifest", "package.json", "server.js")
foreach ($file in $essentialFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "Missing required file: $file" -ForegroundColor Red
        exit 1
    }
}

$javaPath = (Get-Command java -ErrorAction SilentlyContinue).Source
if ($javaPath) {
    $javaHome = Split-Path (Split-Path $javaPath -Parent) -Parent
    $env:JAVA_HOME = $javaHome
    Write-Host "JAVA_HOME=$env:JAVA_HOME" -ForegroundColor Green
}

Write-Host "Running Play Store pre-check..." -ForegroundColor Yellow
npm run check:playstore
if ($LASTEXITCODE -ne 0) {
    Write-Host "Play Store pre-check failed. Fix FAIL items before building." -ForegroundColor Red
    exit 1
}

Write-Host "Running bubblewrap update (optional setup step)..." -ForegroundColor Yellow
$updateProcess = Start-Process -FilePath "bubblewrap" -ArgumentList "update" -NoNewWindow -PassThru
$updateProcess.WaitForExit()
if ($updateProcess.ExitCode -ne 0) {
    Write-Host "bubblewrap update returned non-zero. Continuing with Gradle build." -ForegroundColor Yellow
}

$bubblewrapConfigPath = Join-Path $env:USERPROFILE ".bubblewrap\config.json"
if ((Test-Path "gradlew.bat") -and (Test-Path $bubblewrapConfigPath)) {
    $bubblewrapConfig = Get-Content $bubblewrapConfigPath -Raw | ConvertFrom-Json
    if ($bubblewrapConfig.androidSdkPath) {
        $sdkDir = $bubblewrapConfig.androidSdkPath -replace '\\', '\\\\'
        Set-Content -Path "local.properties" -Value "sdk.dir=$sdkDir"
        Write-Host "Configured local.properties with sdk.dir" -ForegroundColor Green
    }
}

Write-Host "Building AAB..." -ForegroundColor Cyan
if (Test-Path "gradlew.bat") {
    $buildProcess = Start-Process -FilePath ".\gradlew.bat" -ArgumentList "bundleRelease" -NoNewWindow -PassThru
} else {
    $buildProcess = Start-Process -FilePath "npm" -ArgumentList "run twa:build" -NoNewWindow -PassThru
}
$buildProcess.WaitForExit()

if ($buildProcess.ExitCode -ne 0) {
    Write-Host "Build failed. Check errors above." -ForegroundColor Red
    exit 1
}

$aabFile = Get-ChildItem -Recurse -Filter "*.aab" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($aabFile) {
    Write-Host "Build successful. AAB file:" -ForegroundColor Green
    Write-Host "$($aabFile.FullName)" -ForegroundColor Cyan
} else {
    Write-Host "Build completed but no .aab found." -ForegroundColor Red
    Write-Host "Check: $projectPath\app\build\outputs\bundle\release" -ForegroundColor Yellow
    exit 1
}
