# Bonz.ai Hotel Booking API - Beginner's Guide

## What is this project?

This is a **hotel booking API** that allows guests to:
- Book hotel rooms online
- Choose from different room types (single, double, suite)
- Get automatic pricing based on number of nights
- Check room availability

## How does it work?

### 1. **Serverless Architecture**
- **No servers to manage** - AWS handles everything
- **Automatic scaling** - Handles 1 user or 1000 users
- **Pay only for what you use** - No fixed costs

### 2. **Main Components**

#### **API Gateway**
- The "front door" of your API
- Receives HTTP requests (GET, POST, PUT)
- Routes them to the right Lambda function

#### **Lambda Functions**
- Small pieces of code that run when called
- Each function handles one specific task:
  - `CreateBooking` - Creates new bookings
  - `GetAllBookings` - Gets all bookings
  - `GetBooking` - Gets one specific booking
  - `UpdateBooking` - Updates existing bookings

#### **DynamoDB**
- Amazon's NoSQL database
- Stores all booking information
- Fast and reliable

## Project Structure Explained

```
booking-api/
├── functions/           # Lambda functions (the main logic)
│   ├── CreateBooking/   # Handles creating new bookings
│   ├── GetAllBookings/  # Handles getting all bookings
│   ├── GetBooking/      # Handles getting one booking
│   └── UpdateBooking/   # Handles updating bookings
├── services/            # Business logic and utilities
│   ├── bookingService.js # Main booking logic
│   ├── roomService.js   # Room types, pricing, validation
│   └── db.js           # Database connection
├── responses/           # Response formatting
│   └── index.js        # Success/error response functions
├── serverless.yml      # Configuration file
└── package.json        # Dependencies
```

## How to understand the code

### **Step 1: Start with `functions/CreateBooking/handler.js`**
This is the main function that creates bookings. It follows these steps:

1. **Get the request data** - Extract guest info from the request
2. **Validate dates** - Check if dates are valid
3. **Check room availability** - See if rooms are available
4. **Validate guest capacity** - Make sure rooms can fit all guests
5. **Calculate cost** - Figure out the total price
6. **Save to database** - Store the booking
7. **Send response** - Tell the user if it worked

### **Step 2: Look at `services/roomService.js`**
This handles all room-related logic:

- **Room types**: single (1 guest, 500 SEK), double (2 guests, 1000 SEK), suite (3 guests, 1500 SEK)
- **Date validation**: Check-in can't be in the past, check-out must be after check-in
- **Cost calculation**: Price × quantity × nights
- **Capacity validation**: Make sure rooms can fit all guests

### **Step 3: Check `services/bookingService.js`**
This contains the main booking logic and database operations.

### **Step 4: Look at `responses/index.js`**
This formats the responses sent back to users (success or error).

## How to test the API

### **Using curl (command line):**

```bash
# Create a booking
curl -X POST https://your-api-url.amazonaws.com/dev/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "guests": 2,
    "roomTypes": {
      "double": 1
    },
    "checkIn": "2025-02-15",
    "checkOut": "2025-02-17",
    "guestName": "John Doe",
    "email": "john@example.com"
  }'

# Get all bookings
curl https://your-api-url.amazonaws.com/dev/bookings
```

### **Using Postman:**
1. Import the Postman collection
2. Update the base URL
3. Run the test requests

## Key Concepts for Beginners

### **1. HTTP Methods**
- **POST** - Create something new (create booking)
- **GET** - Get information (get bookings)
- **PUT** - Update something (update booking)

### **2. JSON**
- JavaScript Object Notation
- How data is sent between frontend and backend
- Example: `{"guests": 2, "roomTypes": {"double": 1}}`

### **3. API Endpoints**
- URLs that your API responds to
- Like: `https://api.com/bookings` or `https://api.com/bookings/123`

### **4. Status Codes**
- **200** - Success
- **201** - Created successfully
- **400** - Bad request (user error)
- **500** - Server error

### **5. Environment Variables**
- Configuration values that can change
- Like `AWS_REGION` or `BOOKINGS_TABLE`

## Common Issues and Solutions

### **"Invalid check-in or check-out dates"**
- Make sure check-in is not in the past
- Make sure check-out is after check-in
- Use future dates like "2025-02-15"

### **"Not enough rooms available"**
- The hotel only has 20 rooms total
- Someone else might have booked them for those dates
- Try different dates

### **"Invalid number of guests or room types"**
- Make sure the number of guests matches room capacity
- Single room = 1 guest, Double room = 2 guests, Suite = 3 guests
- Example: 3 guests need either 1 suite OR 1 single + 1 double

## Learning Resources

- **Serverless Framework**: https://www.serverless.com/framework/docs/
- **AWS Lambda**: https://docs.aws.amazon.com/lambda/
- **DynamoDB**: https://docs.aws.amazon.com/dynamodb/
- **Node.js**: https://nodejs.org/en/docs/

## Next Steps

1. **Understand the code** - Read through each file with comments
2. **Test the API** - Try creating bookings with different data
3. **Modify the code** - Try adding new features
4. **Deploy changes** - Use `serverless deploy` to update
5. **Monitor logs** - Use `serverless logs` to see what's happening

Remember: **Don't be afraid to experiment!** The worst that can happen is you need to redeploy.

