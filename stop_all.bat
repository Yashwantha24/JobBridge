@echo off
echo Stopping all Job Portal services...

:: Stop Node.js (Backend & Frontend)
taskkill /F /IM node.exe /T 2>nul
if %errorlevel% equ 0 echo Stopped Node.js processes.

:: Stop Python (Django Admin)
taskkill /F /IM python.exe /T 2>nul
if %errorlevel% equ 0 echo Stopped Python processes.

:: Stop PostgreSQL (Local DB)
taskkill /F /IM postgres.exe /T 2>nul
if %errorlevel% equ 0 echo Stopped PostgreSQL processes.

echo.
echo All services have been stopped.
pause
