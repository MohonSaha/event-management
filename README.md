# Event Management API

The Event Management API is a RESTful service designed to facilitate the creation, management, and organization of events. Users can create, update, delete, and retrieve events, each associated with details such as name, date, time, location, and participants. The API ensures data integrity with features like time conflict prevention, secure data handling, and efficient management of large datasets. Additionally, it offers pagination and filtering to streamline the navigation and management of extensive event data.

## Live URL

You can access the live version of the application [here](https://event-management-api-gilt.vercel.app/).

You can access my postman api documantation [here](https://documenter.getpostman.com/view/27435661/2sAXjM5CLz).

## Features

1. **Event Creation:**

   - Users can create new events by providing details such as event name, date, start time, end time, location, and description.
   - The API ensures that each event is unique and properly structured.

2. **Event Listing:**

   - Users can retrieve a list of all events stored in the database.
   - The API supports pagination, making it easy to navigate through large datasets of events.

3. **Event Details:**

   - Users can fetch the details of a specific event by its ID.
   - This includes all relevant information like the event name, date, time, location, description, and the list of participants.

4. **Event Updating:**

   - Users can update existing events by specifying the event ID and providing the new details.
   - This feature allows for changes to event attributes such as name, time, location, and participant list.

5. **Event Deletion:**

   - Users can delete an event by its ID.
   - The API ensures that all associated data, such as participants, is handled correctly during the deletion process.

6. **Add Participants:**

   - Users can add participants to an event by providing a list of participant emails.
   - The API manages the relationship between events and participants, ensuring proper data integrity.

7. **Remove Participants:**

   - Users can remove a specific participant from an event by specifying the event ID and participant ID.
   - This feature allows for precise management of participant lists.

8. **Time Conflict Prevention:**

   - The API includes a feature to prevent scheduling conflicts.
   - If an event is already scheduled at a specific location and time, the API will reject new events that overlap, ensuring no two events can occur simultaneously at the same location.

9. **Efficient Data Handling:**

   - The API is optimized for handling large datasets, including extensive lists of participants.
   - This includes the implementation of efficient querying and data management techniques to ensure fast and reliable performance.

10. **Pagination and Filtering:**
    - To handle large amounts of event data, the API supports pagination and filtering.
    - This allows users to retrieve and navigate through events efficiently, which is especially useful when dealing with a large number of events or participants.

## Technology Stack

- **Programming Language:** TypeScript
- **Web Framework:** Express.js
- **Object Relational Mapping (ORM):** Prisma for MySQL
- **Other Dependencies:** cookie-parser, cors, dotenv, http-status,

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

## Run the server locally

1. Run the development server using `npm run dev`.
2. Access the application locally at `http://localhost:PORT`, where `PORT` is the specified port in your environment variables.

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
