@echo off
echo ========================================================
echo   NEXUS Mission Control - Starting Backend API Server
echo ========================================================
set "PYTHONPATH=%~dp0"
cd /d "%~dp0"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
