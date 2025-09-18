# Hotel Booking API - Code Explanation

## Project Structure
```
booking-api/
├── functions/           # Lambda functions (API endpoints)
│   ├── CreateBooking/   # POST /bookings
│   ├── GetAllBookings/  # GET /bookings  
│   ├── GetBooking/      # GET /bookings/{id}
│   ├── UpdateBooking/   # PUT /bookings/{id}
│   └── DeleteBooking/   # DELETE /bookings/{id}
├── responses/           # Helper functions
│   └── index.js        # sendResponse, sendError
├── services/           # Database connection
│   └── db.js          # DynamoDB client
├── serverless.yml     # AWS configuration
└── package.json       # Dependencies
```

## API Flow Diagram
```
Client Request → API Gateway → Lambda Function → DynamoDB
                     ↓
              Response Helper ← Database Result
                     ↓
              Client Response
```

## Function Details

### 1. CreateBooking (49 lines)
**Purpose:** Create new hotel booking
**Method:** POST /bookings
**What it does:**
- Gets data from request body
- Validates required fields (guests, roomTypes, guestName, email)
- Generates unique booking ID
- Calculates simple pricing (1000 per room)
- Saves to DynamoDB
- Returns created booking

### 2. GetAllBookings (24 lines)
**Purpose:** Get all bookings
**Method:** GET /bookings
**What it does:**
- Scans DynamoDB table
- Returns all bookings with count
- Simple and fast

### 3. GetBooking (37 lines)
**Purpose:** Get specific booking by ID
**Method:** GET /bookings/{id}
**What it does:**
- Gets ID from URL path
- Validates ID exists
- Fetches booking from DynamoDB
- Returns booking or 404 error

### 4. UpdateBooking (41 lines)
**Purpose:** Update booking status
**Method:** PUT /bookings/{id}
**What it does:**
- Gets ID from URL path
- Gets update data from request body
- Updates only status field
- Returns updated booking

### 5. DeleteBooking (37 lines)
**Purpose:** Delete booking
**Method:** DELETE /bookings/{id}
**What it does:**
- Gets ID from URL path
- Deletes from DynamoDB
- Returns deleted booking data

## Helper Functions

### responses/index.js (25 lines)
**sendResponse(data, statusCode)**
- Formats successful responses
- Adds CORS headers
- Wraps data in JSON

**sendError(statusCode, message)**
- Formats error responses
- Adds CORS headers
- Returns error message

### services/db.js (11 lines)
**Database Connection**
- Configures AWS DynamoDB
- Sets region to eu-north-1
- Exports client for use in functions

## Key Features

### Simple & Clean
- All functions under 50 lines
- Swedish comments for clarity
- Consistent error handling
- No complex validations

### Easy to Understand
- Clear function names
- Simple logic flow
- Minimal dependencies
- Beginner-friendly

### AWS Integration
- Serverless Framework
- DynamoDB for storage
- API Gateway for endpoints
- Lambda for processing

## API Endpoints

| Method | Endpoint | Function | Purpose |
|--------|----------|----------|---------|
| POST | /bookings | CreateBooking | Create new booking |
| GET | /bookings | GetAllBookings | Get all bookings |
| GET | /bookings/{id} | GetBooking | Get specific booking |
| PUT | /bookings/{id} | UpdateBooking | Update booking status |
| DELETE | /bookings/{id} | DeleteBooking | Delete booking |

## Database Schema

**Table:** hotel-bookings-axile
**Primary Key:** bookingId (String)

**Fields:**
- bookingId: Unique identifier
- guests: Number of guests
- roomTypes: Object with room counts
- totalRooms: Total number of rooms
- guestName: Guest's name
- email: Guest's email
- totalCost: Calculated cost
- status: Booking status (confirmed/cancelled)
- createdAt: Creation timestamp
- updatedAt: Last update timestamp

## Code Philosophy

### Keep It Simple
- No over-engineering
- Focus on core functionality
- Easy to read and modify
- Perfect for learning

### Swedish Comments
- Makes code accessible to Swedish developers
- Consistent language throughout
- Clear explanations

### Error Handling
- Simple try/catch blocks
- Consistent error responses
- User-friendly messages

This API is designed to be simple, clean, and easy to understand for beginners while still being fully functional for production use.
