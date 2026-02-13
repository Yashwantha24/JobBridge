@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo PostgreSQL Advanced Troubleshooting Script
echo ==========================================

:: 1. LOCATE POSTGRESQL BINARIES
echo [1/6] Searching for PostgreSQL Binaries...
set "PG_HOME="
:: Check standard locations
for %%d in (16 15 14 13 12 11 10) do (
    if exist "C:\Program Files\PostgreSQL\%%d\bin\pg_ctl.exe" (
        set "PG_HOME=C:\Program Files\PostgreSQL\%%d"
        goto :Found
    )
    if exist "C:\Program Files (x86)\PostgreSQL\%%d\bin\pg_ctl.exe" (
        set "PG_HOME=C:\Program Files (x86)\PostgreSQL\%%d"
        goto :Found
    )
)

:: Deep search if not found (might be slow)
echo Standard paths failed. Searching C:\ drive...
cd \
dir /s /b pg_ctl.exe > pg_found.txt
set /p PG_CTL_PATH=<pg_found.txt
del pg_found.txt

if "%PG_CTL_PATH%"=="" (
    echo CRITICAL ERROR: PostgreSQL is NOT installed or pg_ctl.exe is missing.
    echo Please install it from https://www.postgresql.org/download/windows/
    pause
    exit /b
)

:: Extract root path from pg_ctl path
for %%F in ("%PG_CTL_PATH%") do set "BIN_DIR=%%~dpF"
:: Setup paths from BIN_DIR (remove trailing backslash first if needed, though dpF keeps it)
set "PG_HOME=%BIN_DIR%.."
goto :FoundCustom

:Found
set "BIN_DIR=%PG_HOME%\bin"

:FoundCustom
echo Found PostgreSQL at: %PG_HOME%
set "PATH=%PATH%;%BIN_DIR%"

:: 2. LOCATE/CREATE DATA DIRECTORY
echo [2/6] Checking Data Directory...
set "DATA_DIR=%PG_HOME%\data"

if not exist "%DATA_DIR%" (
    echo Data directory not found at default location.
    echo Creating new data directory at %DATA_DIR%...
    mkdir "%DATA_DIR%"
    
    echo [3/6] Initializing Database...
    "%BIN_DIR%\initdb.exe" -D "%DATA_DIR%" -U postgres -W -A scram-sha-256 -E UTF8
    if !errorlevel! neq 0 (
        echo Initdb failed. Check permissions or run as Administrator.
        pause
        exit /b
    )
    echo Database initialized successfully.
) else (
    if not exist "%DATA_DIR%\postgresql.conf" (
        echo Data directory exists but seems empty. Re-initializing...
        "%BIN_DIR%\initdb.exe" -D "%DATA_DIR%" -U postgres -W -A scram-sha-256 -E UTF8
    ) else (
        echo Valid Data directory found.
    )
)

:: 3. CONFIGURE PORT (Ensure 5432)
echo [4/6] Verifying Port Configuration...
findstr /C:"port = 5432" "%DATA_DIR%\postgresql.conf" >nul
if !errorlevel! neq 0 (
    echo Warning: Port might not be 5432. resetting to 5432...
    echo port = 5432 >> "%DATA_DIR%\postgresql.conf"
)

:: 4. START SERVER
echo [5/6] Starting PostgreSQL Server...
"%BIN_DIR%\pg_ctl.exe" -D "%DATA_DIR%" -l "%PG_HOME%\logfile.txt" stop >nul 2>nul
"%BIN_DIR%\pg_ctl.exe" -D "%DATA_DIR%" -l "%PG_HOME%\logfile.txt" start

timeout /t 5 >nul

:: 5. VERIFY CONNECTION
echo [6/6] Verifying Connection...
netstat -an | findstr "5432"
if !errorlevel! equ 0 (
    echo SUCCESS: PostgreSQL is listening on port 5432!
    
    :: Register Service for future
    echo Registering Windows Service (requires Admin)...
    "%BIN_DIR%\pg_ctl.exe" register -N "postgresql-custom" -D "%DATA_DIR%"
    echo Service registered as 'postgresql-custom'.
) else (
    echo FAILURE: Port 5432 is not open. checking logs...
    type "%PG_HOME%\logfile.txt"
)

pause
