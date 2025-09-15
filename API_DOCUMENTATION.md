
# Bonz.ai Hotel Booking API Documentation

## Overview
This is a serverless booking API for Bonz.ai hotel built with AWS Lambda, API Gateway, and DynamoDB. The API allows guests to create, read, update, and manage hotel room bookings.

## Base URL
```
https://your-api-gateway-url.amazonaws.com/dev
```

## Room Types and Pricing
- **Single Room**: 1 guest, 500 SEK/night
- **Double Room**: 2 guests, 1000 SEK/night  
- **Suite**: 3 guests, 1500 SEK/night

## API Endpoints

### 1. Create Booking
**POST** `/bookings`

Creates a new hotel booking.

#### Request Body
```json
{
  "guestName": "John Doe",
  "guestEmail": "john.doe@example.com",
  "totalGuests": 2,
  "rooms": [
    {
      "type": "double",
      "quantity": 1
    }
  ],
  "checkInDate": "2024-01-15",
  "checkOutDate": "2024-01-17",
  "specialRequests": "Ground floor room preferred"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Booking created successfully",
  "timestamp": "2024-01-10T10:30:00.000Z",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "guestName": "John Doe",
    "guestEmail": "john.doe@example.com",
    "totalGuests": 2,
    "rooms": [
      {
        "type": "double",
        "quantity": 1
      }
    ],
    "totalPrice": 1000,
    "checkInDate": "2024-01-15",
    "checkOutDate": "2024-01-17",
    "specialRequests": "Ground floor room preferred",
    "status": "confirmed",
    "createdAt": "2024-01-10T10:30:00.000Z",
    "updatedAt": "2024-01-10T10:30:00.000Z"
  }
}
```

### 2. Get All Bookings
**GET** `/bookings`

Retrieves all bookings.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Bookings retrieved successfully",
  "timestamp": "2024-01-10T10:30:00.000Z",
  "data": {
    "count": 2,
    "bookings": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "guestName": "John Doe",
        "guestEmail": "john.doe@example.com",
        "totalGuests": 2,
        "rooms": [{"type": "double", "quantity": 1}],
        "totalPrice": 1000,
        "status": "confirmed",
        "createdAt": "2024-01-10T10:30:00.000Z"
      }
    ]
  }
}
```

### 3. Get Single Booking
**GET** `/bookings/{id}`

Retrieves a specific booking by ID.

#### Path Parameters
- `id` (string, required): The booking ID

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Booking retrieved successfully",
  "timestamp": "2024-01-10T10:30:00.000Z",
  "data": {
    "booking": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "guestName": "John Doe",
      "guestEmail": "john.doe@example.com",
      "totalGuests": 2,
      "rooms": [{"type": "double", "quantity": 1}],
      "totalPrice": 1000,
      "status": "confirmed",
      "createdAt": "2024-01-10T10:30:00.000Z"
    }
  }
}
```

### 4. Update Booking
**PUT** `/bookings/{id}`

Updates an existing booking.

#### Path Parameters
- `id` (string, required): The booking ID

#### Request Body
```json
{
  "guestName": "John Smith",
  "totalGuests": 3,
  "rooms": [
    {
      "type": "suite",
      "quantity": 1
    }
  ],
  "status": "confirmed"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Booking updated successfully",
  "timestamp": "2024-01-10T10:30:00.000Z",
  "data": {
    "booking": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "guestName": "John Smith",
      "guestEmail": "john.doe@example.com",
      "totalGuests": 3,
      "rooms": [{"type": "suite", "quantity": 1}],
      "totalPrice": 1500,
      "status": "confirmed",
      "updatedAt": "2024-01-10T10:35:00.000Z"
    }
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "timestamp": "2024-01-10T10:30:00.000Z",
  "error": [
    "Missing required field: guestName",
    "Invalid email format"
  ]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Booking not found",
  "timestamp": "2024-01-10T10:30:00.000Z"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An unexpected error occurred",
  "timestamp": "2024-01-10T10:30:00.000Z",
  "error": {
    "type": "internal_error",
    "message": "Internal server error"
  }
}
```

## Room Booking Examples

### Example 1: Single Guest
```json
{
  "guestName": "Alice Johnson",
  "guestEmail": "alice@example.com",
  "totalGuests": 1,
  "rooms": [{"type": "single", "quantity": 1}]
}
```

### Example 2: Couple
```json
{
  "guestName": "Bob and Sarah Wilson",
  "guestEmail": "bob.wilson@example.com",
  "totalGuests": 2,
  "rooms": [{"type": "double", "quantity": 1}]
}
```

### Example 3: Family
```json
{
  "guestName": "The Johnson Family",
  "guestEmail": "johnson.family@example.com",
  "totalGuests": 3,
  "rooms": [{"type": "suite", "quantity": 1}]
}
```

### Example 4: Large Group
```json
{
  "guestName": "Conference Group",
  "guestEmail": "conference@example.com",
  "totalGuests": 5,
  "rooms": [
    {"type": "double", "quantity": 2},
    {"type": "single", "quantity": 1}
  ]
}
```

## Validation Rules

1. **Guest Name**: Required, non-empty string
2. **Guest Email**: Required, valid email format
3. **Total Guests**: Required, positive integer
4. **Rooms**: Required, array of room objects
5. **Room Type**: Must be one of: "single", "double", "suite"
6. **Room Quantity**: Optional, defaults to 1, must be positive integer
7. **Total Room Capacity**: Must be >= total guests
8. **Status**: Optional, must be one of: "confirmed", "cancelled", "completed"

## CORS Support
All endpoints support CORS with the following headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS`
- `Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`
