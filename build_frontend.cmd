@echo off
cd /d "c:\Users\SUMITH R\Desktop\multi agent\nexus-frontend"
echo Building frontend...
call npx vite build
echo BUILD FINISHED WITH CODE %ERRORLEVEL%
