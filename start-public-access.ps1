# ==============================================================================
# Student Placement & Internship Management System - Branded Public Website
# ==============================================================================

$ErrorActionPreference = "Stop"
$WorkingDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $WorkingDir

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "   Student Placement & Internship Management System - Branded Public Web" -ForegroundColor Yellow
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
    Write-Host "[1/3] Application package target\placement-system-1.0.0.jar verified." -ForegroundColor Green
}

# 2. Check if port 8080 is already open or start Java app
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
    Write-Host "[2/3] Backend server is already running and active on port 8080." -ForegroundColor Green
} else {
    # Detect MySQL availability and start backend accordingly
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
        Write-Host "[2/3] Starting backend with persistent MySQL database..." -ForegroundColor Green
        $javaProcess = Start-Process -FilePath "java" -ArgumentList "-jar", "`"$JarPath`"" -PassThru -WindowStyle Minimized
    } else {
        Write-Host "[2/3] Starting backend application on port 8080 (In-Memory H2 DB)..." -ForegroundColor Yellow
        $javaProcess = Start-Process -FilePath "java" -ArgumentList "-Dspring.profiles.active=h2", "-jar", "`"$JarPath`"" -PassThru -WindowStyle Minimized
    }

    # Wait for app to be ready
    Write-Host "      Waiting for server to become ready..." -NoNewline
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 1
        Write-Host "." -NoNewline
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                $ready = $true
                break
            }
        } catch {}
    }
    Write-Host ""
    if (-not $ready) {
        Write-Host "Warning: Backend might still be starting, continuing to tunnel..." -ForegroundColor Yellow
    } else {
        Write-Host "      Backend is healthy and responding!" -ForegroundColor Green
    }
}

# 3. Start Branded Public Subdomain Tunnel
Write-Host "[3/3] Establishing branded public domain tunnel..." -ForegroundColor Yellow
$subdomain = "student-placement-internship-system"
$tunnelLog = Join-Path $WorkingDir "tunnel.log"
if (Test-Path $tunnelLog) { Remove-Item $tunnelLog -Force }

# Launch localtunnel with custom subdomain
$tunnelProc = Start-Process -FilePath "npx.cmd" -ArgumentList "--yes", "localtunnel", "--port", "8080", "--subdomain", $subdomain -RedirectStandardOutput $tunnelLog -RedirectStandardError $tunnelLog -PassThru -WindowStyle Hidden

Start-Sleep -Seconds 3

# Fetch public IP password
$tunnelPassword = ""
try {
    $tunnelPassword = (Invoke-WebRequest -Uri "https://loca.lt/mytunnelpassword" -UseBasicParsing -TimeoutSec 3).Content.Trim()
} catch {}

$publicUrl = "https://$subdomain.loca.lt"

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Green
Write-Host "   🎉 SUCCESS! YOUR BRANDED WEBSITE IS NOW LIVE ONLINE:" -ForegroundColor Green
Write-Host ""
Write-Host "   🔗 Website URL:  $publicUrl" -ForegroundColor Cyan
if ($tunnelPassword) {
    Write-Host "   🔑 First-Time Visitor Password:  $tunnelPassword" -ForegroundColor Yellow
    Write-Host "      (If prompted by the tunnel, enter this password and click Submit)" -ForegroundColor Gray
}
Write-Host ""
Write-Host "====================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "DEMO CREDENTIALS FOR TESTING:" -ForegroundColor Yellow
Write-Host "  * Admin / Placement Officer:  admin@placement.com     /  admin123"
Write-Host "  * Student Demo Account:       student@placement.com   /  student123"
Write-Host "  * Student 2 (Ananya):         ananya.verma@placement.com / student123"
Write-Host ""
Write-Host "Keep this window open while you want the website to be active." -ForegroundColor Magenta
Write-Host "Press Ctrl+C or close this window to stop sharing." -ForegroundColor Gray
Write-Host ""

Start-Process $publicUrl

try {
    while (-not $tunnelProc.HasExited) {
        Start-Sleep -Seconds 1
    }
} finally {
    if (-not $tunnelProc.HasExited) { Stop-Process -Id $tunnelProc.Id -Force }
    if ($javaProcess -and (-not $javaProcess.HasExited)) { Stop-Process -Id $javaProcess.Id -Force }
}
