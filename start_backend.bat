@echo off
echo ========================================================
echo   NEXUS Mission Control - Starting Backend API Server
echo ========================================================
set "PYTHONPATH=%~dp0nexus-backend"
python -m uvicorn app.main:app --app-dir nexus-backend --host 0.0.0.0 --port 8000 --reload
pause
