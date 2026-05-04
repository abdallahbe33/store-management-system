# Store Management System

A full-stack store management system built with **Node.js, Express, TypeScript, PostgreSQL, Prisma, React, and Docker**.

The project allows admins and managers to manage products, categories, suppliers, stock movements, orders, and dashboard reports. It includes authentication, role-based authorization, backend tests, seed data, and Docker support.

---

## Features

### Authentication and Authorization

- User registration
- User login
- JWT authentication
- Protected routes
- Role-based access control
- Roles:
  - `ADMIN`
  - `MANAGER`
  - `WORKER`

### Products

- Create products
- View products
- Search products by name or SKU
- Product pagination
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
- Automatically reduce product stock when an order is approved
- Automatically create stock movement records when orders are approved

### Dashboard

- Total products
- Total categories
- Total suppliers
- Total orders
- Total revenue
- Low-stock products
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

### Docker

- Dockerized PostgreSQL database
- Dockerized backend
- Dockerized frontend
- Full project can run with Docker Compose

---

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
- Helmet
- CORS
- express-rate-limit

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios

### DevOps

- Docker
- Docker Compose

---

## Project Structure

```text
store-management-system/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── seed/
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
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## Getting Started with Docker

The easiest way to run the full project is with Docker Compose.

### Prerequisites

Make sure you have installed:

- Git
- Docker Desktop

Start Docker Desktop before running Docker commands.

### Run the Project

From the root project folder:

```bash
docker compose up --build
```

This will start:

```text
PostgreSQL database
Backend server
Frontend React app
```

The frontend will run on:

```text
http://localhost:5173
```

The backend will run on:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/api/health
```

### Run Database Migrations in Docker

After the containers are running, open another terminal and run:

```bash
docker compose exec backend npx prisma migrate deploy
```

### Seed the Docker Database

```bash
docker compose exec backend npm run seed
```

After seeding, you can log in with the demo users listed below.

### Stop Docker Containers

```bash
docker compose down
```

This stops the containers but keeps the database data.

### Stop Containers and Delete Docker Database Data

```bash
docker compose down -v
```

Be careful: this deletes the Docker PostgreSQL volume and all stored database data.

---

## Demo Users

After running the seed script, you can log in with:

### Admin

```text
Email: admin@example.com
Password: 123456
```

### Manager

```text
Email: manager@example.com
Password: 123456
```

### Worker

```text
Email: worker@example.com
Password: 123456
```

---

## Local Development Setup Without Docker

You can also run the backend and frontend manually.

---

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=3000
DATABASE_URL="postgresql://YOUR_USER@localhost:5432/store_management"
JWT_SECRET="your_jwt_secret_here"
CLIENT_URL="http://localhost:5173"
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Seed the database:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:3000
```

---

## Frontend Setup

Go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## Useful Commands

### Backend

```bash
npm run dev
npm run build
npm start
npm test
npm run seed
```

### Frontend

```bash
npm run dev
npm run build
```

### Docker

```bash
docker compose up --build
docker compose down
docker compose down -v
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run seed
```

---

## API Overview

### Auth

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Categories

```text
POST   /api/categories
GET    /api/categories
GET    /api/categories/:id
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

### Suppliers

```text
POST   /api/suppliers
GET    /api/suppliers
GET    /api/suppliers/:id
PATCH  /api/suppliers/:id
DELETE /api/suppliers/:id
```

### Products

```text
POST   /api/products
GET    /api/products
GET    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id
```

Example product pagination:

```text
GET /api/products?page=1&limit=10&search=mouse
```

### Stock

```text
POST /api/stock/in
POST /api/stock/out
POST /api/stock/return
POST /api/stock/adjust
GET  /api/stock/movements
GET  /api/stock/products/:id/movements
```

### Orders

```text
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
PATCH  /api/orders/:id/status
DELETE /api/orders/:id
```

### Dashboard

```text
GET /api/dashboard/summary
GET /api/dashboard/low-stock
GET /api/dashboard/recent-orders
GET /api/dashboard/recent-stock-movements
```

---

## Main Business Logic

### Stock Movement Logic

When stock is added, removed, returned, or adjusted, the system creates a stock movement record. This keeps a history of all stock changes and records which user made the change.

### Order Approval Logic

Orders are created with status `PENDING`.

When an order is approved:

1. The system checks if enough stock is available.
2. The product quantity is reduced.
3. A stock movement of type `OUT` is created.
4. The order status is changed to `APPROVED`.

This is done inside a database transaction, so if one step fails, the whole operation is cancelled.

---

## Testing

Backend tests are written using Jest and Supertest.

Run tests from the backend folder:

```bash
cd backend
npm test
```

The tests cover:

```text
Health route
Register
Login
Wrong password
Protected /me route
Role restriction
Product pagination
Order approval and stock reduction
```

---

## Build Checks

### Backend Build

```bash
cd backend
npm run build
```

### Frontend Build

```bash
cd frontend
npm run build
```

---

## Notes

This project was built as a learning and portfolio project to practice:

- Full-stack development
- Backend architecture
- REST API design
- Database modeling
- Authentication and authorization
- Role-based permissions
- Prisma migrations
- Business logic with transactions
- Frontend integration
- Testing
- Docker-based development
