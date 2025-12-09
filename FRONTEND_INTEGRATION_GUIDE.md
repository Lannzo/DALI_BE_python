># DALI Frontend Integration Guide

Complete guide for integrating the React frontend with your FastAPI backend.

## Overview

The DALI e-commerce platform now has a complete full-stack implementation:

- **Backend**: FastAPI (Python) - Located in root directory
- **Frontend**: React + Vite - Located in `frontend/` directory

## Quick Start

### 1. Start the Backend

```bash
# In the root directory
python main.py
```

Backend will run on `http://localhost:8000`

### 2. Start the Frontend

```bash
# In a new terminal
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3. Open in Browser

Visit `http://localhost:3000` to see the complete application!

## Project Structure

```
DALI/
├── app/                    # Backend application code
│   ├── core/              # Config, database, security
│   ├── models/            # SQLAlchemy models
│   ├── routers/           # API endpoints
│   ├── schemas/           # Pydantic schemas
│   └── services/          # Business logic
├── frontend/              # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── stores/        # State management
│   │   └── lib/           # Utilities
│   └── package.json
├── main.py                # Backend entry point
├── requirements.txt       # Python dependencies
├── schema.sql             # Database schema
└── .env                   # Environment configuration
```

## Architecture

### Backend (Port 8000)

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: Session-based with secure cookies
- **API Style**: RESTful JSON API

### Frontend (Port 3000)

- **Framework**: React 18 with Vite
- **Routing**: React Router
- **State**: Zustand for global state
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Communication

Frontend → Backend communication via REST API calls with session cookies for authentication.

```
┌─────────────┐         HTTP/JSON          ┌─────────────┐
│   React     │  ────────────────────────> │   FastAPI   │
│  (Port 3000)│  <────────────────────────  │  (Port 8000)│
└─────────────┘    Session Cookies         └─────────────┘
                                                    │
                                                    │
                                               ┌────▼─────┐
                                               │PostgreSQL│
                                               └──────────┘
```

## Key Features Implemented

### User Features

1. **Authentication**
   - Registration with auto-login
   - Login/logout
   - Password reset flow
   - Session management

2. **Product Browsing**
   - Product listing with filters
   - Search functionality
   - Category/subcategory navigation
   - Product detail pages

3. **Shopping Cart**
   - Add/remove items
   - Update quantities
   - Session cart (anonymous)
   - Database cart (authenticated)
   - Automatic cart merging

4. **Checkout Process**
   - Step 1: Address selection
   - Step 2: Shipping method (Standard, Priority, Pickup)
   - Step 3: Payment method (COD, Maya, Card)
   - Order confirmation

5. **Account Management**
   - Profile editing
   - Password change
   - Order history
   - Order tracking
   - Address management

### Admin Features

1. **Dashboard**
   - Key metrics overview
   - Quick navigation

2. **Inventory Management**
   - Product listing
   - Search and filter
   - Stock updates

3. **Order Management**
   - Order listing
   - Order details
   - Status updates
   - Customer information

## Development Workflow

### Making Changes

1. **Backend Changes**
   - Edit files in `app/` directory
   - Server auto-reloads with `--reload` flag
   - Test via `/docs` (Swagger UI)

2. **Frontend Changes**
   - Edit files in `frontend/src/`
   - Vite hot-reloads automatically
   - Changes reflect immediately

### Adding New Features

#### Backend (API Endpoint)

1. Create schema in `app/schemas/`
2. Add business logic in `app/services/`
3. Create router in `app/routers/`
4. Register router in `main.py`

#### Frontend (Page/Component)

1. Create page in `frontend/src/pages/`
2. Add route in `App.jsx`
3. Use API client from `src/lib/api.js`
4. Update state using Zustand if needed

## Database Setup

### Prerequisites

- PostgreSQL installed and running
- Database created: `dali_db`

### Initialize Database

```bash
# Create database
psql -U postgres -c "CREATE DATABASE dali_db;"

# Run schema
psql -U postgres -d dali_db -f schema.sql

# Load sample data (optional)
psql -U postgres -d dali_db -f data.sql
```

### Database Tables

- `accounts` - User accounts
- `admin_accounts` - Admin accounts
- `products` - Product catalog
- `cart_items` - Shopping cart items
- `orders` - Customer orders
- `order_items` - Order line items
- `addresses` - Delivery addresses
- `provinces`, `cities`, `barangays` - Location data
- `stores` - Pickup locations
- `order_history` - Order status tracking
- `order_pickups` - Pickup order info

## Environment Configuration

### Backend (.env)

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/dali_db
SECRET_KEY=your-secret-key-here
SESSION_SECRET_KEY=your-session-secret-here

# Optional: Email for password reset
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Optional: Maya payment gateway
MAYA_API_KEY=your-maya-api-key
MAYA_PUBLIC_KEY=pk-test-your-key
MAYA_BASE_URL=https://pg-sandbox.paymaya.com
```

### Frontend

No environment configuration needed for development. The frontend uses Vite's proxy to connect to the backend.

## API Reference

Full API documentation available at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **API Docs**: See `API_DOCUMENTATION.md`

## Testing

### Manual Testing

1. **Register a new user**
   - Navigate to http://localhost:3000/register
   - Fill in user details
   - Verify auto-login and cart merge

2. **Browse products**
   - Navigate to http://localhost:3000/products
   - Test search and filters
   - View product details

3. **Shopping cart**
   - Add products to cart
   - Update quantities
   - Remove items

4. **Checkout**
   - Add a delivery address
   - Select shipping method
   - Choose payment method
   - Complete order

5. **Admin**
   - Navigate to http://localhost:3000/admin/login
   - Login with admin credentials
   - Test inventory management
   - Test order management

### Testing with Postman

See `POSTMAN_TEST_SCENARIOS.md` for comprehensive API testing scenarios.

## Common Issues & Solutions

### Issue: Backend not connecting

**Solution**: Ensure backend is running on port 8000

```bash
python main.py
```

### Issue: Frontend not loading

**Solution**: Ensure dependencies are installed

```bash
cd frontend
npm install
npm run dev
```

### Issue: CORS errors

**Solution**: Backend has CORS enabled. Check that:
- Backend is running
- Frontend is using correct API URL
- Cookies are being sent (`withCredentials: true`)

### Issue: 401 Unauthorized

**Solution**: Session expired or not logged in
- Clear browser cookies
- Login again
- Check that cookies are enabled

### Issue: Cart not syncing

**Solution**:
- Check browser cookies are enabled
- Try logging out and back in
- Clear session storage

### Issue: Images not showing

**Solution**:
- Product images should be in backend's `static/` folder
- Check image paths in database
- Fallback to Pexels images if not found

## Deployment

### Backend Deployment

1. Update `.env` for production
2. Set `FRONTEND_URL` to production domain
3. Disable CORS for all origins (restrict to frontend domain)
4. Use production database
5. Deploy to Heroku, Railway, AWS, or similar

### Frontend Deployment

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy `dist/` folder to:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Or serve with Nginx/Apache

3. Update API proxy or base URL to production backend

### Full-Stack Deployment

Option 1: Serve frontend from backend
- Copy `frontend/dist` to `backend/static`
- Serve from FastAPI using `StaticFiles`

Option 2: Separate deployments
- Deploy backend to Heroku/Railway
- Deploy frontend to Vercel/Netlify
- Update CORS and API URLs

## Next Steps

1. Customize the design based on your Figma designs
2. Add more product categories
3. Integrate real payment gateway (Maya production keys)
4. Add email notifications
5. Implement order tracking
6. Add product reviews
7. Implement wishlist
8. Add promotional codes/discounts

## Support

For issues or questions:

1. Check the documentation:
   - `README.md` - Backend overview
   - `frontend/README.md` - Frontend overview
   - `API_DOCUMENTATION.md` - API reference
   - `POSTMAN_TEST_SCENARIOS.md` - Testing guide

2. Review the code:
   - Backend: `app/` directory
   - Frontend: `frontend/src/` directory

3. Check logs:
   - Backend: Terminal output
   - Frontend: Browser console

## Summary

Your DALI e-commerce platform is now complete with:

✅ Full-featured FastAPI backend
✅ Modern React frontend
✅ Complete user authentication
✅ Product browsing and search
✅ Shopping cart functionality
✅ Multi-step checkout
✅ Order management
✅ Admin dashboard
✅ Responsive design
✅ Session-based authentication
✅ Database integration

The system is ready for customization and deployment!
