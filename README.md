# Store Management System

A full-stack store management system built with Node.js, Express, TypeScript, PostgreSQL, Prisma, React, and TypeScript.

The system allows admins and managers to manage products, categories, suppliers, stock movements, orders, and dashboard reports.

## Features

### Authentication and Authorization

- User registration
- User login
- JWT authentication
- Protected routes
- Role-based access control
- Roles: ADMIN, MANAGER, WORKER

### Products

- Create products
- View products
- Search products by name or SKU
- Pagination
- View product details
- Edit products
- Delete products
- Connect products to categories and suppliers

### Categories

- Create categories
- View categories
- Delete categories

### Suppliers

- Create suppliers
- View suppliers
- Delete suppliers

### Stock Management

- Add stock
- Remove stock
- Adjust stock
- View stock movement history
- Track which user changed stock
- Prevent removing more stock than available

### Orders

- Create orders
- View orders
- Approve orders
- Automatically reduce stock when an order is approved
- Automatically create stock movement records when orders are approved

### Dashboard

- Total products
- Total categories
- Total suppliers
- Total orders
- Low-stock products
- Total revenue
- Recent orders
- Recent stock movements

### Security

- Password hashing with bcrypt
- JWT authentication
- Helmet security headers
- CORS configuration
- Rate limiting
- Environment variables

### Testing

- Backend tests with Jest and Supertest
- Health route test
- Auth route tests
- Protected route tests
- Product pagination test
- Order approval and stock reduction test

## Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- Zod
- Jest
- Supertest

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios

## Project Structure

```text
store-management-system/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── categories/
│   │   │   ├── suppliers/
│   │   │   ├── products/
│   │   │   ├── stock/
│   │   │   ├── orders/
│   │   │   └── dashboard/
│   │   ├── tests/
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
│
└── README.md
Getting Started
Prerequisites

Make sure you have installed:

Node.js
npm
PostgreSQL
Git
Backend Setup

Go to the backend folder:

cd backend

Install dependencies:

npm install

Create a .env file:

PORT=3000
DATABASE_URL="postgresql://YOUR_USER@localhost:5432/store_management"
JWT_SECRET="your_jwt_secret_here"
CLIENT_URL="http://localhost:5173"

Run Prisma migrations:

npx prisma migrate dev

Seed the database:

npm run seed

Start the backend server:

npm run dev

The backend will run on:

http://localhost:3000

Health check:

GET http://localhost:3000/api/health
Frontend Setup

Go to the frontend folder:

cd frontend

Install dependencies:

npm install

Create a .env file:

VITE_API_URL=http://localhost:3000/api

Start the frontend:

npm run dev

The frontend will run on:

http://localhost:5173
Demo Users

After running the seed script, you can login with:

Admin
Email: admin@example.com
Password: 123456
Manager
Email: manager@example.com
Password: 123456
Worker
Email: worker@example.com
Password: 123456
Useful Commands
Backend
npm run dev
npm run build
npm start
npm test
npm run seed
Frontend
npm run dev
npm run build
API Overview
Auth
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
Categories
POST   /api/categories
GET    /api/categories
GET    /api/categories/:id
PATCH  /api/categories/:id
DELETE /api/categories/:id
Suppliers
POST   /api/suppliers
GET    /api/suppliers
GET    /api/suppliers/:id
PATCH  /api/suppliers/:id
DELETE /api/suppliers/:id
Products
POST   /api/products
GET    /api/products
GET    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id

Example product pagination:

GET /api/products?page=1&limit=10&search=mouse
Stock
POST /api/stock/in
POST /api/stock/out
POST /api/stock/adjust
GET  /api/stock/movements
GET  /api/stock/products/:id/movements
Orders
POST  /api/orders
GET   /api/orders
GET   /api/orders/:id
PATCH /api/orders/:id/status
DELETE /api/orders/:id
Dashboard
GET /api/dashboard/summary
GET /api/dashboard/low-stock
GET /api/dashboard/recent-orders
GET /api/dashboard/recent-stock-movements
Notes

This project was built as a learning and portfolio project to practice full-stack development, backend architecture, database modeling, authentication, authorization, testing, and frontend integration.


---

## 2. Important check

Make sure the code block formatting in README is correct. Especially around:

```md
```text

Every opened code block must be closed.