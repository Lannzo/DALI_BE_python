#!/usr/bin/env python3
"""
DALI E-Commerce - Automated Setup Script
=========================================
This script helps you set up the development environment and database.

Usage:
    python setup.py              # Interactive setup
    python setup.py --check      # Check if everything is configured
    python setup.py --db-only    # Only setup database (skip env creation)
    python setup.py --reset-db   # Reset database (WARNING: deletes all data)
"""

import os
import sys
import subprocess
import shutil
import getpass
from pathlib import Path

# Color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD} {text}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")

def print_step(step_num, text):
    print(f"{Colors.CYAN}[Step {step_num}]{Colors.ENDC} {text}")

def print_success(text):
    print(f"{Colors.GREEN}✓ {text}{Colors.ENDC}")

def print_warning(text):
    print(f"{Colors.WARNING}⚠ {text}{Colors.ENDC}")

def print_error(text):
    print(f"{Colors.FAIL}✗ {text}{Colors.ENDC}")

def print_info(text):
    print(f"{Colors.BLUE}ℹ {text}{Colors.ENDC}")

def get_project_root():
    """Get the project root directory."""
    return Path(__file__).parent.absolute()

def check_python_version():
    """Check if Python version is 3.10+"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 10):
        print_error(f"Python 3.10+ required. You have {version.major}.{version.minor}")
        return False
    print_success(f"Python version: {version.major}.{version.minor}.{version.micro}")
    return True

def check_postgres():
    """Check if PostgreSQL is installed and accessible."""
    # Common PostgreSQL installation paths on Windows
    common_paths = [
        r"C:\Program Files\PostgreSQL\16\bin\psql.exe",
        r"C:\Program Files\PostgreSQL\15\bin\psql.exe",
        r"C:\Program Files\PostgreSQL\14\bin\psql.exe",
        r"C:\Program Files\PostgreSQL\17\bin\psql.exe",
    ]
    
    try:
        result = subprocess.run(
            ["psql", "--version"],
            capture_output=True,
            text=True,
            shell=True
        )
        if result.returncode == 0:
            print_success(f"PostgreSQL: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass
    
    # Check common installation paths on Windows
    for path in common_paths:
        if os.path.exists(path):
            print_success(f"PostgreSQL found at: {path}")
            print_warning("psql not in PATH. Add PostgreSQL bin folder to PATH for easier access.")
            return True
    
    print_error("PostgreSQL not found. Please install PostgreSQL.")
    print_info("Download from: https://www.postgresql.org/download/")
    print_info("After installation, add the 'bin' folder to your PATH")
    return False

def find_psql():
    """Find the psql executable path."""
    # First try the PATH
    try:
        result = subprocess.run(
            ["psql", "--version"],
            capture_output=True,
            text=True,
            shell=True
        )
        if result.returncode == 0:
            return "psql"
    except FileNotFoundError:
        pass
    
    # Check common installation paths on Windows
    common_paths = [
        r"C:\Program Files\PostgreSQL\17\bin\psql.exe",
        r"C:\Program Files\PostgreSQL\16\bin\psql.exe",
        r"C:\Program Files\PostgreSQL\15\bin\psql.exe",
        r"C:\Program Files\PostgreSQL\14\bin\psql.exe",
    ]
    
    for path in common_paths:
        if os.path.exists(path):
            return path
    
    return None

def check_node():
    """Check if Node.js is installed."""
    try:
        result = subprocess.run(
            ["node", "--version"],
            capture_output=True,
            text=True,
            shell=True
        )
        if result.returncode == 0:
            print_success(f"Node.js version: {result.stdout.strip()}")
            return True
        else:
            print_error("Node.js not found")
            return False
    except FileNotFoundError:
        print_warning("Node.js not found. Required for frontend only.")
        return False

def check_env_file():
    """Check if .env file exists."""
    env_path = get_project_root() / ".env"
    if env_path.exists():
        print_success(".env file exists")
        return True
    else:
        print_warning(".env file not found")
        return False

def check_venv():
    """Check if virtual environment exists."""
    venv_path = get_project_root() / "venv"
    if venv_path.exists() and (venv_path / "Scripts" / "python.exe").exists():
        print_success("Virtual environment exists")
        return True
    elif venv_path.exists() and (venv_path / "bin" / "python").exists():
        print_success("Virtual environment exists")
        return True
    else:
        print_warning("Virtual environment not found")
        return False

def create_env_file():
    """Create .env file from template."""
    project_root = get_project_root()
    env_example = project_root / ".env.example"
    env_file = project_root / ".env"
    
    if env_file.exists():
        response = input("  .env file already exists. Overwrite? (y/N): ").strip().lower()
        if response != 'y':
            print_info("Keeping existing .env file")
            return True
    
    if not env_example.exists():
        print_error(".env.example not found!")
        return False
    
    # Read template
    with open(env_example, 'r') as f:
        template = f.read()
    
    print_info("Let's configure your environment...")
    print()
    
    # Get database password
    db_password = getpass.getpass("  Enter PostgreSQL password (default: postgres): ").strip()
    if not db_password:
        db_password = "postgres"
    
    # Get database name
    db_name = input("  Enter database name (default: dali_db): ").strip()
    if not db_name:
        db_name = "dali_db"
    
    # Generate secret keys
    import secrets
    secret_key = secrets.token_hex(32)
    session_key = secrets.token_hex(32)
    
    # Replace values in template
    env_content = template.replace(
        "DATABASE_URL=postgresql://postgres:your_password_here@localhost:5432/dali_db",
        f"DATABASE_URL=postgresql://postgres:{db_password}@localhost:5432/{db_name}"
    ).replace(
        "SECRET_KEY=change-this-to-a-random-secret-key-at-least-32-chars",
        f"SECRET_KEY={secret_key}"
    ).replace(
        "SESSION_SECRET_KEY=change-this-to-another-random-secret-key",
        f"SESSION_SECRET_KEY={session_key}"
    )
    
    # Optional: Email configuration
    setup_email = input("  Configure email settings? (y/N): ").strip().lower()
    if setup_email == 'y':
        smtp_email = input("    SMTP Username (Gmail): ").strip()
        smtp_password = getpass.getpass("    SMTP Password (App Password): ").strip()
        env_content = env_content.replace(
            "SMTP_USERNAME=your_email@gmail.com",
            f"SMTP_USERNAME={smtp_email}"
        ).replace(
            "SMTP_PASSWORD=your_gmail_app_password",
            f"SMTP_PASSWORD={smtp_password}"
        )
    
    # Write .env file
    with open(env_file, 'w') as f:
        f.write(env_content)
    
    print_success(f".env file created at {env_file}")
    return True

def create_virtual_env():
    """Create Python virtual environment."""
    project_root = get_project_root()
    venv_path = project_root / "venv"
    
    if venv_path.exists():
        print_info("Virtual environment already exists")
        return True
    
    print_info("Creating virtual environment...")
    result = subprocess.run(
        [sys.executable, "-m", "venv", str(venv_path)],
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        print_success("Virtual environment created")
        return True
    else:
        print_error(f"Failed to create venv: {result.stderr}")
        return False

def install_dependencies():
    """Install Python dependencies."""
    project_root = get_project_root()
    
    # Determine pip path based on OS
    if sys.platform == "win32":
        pip_path = project_root / "venv" / "Scripts" / "pip.exe"
    else:
        pip_path = project_root / "venv" / "bin" / "pip"
    
    if not pip_path.exists():
        print_error("pip not found in virtual environment")
        return False
    
    print_info("Installing Python dependencies...")
    result = subprocess.run(
        [str(pip_path), "install", "-r", str(project_root / "requirements.txt")],
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        print_success("Dependencies installed")
        return True
    else:
        print_error(f"Failed to install dependencies")
        print(result.stderr)
        return False

def setup_database(db_password="postgres", db_name="dali_db", reset=False):
    """Set up the PostgreSQL database."""
    project_root = get_project_root()
    
    # Find psql executable
    psql = find_psql()
    if not psql:
        print_error("PostgreSQL (psql) not found!")
        print_info("Please install PostgreSQL and add the 'bin' folder to your PATH")
        print_info("Or manually run the SQL files using pgAdmin")
        return False
    
    # Build psql command with password
    env = os.environ.copy()
    env["PGPASSWORD"] = db_password
    
    if reset:
        print_warning("Resetting database - ALL DATA WILL BE DELETED!")
        confirm = input("  Type 'RESET' to confirm: ").strip()
        if confirm != "RESET":
            print_info("Database reset cancelled")
            return False
    
    # Check if database exists
    print_info(f"Checking if database '{db_name}' exists...")
    result = subprocess.run(
        [psql, "-U", "postgres", "-h", "localhost", "-lqt"],
        capture_output=True,
        text=True,
        env=env
    )
    
    db_exists = db_name in result.stdout
    
    if reset and db_exists:
        print_info(f"Dropping database '{db_name}'...")
        subprocess.run(
            [psql, "-U", "postgres", "-h", "localhost", "-c", f"DROP DATABASE IF EXISTS {db_name};"],
            env=env
        )
        db_exists = False
    
    if not db_exists:
        print_info(f"Creating database '{db_name}'...")
        result = subprocess.run(
            [psql, "-U", "postgres", "-h", "localhost", "-c", f"CREATE DATABASE {db_name};"],
            capture_output=True,
            text=True,
            env=env
        )
        if result.returncode != 0:
            print_error(f"Failed to create database: {result.stderr}")
            return False
        print_success(f"Database '{db_name}' created")
    else:
        print_info(f"Database '{db_name}' already exists")
    
    # Run schema.sql
    print_info("Running schema.sql...")
    schema_path = project_root / "schema.sql"
    result = subprocess.run(
        [psql, "-U", "postgres", "-h", "localhost", "-d", db_name, "-f", str(schema_path)],
        capture_output=True,
        text=True,
        env=env
    )
    if result.returncode != 0 and "already exists" not in result.stderr.lower():
        # Check if it's just notices about existing tables
        if "ERROR" in result.stderr:
            print_error(f"Schema errors: {result.stderr}")
        else:
            print_success("Schema applied (with warnings)")
    else:
        print_success("Schema applied successfully")
    
    # Ask about sample data
    load_data = input("  Load sample data (stores, products, etc.)? (Y/n): ").strip().lower()
    if load_data != 'n':
        print_info("Loading sample data (this may take a moment)...")
        data_path = project_root / "data.sql"
        result = subprocess.run(
            [psql, "-U", "postgres", "-h", "localhost", "-d", db_name, "-f", str(data_path)],
            capture_output=True,
            text=True,
            env=env
        )
        if result.returncode == 0 or "already exists" in result.stderr.lower() or "duplicate" in result.stderr.lower():
            print_success("Sample data loaded")
        else:
            print_warning(f"Data may have been partially loaded: {result.stderr[:200]}")
    
    return True

def run_checks():
    """Run all prerequisite checks."""
    print_header("Checking Prerequisites")
    
    all_ok = True
    
    print_step(1, "Python version")
    all_ok &= check_python_version()
    
    print_step(2, "PostgreSQL")
    all_ok &= check_postgres()
    
    print_step(3, "Node.js (for frontend)")
    check_node()  # Optional, don't fail
    
    print_step(4, "Virtual environment")
    all_ok &= check_venv()
    
    print_step(5, "Environment file (.env)")
    all_ok &= check_env_file()
    
    return all_ok

def full_setup():
    """Run the full setup process."""
    print_header("DALI E-Commerce Setup")
    print("This script will help you set up the development environment.\n")
    
    # Check Python version first
    if not check_python_version():
        sys.exit(1)
    
    # Check PostgreSQL
    print_step(1, "Checking PostgreSQL...")
    if not check_postgres():
        print_error("Please install PostgreSQL before continuing.")
        print_info("Download from: https://www.postgresql.org/download/")
        sys.exit(1)
    
    # Create virtual environment
    print_step(2, "Setting up Python virtual environment...")
    if not create_virtual_env():
        sys.exit(1)
    
    # Install dependencies
    print_step(3, "Installing Python dependencies...")
    if not install_dependencies():
        sys.exit(1)
    
    # Create .env file
    print_step(4, "Configuring environment variables...")
    if not create_env_file():
        sys.exit(1)
    
    # Read .env to get database credentials
    env_file = get_project_root() / ".env"
    db_password = "postgres"
    db_name = "dali_db"
    
    with open(env_file, 'r') as f:
        for line in f:
            if line.startswith("DATABASE_URL="):
                # Parse DATABASE_URL
                url = line.split("=", 1)[1].strip()
                if "@" in url and ":" in url:
                    try:
                        # postgresql://user:password@host:port/dbname
                        parts = url.split("://")[1]
                        auth_host = parts.split("@")
                        if len(auth_host) >= 2:
                            user_pass = auth_host[0].split(":")
                            if len(user_pass) >= 2:
                                db_password = user_pass[1]
                            host_db = auth_host[1].split("/")
                            if len(host_db) >= 2:
                                db_name = host_db[1]
                    except:
                        pass
                break
    
    # Set up database
    print_step(5, "Setting up PostgreSQL database...")
    if not setup_database(db_password, db_name):
        print_warning("Database setup had issues. You may need to set it up manually.")
    
    # Final summary
    print_header("Setup Complete! 🎉")
    print("To start the backend server:\n")
    
    if sys.platform == "win32":
        print(f"  {Colors.CYAN}.\\venv\\Scripts\\Activate.ps1{Colors.ENDC}")
    else:
        print(f"  {Colors.CYAN}source venv/bin/activate{Colors.ENDC}")
    
    print(f"  {Colors.CYAN}python main.py{Colors.ENDC}")
    print()
    print(f"Backend will run at: {Colors.GREEN}http://localhost:8000{Colors.ENDC}")
    print(f"API docs available at: {Colors.GREEN}http://localhost:8000/docs{Colors.ENDC}")
    print()
    
    print("To start the frontend:\n")
    print(f"  {Colors.CYAN}cd frontend{Colors.ENDC}")
    print(f"  {Colors.CYAN}npm install{Colors.ENDC}")
    print(f"  {Colors.CYAN}npm run dev{Colors.ENDC}")
    print()
    print(f"Frontend will run at: {Colors.GREEN}http://localhost:5173{Colors.ENDC}")
    print()

def main():
    """Main entry point."""
    args = sys.argv[1:]
    
    if "--check" in args:
        success = run_checks()
        if success:
            print_success("\nAll checks passed!")
        else:
            print_error("\nSome checks failed. Run 'python setup.py' to fix.")
        sys.exit(0 if success else 1)
    
    elif "--db-only" in args:
        print_header("Database Setup Only")
        db_password = getpass.getpass("Enter PostgreSQL password: ").strip() or "postgres"
        db_name = input("Enter database name (default: dali_db): ").strip() or "dali_db"
        setup_database(db_password, db_name)
    
    elif "--reset-db" in args:
        print_header("Database Reset")
        db_password = getpass.getpass("Enter PostgreSQL password: ").strip() or "postgres"
        db_name = input("Enter database name (default: dali_db): ").strip() or "dali_db"
        setup_database(db_password, db_name, reset=True)
    
    elif "--help" in args or "-h" in args:
        print(__doc__)
    
    else:
        full_setup()

if __name__ == "__main__":
    main()
