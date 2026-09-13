@echo off
cd /d "c:\Users\SUMITH R\Desktop\multi agent\nexus-frontend"
echo Running npm install...
call npm install --no-audit --no-fund
echo NPM INSTALL FINISHED WITH CODE %ERRORLEVEL%
