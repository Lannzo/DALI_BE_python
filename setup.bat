@echo off
REM ============================================================
REM DALI E-Commerce - Quick Setup Script for Windows
REM ============================================================
REM This script automates the development environment setup.
REM Run this from the project root directory.
REM ============================================================

echo.
echo ============================================================
echo  DALI E-Commerce - Quick Setup
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.10+ from https://python.org
    pause
    exit /b 1
)

REM Run the Python setup script
python setup.py %*

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Setup encountered issues. Please check the errors above.
    pause
    exit /b 1
)

echo.
echo Setup script completed!
pause
