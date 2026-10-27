# ==============================================================================
# Student Placement & Internship Management System - Public Website Launcher
# ==============================================================================

$ErrorActionPreference = "Stop"
$WorkingDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $WorkingDir

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  Student Placement & Internship Management System - Public Web" -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check if application jar exists
$JarPath = Join-Path $WorkingDir "target\placement-system-1.0.0.jar"
if (-not (Test-Path $JarPath)) {
    Write-Host "[1/3] JAR not found. Building project with Maven..." -ForegroundColor Yellow
    mvn package -DskipTests
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Maven build failed. Please check errors above." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[1/3] Application JAR verified: target\placement-system-1.0.0.jar" -ForegroundColor Green
}

# 2. Check if port 8080 is already in use
$portInUse = $false
try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $tcp.Connect("127.0.0.1", 8080)
    $tcp.Close()
    $portInUse = $true
} catch {
    $portInUse = $false
}

$javaProcess = $null
if ($portInUse) {
    Write-Host "[2/3] Backend already running on port 8080." -ForegroundColor Green
} else {
    # Detect MySQL availability
    $mysqlRunning = $false
    try {
        $myTcp = New-Object System.Net.Sockets.TcpClient
        $myTcp.Connect("127.0.0.1", 3306)
        $myTcp.Close()
        $mysqlRunning = $true
    } catch {
        $mysqlRunning = $false
    }

    if ($mysqlRunning) {
        Write-Host "[2/3] MySQL detected. Starting backend with persistent MySQL database..." -ForegroundColor Green
        $javaProcess = Start-Process -FilePath "java" -ArgumentList "-jar", "`"$JarPath`"" -PassThru -WindowStyle Minimized
    } else {
        Write-Host "[2/3] MySQL not detected. Starting backend with in-memory H2 database..." -ForegroundColor Yellow
        $javaProcess = Start-Process -FilePath "java" -ArgumentList "-Dspring.profiles.active=h2", "-jar", "`"$JarPath`"" -PassThru -WindowStyle Minimized
    }

    # Wait for app to be ready (up to 60 seconds)
    Write-Host "      Waiting for server to start..." -NoNewline
    $ready = $false
    for ($i = 0; $i -lt 60; $i++) {
        Start-Sleep -Seconds 1
        Write-Host "." -NoNewline
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080/login.html" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                $ready = $true
                break
            }
        } catch {}
    }
    Write-Host ""
    if (-not $ready) {
        Write-Host "      Warning: Server may still be starting. Continuing to tunnel..." -ForegroundColor Yellow
    } else {
        Write-Host "      Backend is healthy and responding!" -ForegroundColor Green
    }
}

# 3. Start Public Tunnel (Cloudflare Tunnel preferred, Localtunnel fallback)
Write-Host "[3/3] Creating secure public tunnel for all devices..." -ForegroundColor Yellow
$cfExe = Join-Path $WorkingDir "cloudflared.exe"
$publicUrl = ""
$tunnelPassword = ""
$tunnelProc = $null

if (Test-Path $cfExe) {
    Write-Host "      Using Cloudflare Tunnel (fast, secure, no password required)..." -ForegroundColor Cyan
    $cfLog = Join-Path $WorkingDir "cf-tunnel.log"
    if (Test-Path $cfLog) { Remove-Item $cfLog -Force }

    $tunnelProc = Start-Process -FilePath $cfExe `
        -ArgumentList "tunnel", "--url", "http://localhost:8080", "--no-autoupdate" `
        -RedirectStandardError $cfLog `
        -PassThru -WindowStyle Hidden

    for ($t = 0; $t -lt 30; $t++) {
        Start-Sleep -Seconds 1
        Write-Host "." -NoNewline
        if (Test-Path $cfLog) {
            $logContent = Get-Content $cfLog -Raw -ErrorAction SilentlyContinue
            if ($logContent -match "(https://[a-zA-Z0-9-]+\.trycloudflare\.com)") {
                $publicUrl = $matches[1]
                break
            }
        }
    }
    Write-Host ""
}

# Fallback to localtunnel if cloudflared didn't produce a URL
if (-not $publicUrl) {
    Write-Host "      Cloudflare not available, launching Localtunnel fallback..." -ForegroundColor Yellow
    $subdomain = "student-placement-internship-system"
    $tunnelLog = Join-Path $WorkingDir "tunnel.log"
    if (Test-Path $tunnelLog) { Remove-Item $tunnelLog -Force }

    $tunnelErrLog = Join-Path $WorkingDir "tunnel-err.log"
    if (Test-Path $tunnelErrLog) { Remove-Item $tunnelErrLog -Force }

    $tunnelProc = Start-Process -FilePath "npx.cmd" `
        -ArgumentList "--yes", "localtunnel", "--port", "8080", "--subdomain", $subdomain `
        -RedirectStandardOutput $tunnelLog `
        -RedirectStandardError $tunnelErrLog `
        -PassThru -WindowStyle Hidden

    Start-Sleep -Seconds 5
    try {
        $tunnelPassword = (Invoke-WebRequest -Uri "https://loca.lt/mytunnelpassword" -UseBasicParsing -TimeoutSec 5).Content.Trim()
    } catch {}

    $publicUrl = "https://$subdomain.loca.lt"
}

# Copy URL to clipboard for easy sharing
try { Set-Clipboard -Value $publicUrl } catch {}

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Green
Write-Host "  SUCCESS! YOUR WEBSITE IS LIVE ONLINE FOR EVERYONE:" -ForegroundColor Green
Write-Host ""
Write-Host "  Public Website URL : $publicUrl" -ForegroundColor Cyan
Write-Host "  (Copied to your clipboard! Send this link to anyone on phones/laptops)" -ForegroundColor Green

if ($tunnelPassword) {
    Write-Host ""
    Write-Host "  Tunnel Password    : $tunnelPassword" -ForegroundColor Yellow
    Write-Host "  (If asked on first visit, enter this password and click Submit)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "DEMO LOGIN CREDENTIALS:" -ForegroundColor Yellow
Write-Host "  Admin (Sri Tanavi) : sri / [Configured Admin Password]"
Write-Host "  Student Demo       : student@placement.com        / student123"
Write-Host "  Student (Ananya)   : ananya.verma@placement.com    / student123"
Write-Host ""
Write-Host "Keep this window open while sharing. Press Ctrl+C to stop." -ForegroundColor Magenta
Write-Host ""

Start-Process $publicUrl

try {
    while (-not $tunnelProc.HasExited) {
        Start-Sleep -Seconds 2
    }
} finally {
    if ($tunnelProc -and (-not $tunnelProc.HasExited)) {
        Stop-Process -Id $tunnelProc.Id -Force -ErrorAction SilentlyContinue
    }
    if ($javaProcess -and (-not $javaProcess.HasExited)) {
        Stop-Process -Id $javaProcess.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Tunnel and application stopped." -ForegroundColor Gray
}
