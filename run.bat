@echo off
title Student Placement and Internship Management System
echo ========================================================
echo Starting Student Placement and Internship Management System
echo ========================================================
echo.

cd /d "%~dp0"

echo Running application with MySQL database...
java -jar target\placement-system-1.0.0.jar

pause
