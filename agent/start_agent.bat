@echo off
setlocal

cd /d "%~dp0"

echo.
echo ==========================================
echo       SentinelTwin Endpoint Agent
echo ==========================================
echo.
echo Starting agent...
echo.

if not exist ".venv\Scripts\python.exe" (
    echo ERROR: Agent Python environment not found.
    echo.
    pause
    exit /b 1
)

".venv\Scripts\python.exe" heartbeat.py

echo.
echo ==========================================
echo       SentinelTwin Agent Stopped
echo ==========================================
echo.

pause

endlocal