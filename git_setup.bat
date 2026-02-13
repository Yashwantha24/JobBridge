@echo off
echo ===================================================
echo   JobBridge - GitHub Upload Fixer & Initializer
echo ===================================================

:: 1. Initialize Git if not present
if not exist ".git" (
    echo [INFO] Initializing new Git repository...
    git init
) else (
    echo [INFO] Git repository already exists.
)

:: 2. Configure User (Generic fallback)
git config user.email "you@example.com"
git config user.name "JobBridge User"

:: 3. Remove pgdata from git cache if it was accidentally added
echo [INFO] Ensuring pgdata is not tracked...
git rm -r --cached pgdata 2>nul
git rm -r --cached node_modules 2>nul
git rm -r --cached .env 2>nul
git rm -r --cached dist 2>nul

:: 4. Add all files (respecting the new .gitignore)
echo [INFO] Adding files to stage...
git add .

:: 5. Commit
echo [INFO] Committing files...
git commit -m "feat: Initial commit with deployment config and gitignore fixes"

echo.
echo ===================================================
echo [SUCCESS] Project is ready to be pushed to GitHub!
echo ===================================================
echo.
echo NEXT STEPS:
echo 1. Create a new repository on GitHub (https://github.com/new)
echo 2. Copy the URL (e.g., https://github.com/yourname/job-bridge.git)
echo 3. Run the following commands:
echo.
echo    git remote add origin YOUR_GITHUB_URL
echo    git branch -M main
echo    git push -u origin main
echo.
:: pause
