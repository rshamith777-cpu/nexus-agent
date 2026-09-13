@echo off
echo ========================================================
echo   NEXUS Mission Control - Starting Frontend App
echo ========================================================
cd /d "%~dp0nexus-frontend"
npm run dev
pause
