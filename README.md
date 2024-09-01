# Blood Donation Service

Welcome to the Blood Donation Service! This application facilitates blood donation by connecting donors with those in need. Users can register, log in, search for donors, request blood donations, update donation statuses, and manage their profiles.

## Live URL

You can access the live version of the application [here](https://blood-donation-server-flax.vercel.app/).

## Features

1. **User Registration:** Users can register and create profiles, including details like name, email, blood type, location, and more.
2. **User Login:** Registered users can log in securely to access their accounts.
3. **Find Donors:** Users can search for donors based on various criteria such as blood type, location, name, and email.
4. **Request Blood Donation:** Users can make requests for blood donations, providing details such as contact information, date of donation, hospital name, and reason.
5. **Manage Donation Requests:** Donors can view and manage donation requests directed to them, including updating the status of requests.
6. **View User Profile:** Users can view their own profiles, including details like name, email, blood type, location, and donation history.
7. **Update User Profile:** Authenticated users can update their profile information, including bio, age, and other details.
8. **Pagination and Filtering:** The application supports pagination and filtering of donor lists for easier navigation and search.

## Technology Stack

- **Programming Language:** TypeScript
- **Web Framework:** Express.js
- **Object Relational Mapping (ORM):** Prisma for PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Other Dependencies:** bcrypt, cookie-parser, cors, dotenv, http-status, jsonwebtoken, zod

# Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (version 16 or later)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/download/) or another supported database for Prisma

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/assignment-8-test.git
   cd assignment-8-test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Setup

Create a `.env` file in the root of the project to configure environment variables.

### Example `.env` File

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/mydatabase?schema=public"
JWT_SECRET="your_secret_key"
PORT=3000

```

## Event Management API Documentation

### 1. Create a new even

**Endpoint:** `POST /events`

### 2. List all events

**Endpoint:** `GET /events`

### 3. Get details of a specific event by ID

**Endpoint:** `GET /events/:id`

### 4. Update an event by ID

**Endpoint:** `PUT /events/:id`

### 5. Delete an event by ID

**Endpoint:** `DELETE /events/:id`

### 6. Update Request Application Status

**Endpoint:** `PUT /api/donation-request/:requestId`

### 7. Register participants

**Endpoint:** `POST /participant`

### 8. Add participants to an event

**Endpoint:** `POST /events/:id/participants`

### 8. Remove a participant from an even

**Endpoint:** `DELETE /events/:id/participants/:participantId`
