@echo off
title Student Placement & Internship Management System - Live Public Web
cd /d "%~dp0"

echo ====================================================================
echo Starting Student Placement & Internship Management System Public Web
echo ====================================================================
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-public-access.ps1"

pause
