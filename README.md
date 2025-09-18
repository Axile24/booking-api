# Bonz.ai Hotel Boknings-API

Ett serverless boknings-API för Bonz.ai hotell byggt med AWS Lambda, API Gateway och DynamoDB med Node.js.

## Om projektet

Detta API låter gäster skapa, läsa, uppdatera och hantera hotellbokningar. Byggt med serverless arkitektur för automatisk skalning och kostnadseffektivitet.

## Funktioner

- **Rumshantering**: Stöd för 3 rumstyper (Enkel, Dubbel, Svit)
- **Boknings CRUD**: Skapa, läsa, uppdatera och hantera bokningar
- **Validering**: Omfattande inputvalidering och felhantering
- **Serverless**: AWS Lambda-funktioner med automatisk skalning
- **Databas**: DynamoDB för snabb, skalbar datalagring
- **CORS-stöd**: Redo för frontend-integration

## Arkitektur

- **AWS Lambda**: Serverless beräkningsfunktioner
- **API Gateway**: RESTful API-slutpunkter
- **DynamoDB**: NoSQL-databas för bokningar
- **Serverless Framework**: Infrastruktur som kod

## Installation

1. **Klona repository**
   ```bash
   git clone https://github.com/Axile24/booking-api.git
   cd booking-api
   ```

2. **Installera beroenden**
   ```bash
   npm install
   ```

3. **Installera Serverless Framework globalt**
   ```bash
   npm install -g serverless
   ```

4. **Konfigurera AWS-uppgifter**
   ```bash
   serverless config credentials --provider aws --key YOUR_ACCESS_KEY --secret YOUR_SECRET_KEY
   ```

## Deployment

1. **Deploya till AWS**
   ```bash
   npm run deploy
   ```

2. **Deploya till specifik stage**
   ```bash
   serverless deploy --stage production
   ```

3. **Ta bort deployment**
   ```bash
   npm run remove
   ```

## Lokal utveckling

1. **Starta lokal server**
   ```bash
   npm run offline
   ```

2. **Visa loggar**
   ```bash
   npm run logs
   ```

## API-dokumentation

Se [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) för detaljerad API-referens.

### Snabbstarts-exempel

**Skapa en bokning (matchar marafabiana-struktur):**
```bash
curl -X POST https://your-api-url.amazonaws.com/dev/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "guests": 10,
    "roomTypes": {
      "suite": 2,
      "double": 1,
      "single": 2
    },
    "checkIn": "2024-12-27",
    "checkOut": "2026-12-28",
    "guestName": "King Julien",
    "email": "king.julien@example.com"
  }'
```

**Svarsstruktur:**
```json
{
  "data": {
    "message": "Booking created successfully!",
    "bookingId": "8090cd5b-f356-4b2b-9192-da892e86be79",
    "guests": 10,
    "totalRooms": 5,
    "roomTypes": {
      "suite": 2,
      "double": 1,
      "single": 2
    },
    "checkIn": "2024-12-27",
    "checkOut": "2026-12-28",
    "guestName": "King Julien",
    "totalCost": 3655000
  }
}
```

**Hämta alla bokningar:**
```bash
curl https://your-api-url.amazonaws.com/dev/bookings
```

**Hämta specifik bokning:**
```bash
curl https://your-api-url.amazonaws.com/dev/bookings/{booking-id}
```

## Projektstruktur

```
booking-api/
├── functions/                 # Lambda-funktionshandlers
│   ├── CreateBooking/
│   ├── GetAllBookings/
│   ├── GetBooking/
│   └── UpdateBooking/
├── services/                  # Affärslogik
│   ├── bookingService.js
│   └── roomService.js
├── responses/                 # API-svarsverktyg
│   └── index.js
├── serverless.yml            # Serverless-konfiguration
├── package.json              # Beroenden
└── README.md                 # Denna fil
```

## Konfiguration

API:et konfigureras genom `serverless.yml`:

- **Region**: eu-north-1 (konfigurerbar)
- **Runtime**: Node.js 18.x
- **Databas**: DynamoDB med betala-per-begäran fakturering
- **CORS**: Aktiverat för alla ursprung

## Felhantering

API:et inkluderar omfattande felhantering för:
- Inputvalideringsfel
- DynamoDB-anslutningsproblem
- Ogiltiga rumskonfigurationer
- Saknade obligatoriska fält
- E-postformatvalidering

## Miljövariabler

- `BOOKINGS_TABLE`: DynamoDB-tabellnamn (auto-genererat)

## Bidrag

1. Forka repository
2. Skapa en feature-branch
3. Gör dina ändringar
4. Testa grundligt
5. Skicka in en pull request

## Licens

Detta projekt är licensierad under MIT-licensen.

## Författare

**Axile24** - [GitHub](https://github.com/Axile24)  
**Markiza** - [GitHub](https://github.com/Markiza)

## Länkar

- [Serverless Framework](https://www.serverless.com/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [DynamoDB](https://aws.amazon.com/dynamodb/)
- [API Gateway](https://aws.amazon.com/api-gateway/)