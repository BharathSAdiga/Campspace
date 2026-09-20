@echo off
setlocal

echo ============================================
echo   CampSpace ^| Starting Development Servers
echo ============================================
echo.

:: Check and install backend dependencies if missing
if not exist "%~dp0server\node_modules\" (
  echo [Backend] Installing dependencies, please wait...
  cd /d "%~dp0server"
  call npm install
)

:: Check and install frontend dependencies if missing
if not exist "%~dp0client\node_modules\" (
  echo [Frontend] Installing dependencies, please wait...
  cd /d "%~dp0client"
  call npm install
)

:: Start Backend Server (cmd /k keeps window open if an error occurs)
echo Starting Backend Server on port 5000...
cd /d "%~dp0server"
start "CampSpace Backend (Port 5000)" cmd /k "npm run dev"

:: Start Frontend Server
echo Starting Frontend Server on port 5173...
cd /d "%~dp0client"
start "CampSpace Frontend (Port 5173)" cmd /k "npm run dev"

echo.
echo ============================================
echo Servers initiated:
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:5000
echo - Backend Health: http://localhost:5000/api/health
echo ============================================

endlocal
