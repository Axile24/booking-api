# 🏨 Hotel Booking API

A simple serverless API for managing hotel bookings, built with AWS Lambda and DynamoDB.


- Serverless 
- AWS Lambda functions
- DynamoDB database
- REST API design
- JavaScript/Node.js

- **Create** new hotel bookings
- **View** all bookings
- **Get** a specific booking by ID
- **Update** existing bookings

Structure



## 🛠️ Setup & Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Deploy to AWS:**
   ```bash
   npm run deploy
   ```

3. **Test :**
   ```bash
   npm run offline
   ```

## 📡 API Endpoints


| POST | `/bookings` | Create a new booking |
| GET | `/bookings` | Get all bookings |
| GET | `/bookings/{id}` | Get specific booking |
| PUT | `/bookings/{id}` | Update booking |


 Room Types

| Type | Max Guests | Price/Night |
|------|------------|-------------|
| single | 1 | 500 SEK |
| double | 2 | 1000 SEK |
| suite | 3 | 1500 SEK |

```bash create B
curl -X POST https://your-api-url/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "guests": 2,
    "roomTypes": {"double": 1},
    "checkIn": "2025-02-15",
    "checkOut": "2025-02-17",
    "guestName": "John Doe",
    "email": "john@example.com"
  }'
```

### Get All Bookings
```bash
curl https:///bookings
```

## 🔧 Development

- **Framework:** Serverless Framework
- **Runtime:** Node.js 20.x
- **Database:** AWS DynamoDB
- **Deployment:** AWS Lambda + API Gateway


