# DALI E-Commerce Frontend

Modern React frontend for the DALI e-commerce platform, built with Vite, React Router, Tailwind CSS, and Zustand for state management.

## Features

- Modern, responsive design with Tailwind CSS
- Complete authentication flow (login, register, password reset)
- Product browsing with search and filters
- Shopping cart with real-time updates
- Multi-step checkout process
- User profile and order management
- Address management with Philippines location data
- Admin dashboard for inventory and order management
- Session-based authentication with automatic cart merging

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8000`

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── checkout/        # Checkout flow components
│   │   ├── Header.jsx       # Site header with navigation
│   │   ├── Footer.jsx       # Site footer
│   │   ├── Layout.jsx       # Main layout wrapper
│   │   ├── ProtectedRoute.jsx
│   │   └── ProductCard.jsx  # Product display card
│   ├── pages/               # Page components
│   │   ├── admin/           # Admin pages
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminInventory.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   └── AdminOrderDetail.jsx
│   │   ├── Home.jsx         # Landing page
│   │   ├── Products.jsx     # Product listing
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx         # Shopping cart
│   │   ├── Checkout.jsx     # Multi-step checkout
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── Profile.jsx      # User profile
│   │   ├── Orders.jsx       # Order history
│   │   ├── OrderDetail.jsx
│   │   └── Addresses.jsx    # Address management
│   ├── stores/              # Zustand stores
│   │   ├── useAuthStore.js  # Authentication state
│   │   └── useCartStore.js  # Shopping cart state
│   ├── lib/
│   │   └── api.js           # Axios instance
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── postcss.config.js        # PostCSS configuration
```

## Key Features

### Authentication

- Session-based authentication with secure cookies
- Auto-login after registration
- Password reset via email (requires backend SMTP setup)
- Protected routes for authenticated users
- Automatic cart merging on login/registration

### Product Browsing

- Product listing with category filters
- Search functionality
- Product detail pages
- Stock availability indicators

### Shopping Cart

- Session cart for anonymous users
- Database cart for authenticated users
- Automatic cart merging on login
- Real-time quantity updates
- Cart persistence

### Checkout Flow

1. **Address Selection** - Choose delivery address
2. **Shipping Method** - Select delivery type (Standard, Priority, or Pickup)
3. **Payment** - Choose payment method (COD, Maya, or Card)

### User Features

- Profile management
- Order history
- Order tracking
- Address management with Philippines location data
- Order cancellation (for processing orders)

### Admin Features

- Dashboard with key metrics
- Inventory management
- Stock updates
- Order management
- Order status updates

## API Integration

The frontend communicates with the FastAPI backend via REST API calls. The API client is configured in `src/lib/api.js` with:

- Base URL: `/api` (proxied to `http://localhost:8000` in development)
- Automatic cookie handling for session authentication
- Automatic 401 handling for expired sessions

## Color Scheme

The application uses a professional blue color scheme:

- **Primary**: Blue (`#0ea5e9` - Sky Blue)
- **Secondary**: Gray for text and backgrounds
- **Accent**: Green for success, Red for errors, Orange for warnings

## Responsive Design

The frontend is fully responsive with breakpoints:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### API Proxy

In development, Vite proxies API requests to the backend:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```

## Deployment

### 1. Build the Application

```bash
npm run build
```

### 2. Serve Static Files

The `dist` folder contains the built application. You can serve it using:

- **Nginx**
- **Apache**
- **Vercel**
- **Netlify**
- Or any static file hosting service

### 3. Environment Configuration

For production, ensure your backend API is properly configured and accessible.

## Integration with Backend

### Backend Setup

1. Ensure the FastAPI backend is running on `http://localhost:8000`
2. Database must be initialized with schema and sample data
3. SMTP configuration required for password reset (optional)
4. Maya payment gateway credentials required for online payments (optional)

### Backend Endpoints Used

- `/api/auth/*` - Authentication
- `/api/products/*` - Product catalog
- `/api/cart/*` - Shopping cart
- `/api/checkout/*` - Checkout process
- `/api/orders/*` - Order management
- `/api/addresses/*` - Address management
- `/api/locations/*` - Location data (provinces, cities, barangays)
- `/api/stores/*` - Store locations
- `/api/admin/*` - Admin operations

## Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure the backend has CORS enabled for your frontend origin.

### 401 Unauthorized

Make sure cookies are being sent with requests. The API client uses `withCredentials: true`.

### Cart Not Syncing

Check that session cookies are being stored properly. Clear browser cookies and try again.

### Images Not Loading

Product images should be in the backend's `static` folder. The frontend looks for images at `/static/{image_name}`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Use functional components with hooks
3. Keep components small and focused
4. Add proper error handling
5. Test on multiple screen sizes

## License

This project is part of the DALI E-Commerce platform.
