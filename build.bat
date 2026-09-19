@echo off
setlocal enabledelayedexpansion

echo.
echo ============================================
echo   Camspace ^| Build Script
echo ============================================
echo.

:: Move into the client directory
cd /d "%~dp0client"

:: Check if node_modules exists; install if not
if not exist "node_modules\" (
    echo [1/2] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] npm install failed. Aborting.
        pause
        exit /b 1
    )
    echo [1/2] Dependencies installed.
) else (
    echo [1/2] node_modules found, skipping install.
)

echo.
echo [2/2] Building for production...
call npm run build
if errorlevel 1 (
    echo.
    echo [ERROR] Build failed. Check the output above.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   Build complete!
echo   Output: client\dist\
echo ============================================
echo.
pause

endlocal
