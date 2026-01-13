# DALI E-Commerce - Development Setup Guide

This guide will help you set up the DALI E-Commerce development environment from scratch.

---

## 🚀 Quick Setup (Recommended)

The fastest way to get started is using the automated setup script:

### Windows
```powershell
# Open PowerShell in the project directory
python setup.py
```

Or double-click `setup.bat`

### Mac/Linux
```bash
chmod +x setup.sh
./setup.sh
```

The script will:
1. ✅ Check prerequisites (Python, PostgreSQL)
2. ✅ Create virtual environment
3. ✅ Install dependencies
4. ✅ Create `.env` file with your settings
5. ✅ Set up PostgreSQL database
6. ✅ Load sample data (optional)

---

## 📋 Prerequisites

Before running setup, make sure you have:

| Software | Version | Download |
|----------|---------|----------|
| **Python** | 3.10+ | [python.org](https://python.org) |
| **PostgreSQL** | 14+ | [postgresql.org](https://postgresql.org/download/) |
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org) (for frontend) |

### Verify Installation

```bash
python --version    # Should show 3.10+
psql --version      # Should show PostgreSQL 14+
node --version      # Should show v18+
```

---

## 🔧 Manual Setup (Step by Step)

If the automated script doesn't work, follow these steps:

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd DALI_BE_Python
```

### Step 2: Create Virtual Environment

```bash
# Windows
python -m venv venv
.\venv\Scripts\Activate.ps1

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Python Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

```bash
# Copy the template
cp .env.example .env

# Edit .env with your values (use your favorite editor)
notepad .env    # Windows
nano .env       # Linux/Mac
```

**Important settings to change:**

```env
# Your PostgreSQL password
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/dali_db

# Generate random secret keys (run this in Python):
# import secrets; print(secrets.token_hex(32))
SECRET_KEY=<paste-generated-key>
SESSION_SECRET_KEY=<paste-another-generated-key>
```

### Step 5: Set Up PostgreSQL Database

**Option A: Using psql command line**

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql prompt:
CREATE DATABASE dali_db;
\q

# Run schema (creates tables)
psql -U postgres -d dali_db -f schema.sql

# Load sample data (stores, products, locations)
psql -U postgres -d dali_db -f data.sql
```

**Option B: Using pgAdmin**

1. Open pgAdmin
2. Right-click "Databases" → Create → Database
3. Name: `dali_db` → Save
4. Right-click `dali_db` → Query Tool
5. Open `schema.sql` → Execute (F5)
6. Open `data.sql` → Execute (F5)

### Step 6: Start the Backend

```bash
# Make sure venv is activated
python main.py

# Or with uvicorn directly
uvicorn main:app --reload
```

Backend runs at: http://localhost:8000
API Docs at: http://localhost:8000/docs

### Step 7: Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## 🔑 Environment Variables Reference

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string | - |
| `SECRET_KEY` | ✅ | JWT signing key (32+ chars) | - |
| `SESSION_SECRET_KEY` | ✅ | Session encryption key | - |
| `SMTP_USERNAME` | ⚠️ | Gmail address for emails | - |
| `SMTP_PASSWORD` | ⚠️ | Gmail App Password | - |
| `MAYA_API_KEY` | ⚠️ | Maya payment API key | - |
| `FRONTEND_URL` | ❌ | Frontend URL for CORS | `http://localhost:5173` |

⚠️ = Required for specific features (email, payments)

---

## 🗄️ Database Schema

The database has 17 tables organized as:

```
├── accounts / admin_accounts      # User accounts
├── products                       # Product catalog
├── cart_items                     # Shopping cart
├── orders / order_items           # Orders
├── order_pickups / order_history  # Order tracking
├── addresses                      # Delivery addresses
├── provinces / cities / barangays # PH locations
├── stores                         # Store locations
├── reviews / review_images        # Product reviews
├── vouchers / voucher_usage       # Discount codes
└── audit_logs                     # Admin actions
```

See [DOCUMENTATION.md](DOCUMENTATION.md) for complete schema details.

---

## 🔄 Reset Database

If you need to start fresh:

```bash
# Using setup script
python setup.py --reset-db

# Or manually
psql -U postgres -c "DROP DATABASE dali_db;"
psql -U postgres -c "CREATE DATABASE dali_db;"
psql -U postgres -d dali_db -f schema.sql
psql -U postgres -d dali_db -f data.sql
```

---

## ❓ Common Issues

### "psql is not recognized"

PostgreSQL's `bin` folder isn't in PATH. Add it:
- Windows: `C:\Program Files\PostgreSQL\16\bin`
- Or use pgAdmin instead of command line

### "FATAL: password authentication failed"

Wrong PostgreSQL password. Reset it:
```sql
-- In pgAdmin or psql as superuser
ALTER USER postgres PASSWORD 'new_password';
```

### "database 'dali_db' does not exist"

Create it first:
```bash
psql -U postgres -c "CREATE DATABASE dali_db;"
```

### "Module not found" errors

Virtual environment not activated:
```bash
# Windows
.\venv\Scripts\Activate.ps1

# Mac/Linux  
source venv/bin/activate
```

### Port 8000 or 5173 already in use

Another process is using the port:
```bash
# Windows - find and kill process
netstat -ano | findstr :8000
taskkill /PID <pid> /F

# Mac/Linux
lsof -i :8000
kill -9 <pid>
```

---

## 📞 Getting Help

1. Check the error message carefully
2. Run `python setup.py --check` to verify setup
3. See [DOCUMENTATION.md](DOCUMENTATION.md) for API details
4. Ask a team member who has it working

---

## 🎉 Verify Everything Works

1. Backend API: http://localhost:8000/docs
2. Frontend: http://localhost:5173
3. Try registering a new account
4. Browse products and add to cart
5. Complete a checkout

You're all set! 🚀
