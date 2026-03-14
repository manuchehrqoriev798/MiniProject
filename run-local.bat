@echo off
REM One window: backend runs in background, frontend in foreground. Double-click run-local.bat only.
setlocal
cd /d "%~dp0"
set "ROOT=%cd%"

if not exist "backend" (
  echo Backend folder not found. Put backend and frontend in this folder.
  pause
  exit /b 1
)
if not exist "frontend" (
  echo Frontend folder not found. Put backend and frontend in this folder.
  pause
  exit /b 1
)

where python >nul 2>nul
if errorlevel 1 (
  echo Python is not installed or not available in PATH.
  echo Install Python 3.11+ and make sure "python" works in Command Prompt.
  pause
  exit /b 1
)

call :ensure_npm
if errorlevel 1 goto :fail

REM If PostgreSQL is not running on port 5432, use SQLite
set USE_SQLITE=
python -c "import socket; s=socket.socket(); s.settimeout(2); s.connect(('127.0.0.1', 5432)); s.close()" 2>nul || set USE_SQLITE=1
if defined USE_SQLITE (
  echo PostgreSQL not detected. Using SQLite for this run.
  echo.
)

echo === Setting up backend (same window) ===
cd backend
if defined USE_SQLITE set USE_SQLITE=1
if not exist venv python -m venv venv
if errorlevel 1 goto :fail
call venv\Scripts\activate.bat
pip install -r requirements.txt
if errorlevel 1 goto :fail
alembic upgrade head
if errorlevel 1 goto :fail
python seed.py
if errorlevel 1 goto :fail

echo.
echo Starting backend in background on http://localhost:8000 ...
start /b uvicorn app.main:app --reload --port 8000
if errorlevel 1 goto :fail
cd ..

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo === Setting up frontend ===
cd frontend
call npm install
if errorlevel 1 goto :fail
echo Opening browser at http://localhost:3000 ...
start "" cmd /c "timeout /t 5 /nobreak >nul && start http://localhost:3000"
call npm start
if errorlevel 1 goto :fail

exit /b 0

:ensure_npm
where npm >nul 2>nul
if not errorlevel 1 exit /b 0

echo Node.js/npm not found in PATH.
echo Attempting automatic local Node.js setup in .tools\node ...

set "NODE_HOME=%ROOT%\.tools\node\node-win-x64"
if exist "%NODE_HOME%\npm.cmd" (
  set "PATH=%NODE_HOME%;%PATH%"
  where npm >nul 2>nul
  if not errorlevel 1 (
    echo Using existing local Node.js from .tools\node
    exit /b 0
  )
)

where powershell >nul 2>nul
if errorlevel 1 (
  echo PowerShell not found. Cannot auto-install Node.js.
  echo Please install Node.js from https://nodejs.org and run again.
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $root=Resolve-Path '%ROOT%'; $tools=Join-Path $root '.tools\\node'; $zip=Join-Path $tools 'node.zip'; $tmp=Join-Path $tools 'tmp'; New-Item -ItemType Directory -Force -Path $tools | Out-Null; $list=Invoke-RestMethod 'https://nodejs.org/dist/index.json'; $entry=$list | Where-Object { $_.lts -and ($_.files -contains 'win-x64-zip') } | Select-Object -First 1; if(-not $entry){ throw 'Could not find an LTS win-x64 zip build.' }; $v=$entry.version; $url='https://nodejs.org/dist/' + $v + '/node-' + $v + '-win-x64.zip'; Write-Host ('Downloading ' + $url); Invoke-WebRequest -Uri $url -OutFile $zip; if(Test-Path $tmp){ Remove-Item -Recurse -Force $tmp }; New-Item -ItemType Directory -Path $tmp | Out-Null; Expand-Archive -Path $zip -DestinationPath $tmp -Force; $expanded=Get-ChildItem -Path $tmp -Directory | Select-Object -First 1; if(-not $expanded){ throw 'Node archive extraction failed.' }; $dest=Join-Path $tools 'node-win-x64'; if(Test-Path $dest){ Remove-Item -Recurse -Force $dest }; Move-Item -Path $expanded.FullName -Destination $dest; Remove-Item -Force $zip; Remove-Item -Recurse -Force $tmp; Write-Host 'Local Node.js ready.'"
if errorlevel 1 (
  echo Automatic Node.js setup failed.
  echo Ensure internet access is available and try again.
  exit /b 1
)

set "PATH=%NODE_HOME%;%PATH%"
where npm >nul 2>nul
if errorlevel 1 (
  echo Local Node.js was downloaded but npm is still unavailable.
  exit /b 1
)

echo Node.js/npm setup complete.
exit /b 0

:fail
echo.
echo Run failed. See the error messages above.
pause
exit /b 1
