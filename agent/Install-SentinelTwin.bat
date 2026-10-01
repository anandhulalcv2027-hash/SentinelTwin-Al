@echo off
setlocal EnableExtensions

cd /d "%~dp0"

set "TASK_NAME=SentinelTwin Endpoint Agent"
set "AGENT_EXE=%~dp0SentinelTwinAgent.exe"
set "INSTALL_DIR=%~dp0"
set "CLEANUP_SCRIPT=%TEMP%\SentinelTwinCleanup_%RANDOM%.cmd"

echo.
echo ==========================================
echo       SentinelTwin AI Agent
echo ==========================================
echo.
echo 1. Install Agent
echo 2. Uninstall Agent
echo 3. Exit
echo.

choice /C 123 /N /M "Select an option: "

if errorlevel 3 goto :END
if errorlevel 2 goto :UNINSTALL
if errorlevel 1 goto :INSTALL


:INSTALL

echo.
echo ==========================================
echo       Installing SentinelTwin Agent
echo ==========================================
echo.

if not exist "%AGENT_EXE%" (
    echo ERROR: SentinelTwinAgent.exe not found.
    echo.
    pause
    exit /b 1
)

if not exist "%~dp0.env" (
    echo ERROR: .env configuration not found.
    echo.
    pause
    exit /b 1
)

echo Creating Windows startup task...
echo.

schtasks /Create ^
 /TN "%TASK_NAME%" ^
 /TR "\"%AGENT_EXE%\"" ^
 /SC ONLOGON ^
 /RL LIMITED ^
 /F

if errorlevel 1 (
    echo.
    echo ERROR: Failed to create Windows startup task.
    echo Please run this installer as Administrator.
    echo.
    pause
    exit /b 1
)

echo.
echo Installation completed successfully.
echo.

echo Starting SentinelTwin Agent...
echo.

schtasks /Run /TN "%TASK_NAME%"

if errorlevel 1 (
    echo.
    echo WARNING: The startup task was created,
    echo but the agent could not be started immediately.
    echo It will start at the next Windows login.
    echo.
    pause
    exit /b 0
)

echo SentinelTwin Agent started successfully.
echo.
echo You may close this installer window.
echo The agent will continue running in the background.
echo.

pause
goto :END


:UNINSTALL

echo.
echo ==========================================
echo       Uninstalling SentinelTwin Agent
echo ==========================================
echo.

echo Stopping SentinelTwin Agent...
taskkill /IM SentinelTwinAgent.exe /F >nul 2>&1

if errorlevel 1 (
    echo Agent process was not running.
) else (
    echo Agent process stopped.
)

echo.
echo Removing Windows startup task...

schtasks /Delete /TN "%TASK_NAME%" /F >nul 2>&1

if errorlevel 1 (
    echo.
    echo ERROR: Could not remove the scheduled task.
    echo Please run this installer as Administrator.
    echo.
    pause
    exit /b 1
)

echo Scheduled task removed successfully.

echo.
echo Preparing cleanup...

(
    echo @echo off
    echo timeout /t 2 /nobreak ^>nul
    echo rmdir /S /Q "%INSTALL_DIR%"
    echo del "%%~f0"
) > "%CLEANUP_SCRIPT%"

echo.
echo SentinelTwin Agent has been uninstalled.
echo Automatic startup has been disabled.
echo.
echo The installer will now close and remove its files.
echo.

start "" /min cmd /c call "%CLEANUP_SCRIPT%"

exit /b 0


:END

endlocal
exit /b 0