@echo off
setlocal EnableExtensions
title School TV Control System - Launcher
cd /d "%~dp0"

echo ==================================================
echo    School TV Control System - Server Launcher
echo ==================================================
echo.

rem ---------- Locate or create the Python environment ----------
set "PYTHON="
if exist ".venv\Scripts\python.exe" set "PYTHON=.venv\Scripts\python.exe"

if defined PYTHON goto :env_ready

echo [Setup] No virtual environment found. Creating one...
where uv >nul 2>nul
if %errorlevel% equ 0 (
    echo [Setup] Using uv...
    uv venv || goto :setup_failed
    uv pip install -r requirements.txt -p .venv\Scripts\python.exe || goto :setup_failed
) else (
    echo [Setup] Using built-in venv + pip...
    python -m venv .venv || goto :setup_failed
    .venv\Scripts\python.exe -m pip install -r requirements.txt || goto :setup_failed
)
set "PYTHON=.venv\Scripts\python.exe"
echo [Setup] Done.
echo.

:env_ready

rem ---------- Ask for the admin password ----------
:ask_password
set "NEW_ADMIN_PASSWORD="
set /p "NEW_ADMIN_PASSWORD=Choose an admin password (min 8 characters): "
if not defined NEW_ADMIN_PASSWORD (
    echo Password cannot be empty. Try again.
    echo.
    goto :ask_password
)

set "CONFIRM_PASSWORD="
set /p "CONFIRM_PASSWORD=Confirm the password: "
setlocal EnableDelayedExpansion
if not "!CONFIRM_PASSWORD!"=="!NEW_ADMIN_PASSWORD!" (
    endlocal
    echo The passwords did not match. Try again.
    echo.
    goto :ask_password
)
endlocal

"%PYTHON%" "server\setup_env.py"
if errorlevel 1 (
    echo.
    goto :ask_password
)

rem ---------- Start the server and open the admin panel ----------
echo.
echo Starting School TV Control Server...
start "School TV Server" "%PYTHON%" "server\server.py"

echo Waiting for the server to come online...
set /a TRIES=0

:wait_loop
ping -n 2 127.0.0.1 >nul
powershell -NoProfile -Command "try { Invoke-WebRequest -Uri 'http://127.0.0.1:5000/' -UseBasicParsing -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>nul
if %errorlevel% equ 0 goto :server_up
set /a TRIES+=1
if %TRIES% lss 15 goto :wait_loop

echo WARNING: The server did not respond yet. Check the "School TV Server" window for errors.
start "" "http://127.0.0.1:5000/admin"
goto :done

:server_up
echo Server is running.
start "" "http://127.0.0.1:5000/admin"
echo Admin panel opened in your default browser.

:done
echo.
echo Log in with the password you just chose.
echo To stop the server, close the "School TV Server" window.
echo.
ping -n 9 127.0.0.1 >nul
exit /b 0

:setup_failed
echo.
echo [ERROR] Failed to set up the Python environment.
echo Make sure Python or uv is installed and on PATH, then run this file again.
echo.
pause
exit /b 1
