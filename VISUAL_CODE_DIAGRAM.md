# Visual Code Structure

## Project Overview
```
┌─────────────────────────────────────────────────────────────┐
│                    HOTEL BOOKING API                        │
│                     (Serverless)                           │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY                             │
│              (Entry point for all requests)                │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    LAMBDA FUNCTIONS                        │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │  CREATE     │ │   READ      │ │  UPDATE     │          │
│  │  (49 lines) │ │ (24+37 lines)│ │ (41 lines) │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐                          │
│  │  DELETE     │ │  HELPERS    │                          │
│  │ (37 lines)  │ │ (25+11 lines)│                         │
│  └─────────────┘ └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    DYNAMODB                                │
│              (hotel-bookings-axile table)                  │
└─────────────────────────────────────────────────────────────┘
```

## Function Details

### CreateBooking Handler
```
┌─────────────────────────────────────────────────────────────┐
│                    POST /bookings                           │
│                                                             │
│  1. Hämta data från request                                 │
│  2. Kontrollera obligatoriska fält                          │
│  3. Skapa unikt booking ID                                  │
│  4. Beräkna kostnad (1000 per rum)                         │
│  5. Spara i DynamoDB                                        │
│  6. Skicka tillbaka bokning                                 │
└─────────────────────────────────────────────────────────────┘
```

### GetAllBookings Handler
```
┌─────────────────────────────────────────────────────────────┐
│                    GET /bookings                            │
│                                                             │
│  1. Hämta alla bokningar från databas                      │
│  2. Räkna antal bokningar                                   │
│  3. Skicka tillbaka alla bokningar                         │
└─────────────────────────────────────────────────────────────┘
```

### GetBooking Handler
```
┌─────────────────────────────────────────────────────────────┐
│                  GET /bookings/{id}                         │
│                                                             │
│  1. Hämta ID från URL                                       │
│  2. Kontrollera att ID finns                                │
│  3. Hämta bokning från databas                              │
│  4. Kontrollera om bokning finns                            │
│  5. Skicka tillbaka bokning                                 │
└─────────────────────────────────────────────────────────────┘
```

### UpdateBooking Handler
```
┌─────────────────────────────────────────────────────────────┐
│                  PUT /bookings/{id}                         │
│                                                             │
│  1. Hämta ID från URL                                       │
│  2. Kontrollera att ID finns                                │
│  3. Hämta data från request                                 │
│  4. Uppdatera bara status i databas                        │
│  5. Skicka tillbaka uppdaterad bokning                     │
└─────────────────────────────────────────────────────────────┘
```

### DeleteBooking Handler
```
┌─────────────────────────────────────────────────────────────┐
│                DELETE /bookings/{id}                        │
│                                                             │
│  1. Hämta ID från URL                                       │
│  2. Kontrollera att ID finns                                │
│  3. Ta bort från databas                                    │
│  4. Kontrollera om bokning fanns                            │
│  5. Skicka tillbaka bekräftelse                             │
└─────────────────────────────────────────────────────────────┘
```

## Helper Functions

### Response Helpers
```
┌─────────────────────────────────────────────────────────────┐
│                    responses/index.js                       │
│                                                             │
│  sendResponse(data, statusCode)                             │
│  ├── Formaterar lyckade svar                                │
│  ├── Lägger till CORS headers                              │
│  └── Wrapar data i JSON                                     │
│                                                             │
│  sendError(statusCode, message)                             │
│  ├── Formaterar felmeddelanden                              │
│  ├── Lägger till CORS headers                              │
│  └── Returnerar felmeddelande                               │
└─────────────────────────────────────────────────────────────┘
```

### Database Service
```
┌─────────────────────────────────────────────────────────────┐
│                      services/db.js                         │
│                                                             │
│  ├── Konfigurerar AWS DynamoDB                              │
│  ├── Sätter region till eu-north-1                         │
│  └── Exporterar client för användning                      │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
Client Request
      │
      ▼
┌─────────────┐
│ API Gateway │
└─────────────┘
      │
      ▼
┌─────────────┐
│ Lambda      │
│ Function    │
└─────────────┘
      │
      ▼
┌─────────────┐
│ Response    │
│ Helper      │
└─────────────┘
      │
      ▼
┌─────────────┐
│ DynamoDB    │
│ Table       │
└─────────────┘
      │
      ▼
┌─────────────┐
│ Client      │
│ Response    │
└─────────────┘
```

## Code Statistics

| Component | Lines | Purpose |
|-----------|-------|---------|
| CreateBooking | 49 | Create new booking |
| GetAllBookings | 24 | Get all bookings |
| GetBooking | 37 | Get specific booking |
| UpdateBooking | 41 | Update booking status |
| DeleteBooking | 37 | Delete booking |
| Response Helpers | 25 | Format responses |
| Database Service | 11 | DB connection |
| **TOTAL** | **224** | **Complete API** |

## Key Features

- **Simple:** All functions under 50 lines  
- **Clean:** Swedish comments throughout  
- **Consistent:** Same structure everywhere  
- **Fast:** Minimal processing time  
- **Reliable:** Proper error handling  
- **Beginner-friendly:** Easy to understand and modify  

This visual representation shows how the cleaned code is organized and how each component works together to create a complete hotel booking API.
