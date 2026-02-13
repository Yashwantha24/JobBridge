@echo off
if not exist "pgdata" goto Error
echo Starting Local PostgreSQL (v18)...
"C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" -D "%~dp0pgdata" -l "%~dp0pg_log.txt" start
echo Database started successfully!
goto End

:Error
echo Error: 'pgdata' folder not found in this directory.
echo Please ensure the database is initialized.

:End
pause
