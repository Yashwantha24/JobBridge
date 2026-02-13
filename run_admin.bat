@echo off
cd admin
echo Starting Admin Panel...
call venv\Scripts\activate
python manage.py runserver
pause
