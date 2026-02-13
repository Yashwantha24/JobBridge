@echo off
echo Starting Job ^& Internship Portal Setup...

:: Attempt to add common paths to PATH (in case they are not in system PATH yet)
set "PATH=%PATH%;C:\Program Files\nodejs"
set "PATH=%PATH%;C:\Program Files\PostgreSQL\18\bin;C:\Program Files\PostgreSQL\15\bin;C:\Program Files\PostgreSQL\14\bin;C:\Program Files\PostgreSQL\16\bin"
:: Python standard installs
set "PATH=%PATH%;C:\Python312;C:\Python312\Scripts;C:\Python311;C:\Python311\Scripts;C:\Python310;C:\Python310\Scripts"
:: Python user installs
set "PATH=%PATH%;C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python312;C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python312\Scripts"
set "PATH=%PATH%;C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python311;C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python311\Scripts"
set "PATH=%PATH%;C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python310;C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python310\Scripts"

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not found.
    echo Please ensure it is installed or add it to your PATH.
    set /p NODE_PATH="Enter full path to node.exe (or press Enter to skip): "
    if not "%NODE_PATH%"=="" set "PATH=%PATH%;%NODE_PATH%"
)

:: Check for Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Python is not found.
    echo Please ensure it is installed or add it to your PATH.
    set /p PYTHON_PATH="Enter full path to python.exe (or press Enter to skip): "
    if not "%PYTHON_PATH%"=="" set "PATH=%PATH%;%PYTHON_PATH%"
)

:: Start Local PostgreSQL
if exist "pgdata" (
    echo Starting Local PostgreSQL...
    "C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" -D "%~dp0pgdata" -l "%~dp0pg_log.txt" start
)

:: Setup Backend
echo Setting up Backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)
start "Backend Server" cmd /k "npm run dev"
cd ..

:: Setup Frontend
echo Setting up Frontend...
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)
start "Frontend Client" cmd /k "npm run dev"
cd ..

:: Setup Admin
echo Setting up Admin Panel...
cd admin
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo Installing admin dependencies...
pip install -r requirements.txt

:: Check for psql just for info, though valid connection string might work without psql cli
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo Warning: psql not found. Database migration might fail if DB doesn't exist.
)

echo Migrating database...
python manage.py migrate --fake-initial
echo Creating superuser (interactive)...
:: python manage.py createsuperuser
start "Admin Panel" cmd /k "python manage.py runserver"
cd ..

echo All services are starting...
echo Backend running on http://localhost:5000
echo Frontend running on http://localhost:5173
echo Admin Panel running on http://localhost:8000/admin
:: pause
