@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo PostgreSQL Repair & Start Script for Windows
echo ==========================================

:: 1. Find PostgreSQL Installation
echo [1/5] Searching for PostgreSQL...
set "PG_DIR="
for %%d in (16 15 14 13 12) do (
    if exist "C:\Program Files\PostgreSQL\%%d\bin\pg_ctl.exe" (
        set "PG_DIR=C:\Program Files\PostgreSQL\%%d"
        echo Found PostgreSQL version %%d at !PG_DIR!
        goto :FoundPG
    )
)

echo Error: Could not find PostgreSQL in C:\Program Files\PostgreSQL.
echo Please reinstall PostgreSQL from https://www.postgresql.org/download/
pause
exit /b

:FoundPG
set "BIN_DIR=%PG_DIR%\bin"
set "DATA_DIR=%PG_DIR%\data"
set "PATH=%PATH%;%BIN_DIR%"

:: 2. Check Data Directory
echo [2/5] Checking Data Directory at %DATA_DIR%...
if not exist "%DATA_DIR%" (
    echo Data directory missing. Creating it...
    mkdir "%DATA_DIR%"
    echo Initializing database cluster...
    "%BIN_DIR%\initdb.exe" -D "%DATA_DIR%" -U postgres -W -A scram-sha-256 -E UTF8
    if %errorlevel% neq 0 (
        echo Error: Failed to initialize database. check permissions.
        pause
        exit /b
    )
    echo Database initialized.
) else (
    if not exist "%DATA_DIR%\postgresql.conf" (
       echo Data directory exists but is empty/corrupt.
       echo Please delete "%DATA_DIR%" and run this script again.
       pause
       exit /b
    )
    echo Data directory is valid.
)

:: 3. Check for Port Conflict
echo [3/5] Checking Port 5432...
netstat -an | findstr ":5432" >nul
if %errorlevel% equ 0 (
    echo Port 5432 is already in use. PostgreSQL might already be running.
    echo Trying to connect...
    "%BIN_DIR%\pg_isready" -h localhost -p 5432
    if %errorlevel% equ 0 (
        echo PostgreSQL is ALREADY RUNNING! You are good to go.
        goto :Success
    ) else (
        echo Port 5432 is in use by another application.
        echo Please identify and stop it, or change postgresql.conf port.
        pause
        exit /b
    )
)

:: 4. Start PostgreSQL Manually
echo [4/5] Attempting to start PostgreSQL...
"%BIN_DIR%\pg_ctl.exe" -D "%DATA_DIR%" -l "%PG_DIR%\logfile.txt" start
timeout /t 5 >nul

:: Verify
"%BIN_DIR%\pg_isready" -h localhost -p 5432
if %errorlevel% neq 0 (
    echo Failed to start PostgreSQL. Check "%PG_DIR%\logfile.txt" for details.
    type "%PG_DIR%\logfile.txt"
    pause
    exit /b
)

:: 5. Register Service (Optional but recommended)
echo [5/5] Checking Windows Service...
sc query "postgresql-x64-15" >nul 2>nul
if %errorlevel% neq 0 (
    echo Service not found. Do you want to register it? (Run as Admin required)
    echo This ensures PostgreSQL starts automatically on reboot.
    echo Run this command in Admin CMD:
    echo "%BIN_DIR%\pg_ctl.exe" register -N "postgresql-x64-15" -D "%DATA_DIR%"
)

:Success
echo.
echo ==========================================
echo SUCCESS! PostgreSQL is running on port 5432.
echo ==========================================
echo You can now run 'run_project.bat' to start the application.
echo.
pause
