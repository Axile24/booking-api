Hotel Booking API

PRESENTATION:
  https://youtu.be/5oi9C7gwSaU 

A simple serverless API for managing hotel bookings, built with AWS Lambda and DynamoDB.

## Features

- Serverless 
- AWS Lambda functions
- DynamoDB database
- REST API design
- JavaScript/Node.js



## Rumtyper och Priser
Kolla postman

**Affärslogik:**
- Det går att ha olika typer av rum i en bokning
- Antal gäster måste stämma överens med rumkapaciteten
- Exempel: 3 personer behöver boka antingen en svit ELLER ett enkelrum + ett dubbelrum
- Totalpriset beräknas automatiskt baserat på valda rumtyper

**Tekniska Krav (Uppfyllda):**
-  Serverless Framework
- API Gateway
- AWS Lambda
- DynamoDB
- Felhantering för DynamoDB
-  Validering av body-värden

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

## API Endpoints

Method EndpointDescription
 POST | `/bookings` | Create a new booking |
 GET | `/bookings` | Get all bookings |
 GET | `/bookings/{id}` | Get specific booking |
 PUT | `/bookings/{id}` | Update booking |
 DELETE | `/bookings/{id}` | Delete booking |

## Exempel - Skapa Bokning

```bash
curl -X POST https://your-api-url/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "guests": 2,
    "roomTypes": {"double": 1},
    "guestName": "John Doe",
    "email": "john@example.com"
  }'
```

**Response - Lyckad bokning:**
- `totalCost`: 1000 SEK (1 dubbelrum)
- `totalCapacity`: 2 gäster
- Validering: ✅ 2 gäster passar i 2 platser

## Exempel - Uppdatera Bokning

```bash
curl -X PUT https://your-api-url/bookings/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "guests": 5,
    "roomTypes": {"double": 1, "suite": 1}
  }'
```

**Response - Uppdaterad bokning:**
- `totalCost`: 2500 SEK (1 dubbelrum + 1 svit = 1000 + 1500)
- `totalCapacity`: 5 gäster (2 + 3)
- Validering: ✅ 5 gäster passar i 5 platser

## Exempel - Valideringsfel

```bash
# Försök boka 5 gäster i 1 enkelrum
curl -X POST https://your-api-url/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "guests": 5,
    "roomTypes": {"single": 1},
    "guestName": "Jane Doe",
    "email": "jane@example.com"
  }'
```

**Error Response:**
```json
{
  "error": "För många gäster! 5 gäster men endast plats för 1 gäster i de valda rummen"
}
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


