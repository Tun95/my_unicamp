# 🎓 University Course Aggregator MiniPortal

## 🎯 Project Overview

A full-stack University Course Aggregator system with a modern **React** frontend and robust **Node.js** backend. Provides comprehensive course management, advanced filtering, real-time analytics, and an intuitive admin dashboard.

---

## ✨ Features Implemented

### 📚 Course Management

- **CRUD Operations** – Create, read, update, and delete courses
- **Soft Delete System** – Hide/unhide courses instead of permanent deletion
- **Duplicate Prevention** – Unique constraints to prevent duplicate course entries
- **Comprehensive Validation** – Robust input validation and error handling

### 🔍 Advanced Filtering & Search

- **Multi-field Search** – Search across title, university, field of study, and description
- **Advanced Filters** – Filter by university, degree type, field of study, location
- **Pagination** – Efficient pagination for large datasets
- **Filter Options API** – Dynamic filter options based on available data

### 📊 Dashboard & Analytics

- **Comprehensive Dashboard** – Single endpoint for all dashboard data
- **Real-time Statistics** – Total courses, active courses, activity rates
- **Distribution Analytics** – University, degree type, and location distributions
- **Trend Analysis** – Monthly course addition trends and field popularity

### 🛡️ Security & Validation

- **Input Sanitization** – Protection against XSS and injection attacks
- **Data Validation** – Comprehensive validation using express-validator
- **Error Handling** – Consistent error responses and logging
- **Duplicate Prevention** – Database-level unique constraints

---

## 🚀 Frontend Features

### 🎨 User Interface

- **Modern React Dashboard** – Clean, responsive design with Tailwind CSS
- **Light/Dark Theme** – Theme switcher with persistent user preferences
- **Loading States** – Elegant loaders and overlay spinners
- **React Helmet Integration** – SEO optimization with dynamic page titles
- **Modal System** – Beautiful modals for forms and confirmations
- **Sidebar Navigation** – Collapsible sidebar with mobile drawer support
- **Toast Notifications** – Beautiful pop-up messages for user actions

### 📊 Dashboard Components

- **Statistics Widgets** – Real-time KPI cards for course metrics
- **Interactive Charts** – Course trends and distribution visualizations
- **Data Tables** – Sortable, paginated tables with search functionality
- **Filter System** – Advanced filtering with search, university, and degree type filters
- **Responsive Design** – Mobile-first approach works on all devices

---

## 🛠️ Technical Implementation

### ⚙️ Architecture

- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Express-validator with custom validators
- **Logging**: Comprehensive logging system
- **Error Handling**: Centralized error handling middleware

### 🔑 Key Features

- **Aggregation Pipelines** – Complex MongoDB aggregations for analytics
- **Service Layer Pattern** – Separation of business logic from controllers
- **RESTful Design** – Consistent API design patterns
- **Data Consistency** – Unique indexes and constraints

### 🚀 Performance Optimizations

- **Database Indexing** – Optimized queries with strategic indexes
- **Parallel Operations** – Concurrent data fetching for dashboard
- **Pagination** – Efficient data retrieval for large datasets
- **Selective Field Projection** – Reduced data transfer for faster responses

---

## 📋 API Endpoints

## 📋 API Endpoints

### 🧾 Courses Management

| Method | Endpoint             | Description                           | Auth   |
| ------ | -------------------- | ------------------------------------- | ------ |
| GET    | /api/courses         | Get all active courses with filtering | Public |
| GET    | /api/courses/filters | Get filter options                    | Public |
| GET    | /api/courses/:id     | Get course by ID                      | Public |

### 🔐 Admin Operations

| Method | Endpoint                         | Description                          | Auth  |
| ------ | -------------------------------- | ------------------------------------ | ----- |
| POST   | /api/admin/courses               | Create new course                    | Admin |
| GET    | /api/admin/courses               | Get all courses (including inactive) | Admin |
| GET    | /api/admin/courses/latest        | Get latest courses                   | Admin |
| PUT    | /api/admin/courses/:id           | Update course                        | Admin |
| PATCH  | /api/admin/courses/:id           | Toggle course visibility             | Admin |
| DELETE | /api/admin/courses/:id/permanent | Permanently delete course            | Admin |

### 📈 Dashboard & Analytics

| Method | Endpoint                      | Description                  | Auth  |
| ------ | ----------------------------- | ---------------------------- | ----- |
| GET    | /api/admin/dashboard/overview | Comprehensive dashboard data | Admin |

### 🩺 Health Check

| Method | Endpoint | Description            | Auth   |
| ------ | -------- | ---------------------- | ------ |
| GET    | /health  | Health status endpoint | Public |
| GET    | /        | Root health check      | Public |

---

## 🗄️ Database Schema

### 📘 Course Model

```javascript
{
  title: String,
  university: String,
  duration: String,
  location: String,
  fees: String,
  description: String,
  degree_type: String,
  field_of_study: String,
  intake_months: [String],
  language: String,
  tuition_fee: {
    amount: Number,
    currency: String,
    period: String
  },
  is_active: Boolean
}
```

## 🚀 Getting Started

### 📦 Prerequisites

**Node.js (v14 or higher)**

**MongoDB (v4.4 or higher)**

**npm or yarn**

### 🧰 Installation

```
# Clone the repository
git clone <repository-url>
cd backend_service
cd frontend_panel

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Seed the database with sample courses (backend only)
npm run seed

# Start development server
npm run dev

# Start production server
npm start

```

### 🔐 Environment Variables

```
# BACKEND
NODE_ENV=development
PORT=5000

# Database configuration
MONGODB_URI=mongodb+srv://my_uni_camp:my_uni_camp@myunicamp.rx50yua.mongodb.net/my_uni_camp?retryWrites=true&w=majority&appName=myunicamp

# Logtail configuration
LOGTAIL_API_KEY=
LOGTAIL_ENDPOINT=

FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
WEB_NAME=My UNICAMP

# FRONTEND
VITE_API_URL=http://localhost:5000

```

### 📜 Available Scripts

```
npm run dev       # Start development server with nodemon
npm start         # Start production server
npm run seed      # Seed database with sample courses
npm test          # Run tests
```
