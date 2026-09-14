@echo off
echo ========================================================
echo   NEXUS Mission Control - Starting Backend API Server
echo ========================================================
if exist "%~dp0app\main.py" (
    set "PYTHONPATH=%~dp0"
    python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
) else if exist "%~dp0nexus-backend\app\main.py" (
    set "PYTHONPATH=%~dp0nexus-backend"
    python -m uvicorn app.main:app --app-dir "%~dp0nexus-backend" --host 0.0.0.0 --port 8000 --reload
) else (
    set "PYTHONPATH=%CD%"
    python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
)
pause
