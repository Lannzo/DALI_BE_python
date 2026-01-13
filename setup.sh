#!/bin/bash
# ============================================================
# DALI E-Commerce - Quick Setup Script for Mac/Linux
# ============================================================
# This script automates the development environment setup.
# Run this from the project root directory.
#
# Usage:
#   chmod +x setup.sh
#   ./setup.sh
# ============================================================

echo ""
echo "============================================================"
echo " DALI E-Commerce - Quick Setup"
echo "============================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python3 is not installed."
    echo "Please install Python 3.10+ using your package manager."
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
echo "Python version: $PYTHON_VERSION"

# Run the Python setup script
python3 setup.py "$@"

if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Setup encountered issues. Please check the errors above."
    exit 1
fi

echo ""
echo "Setup script completed!"
