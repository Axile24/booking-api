# Bonz.ai Hotel Booking API

A serverless booking API for Bonz.ai hotel built with AWS Lambda, API Gateway, and DynamoDB using Node.js.

> **Based on**: [marafabiana/hotel-booking-api](https://github.com/marafabiana/hotel-booking-api.git) structure and implementation

## 🏨 About

This API allows guests to create, read, update, and manage hotel room bookings. Built with a serverless architecture for automatic scaling and cost efficiency.

## 🚀 Features

- **Room Management**: Support for 3 room types (Single, Double, Suite)
- **Booking CRUD**: Create, read, update, and manage bookings
- **Validation**: Comprehensive input validation and error handling
- **Serverless**: AWS Lambda functions with automatic scaling
- **Database**: DynamoDB for fast, scalable data storage
- **CORS Support**: Ready for frontend integration

## 🏗️ Architecture

- **AWS Lambda**: Serverless compute functions
- **API Gateway**: RESTful API endpoints
- **DynamoDB**: NoSQL database for bookings
- **Serverless Framework**: Infrastructure as code

## 📋 Room Types & Pricing

| Room Type | Max Guests | Price/Night |
|-----------|------------|-------------|
| Single    | 1          | 500 SEK     |
| Double    | 2          | 1000 SEK    |
| Suite     | 3          | 1500 SEK    |

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Axile24/booking-api.git
   cd booking-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Serverless Framework globally**
   ```bash
   npm install -g serverless
   ```

4. **Configure AWS credentials**
   ```bash
   serverless config credentials --provider aws --key YOUR_ACCESS_KEY --secret YOUR_SECRET_KEY
   ```

## 🚀 Deployment

1. **Deploy to AWS**
   ```bash
   npm run deploy
   ```

2. **Deploy to specific stage**
   ```bash
   serverless deploy --stage production
   ```

3. **Remove deployment**
   ```bash
   npm run remove
   ```

## 🧪 Local Development

1. **Start local server**
   ```bash
   npm run offline
   ```

2. **View logs**
   ```bash
   npm run logs
   ```

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API reference.

### Quick Start Examples

**Create a booking (matching marafabiana structure):**
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

**Response Structure:**
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

**Get all bookings:**
```bash
curl https://your-api-url.amazonaws.com/dev/bookings
```

**Get specific booking:**
```bash
curl https://your-api-url.amazonaws.com/dev/bookings/{booking-id}
```

## 📁 Project Structure

```
booking-api/
├── functions/                 # Lambda function handlers
│   ├── CreateBooking/
│   ├── GetAllBookings/
│   ├── GetBooking/
│   └── UpdateBooking/
├── services/                  # Business logic
│   ├── bookingService.js
│   └── roomService.js
├── responses/                 # API response utilities
│   ├── apiResponse.js
│   └── errorHandler.js
├── serverless.yml            # Serverless configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🔧 Configuration

The API is configured through `serverless.yml`:

- **Region**: eu-north-1 (configurable)
- **Runtime**: Node.js 18.x
- **Database**: DynamoDB with pay-per-request billing
- **CORS**: Enabled for all origins

## 🐛 Error Handling

The API includes comprehensive error handling for:
- Input validation errors
- DynamoDB connection issues
- Invalid room configurations
- Missing required fields
- Email format validation

## 📝 Environment Variables

- `BOOKINGS_TABLE`: DynamoDB table name (auto-generated)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Axile24** - [GitHub](https://github.com/Axile24)

## 🔗 Links

- [Serverless Framework](https://www.serverless.com/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [DynamoDB](https://aws.amazon.com/dynamodb/)
- [API Gateway](https://aws.amazon.com/api-gateway/)
