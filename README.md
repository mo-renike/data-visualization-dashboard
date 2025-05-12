
# XYZ Shop

A full-stack web application that visualizes sales data with interactive charts and provides user authentication, order management, and detailed analytics.

## Features

- **Authentication System**: Secure login and registration with role-based access (Admin and Customer)
- **Interactive Dashboard**: 
  - Revenue statistics with growth indicators
  - Customer acquisition metrics
  - Sales trends visualization
  - Product category distribution
- **Time-based Filtering**: Filter all analytics by different time periods (This Month, Last Month, This Year, Last Year)
- **Order Management**: Create, view, and track orders with detailed information


## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- CharJs for data visualization
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL database
- JWT authentication
- RESTful API design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm 
- PostgreSQL database

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/mo-renike/data-visualization-dashboard
cd data-visualization-dashboard
```

#### 2. Setup environment variables

Update the `.env` file with your database connection URL and JWT secret.

#### 3. Install dependencies

**Frontend:**
```bash
cd client && npm install
```

**Backend:**
```bash
cd server
npm install
```

#### 4. Set up the database

```bash
cd server
npx prisma migrate dev
 npx ts-node src/utils/populateOrders.ts
```

This will:
- Create the database tables according to the Prisma schema
- pre populate the database with sample data

### Running the Application

#### Development Mode

**Frontend:**
```bash
cd client
npm run dev
```

**Backend:**
```bash
cd server
npm run dev
```

- Frontend will be available at: http://localhost:5173
- Backend API will be available at: http://localhost:8080

#### Production Build

**Frontend:**
```bash
cd client
npm run build
```

**Backend:**
```bash
cd server
npm run build
npm start
```

## Deployment

- Frontend deployed on vercel
- Backend deployed on render


## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Orders

- `GET /api/orders` - Get all orders (admin) or user orders (customer)
- `POST /api/orders` - Create a new order

### Dashboard (Admin only)

- `GET /api/stats/stats` - Get dashboard statistics
- `GET /api/stats/revenue-chart` - Get revenue chart data
- `GET /api/stats/category-chart` - Get category distribution data
- `GET /api/stats/orders` - Get filtered orders by time period