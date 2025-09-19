Hotel Booking API

PRESENTATION:
  https://youtu.be/5oi9C7gwSaU 

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
Setup & Installation

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

API Endpoints


| POST | `/bookings` | Create a new booking |
| GET | `/bookings` | Get all bookings |
| GET | `/bookings/{id}` | Get specific booking |
| PUT | `/bookings/{id}` | Update booking |


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

URL:
https://r3xabxjpa5.execute-api.eu-north-1.amazonaws.com/dev

POST https://r3xabxjpa5.execute-api.eu-north-1.amazonaws.com/dev/bookings
GET https://r3xabxjpa5.execute-api.eu-north-1.amazonaws.com/dev/bookings/{id}
PUT https://r3xabxjpa5.execute-api.eu-north-1.amazonaws.com/dev/bookings/{id}

Curl curl -X POST https://r3xabxjpa5.execute-api.eu-north-1.amazonaws.com/dev/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "guests": 2,
    "roomTypes": {"double": 1},
    "checkIn": "2025-12-20",
    "checkOut": "2025-12-22",
    "guestName": "Test User",
    "email": "test@example.com"
  }'

  curl https://r3xabxjpa5.execute-api.eu-north-1.amazonaws.com/dev/bookings 
  url -X POST https://r3xabxjpa5.execute-api.eu-north-1.amazonaws.com/dev/bookings -H "Content-Type: application/json" -d '{"guests": 2, "roomTypes": {"double": 1}, "checkIn": "2025-12-20", "checkOut": "2025-12-22", "guestName": "AWS Test User", "email": "awstest@example.com"}'
  curl https://r3xabxjpa5.execute-api.eu-north-1.amazonaws.com/dev/bookings
  $ curl -X POST https://r3xabxjpa5.execute-api.eu-north-1.amazonaws.com/dev/bookings -H "Content-Type: application/json" -d '{"guests": 2, "roomTypes": {"double": 1}, "checkIn": "2025-12-20", "checkOut": "2025-12-22", "guestName": "AWS Test User", "email": "awstest@example.com"}'
   curl https://r3xabxjpa5.execute-api.eu-north-1.amazonaws.com/dev/bookings
   curl https://r3xabxjpa5.execute-api.eu-north-1.amazonaws.com/dev/bookings/3caaa969-97c5-4ae8-b29a-9f4982cdce55

   
   https://r3xabxjpa5.execute-api.eu-north-1.amazonaws.com/dev/bookings/3caaa969-97c5-4ae8-b29a-9f4982cdce55
    curl "https://r3xabxjpa5.execute-api.eu-north-1.amazonaws.com/dev/bookings/3caaa969-97c5-4ae8-b29a-9f4982cdce55"
    
   
   



   Tester i browsern 
   ttps://r3xabxjpa5.execute-api.eu-north-1.amazonaws.com/dev/bookings
   https://r3xabxjpa5.execute-api.eu-north-1.amazonaws.com/dev/bookings

- **Framework:** Serverless Framework
- **Runtime:** Node.js 20.x
- **Database:** AWS DynamoDB
- **Deployment:** AWS Lambda + API Gateway


