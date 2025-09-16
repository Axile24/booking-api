// Importera nödvändiga moduler
const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

// Huvudfunktion som hämtar en specifik bokning
module.exports.handler = async (event) => {
  try {
    console.log('GetBooking event:', JSON.stringify(event, null, 2));
    
    // Hämta boknings-ID från sökvägsparametrar
    const bookingId = event.pathParameters?.id;
    
    if (!bookingId) {
      return sendError(400, "Booking ID is required");
    }
    
    // Hämta bokning från DynamoDB
    const result = await db.get({
      TableName: "bookings",
      Key: {
        bookingId: bookingId
      }
    }).promise();
    
    if (!result.Item) {
      return sendError(404, "Booking not found");
    }
    
    // Skicka framgångsrikt svar med bokningen
    return sendResponse({
      message: "Booking retrieved successfully",
      booking: result.Item
    });
    
  } catch (error) {
    // Logga fel och skicka felmeddelande
    console.error('Error getting booking:', error);
    return sendError(500, "Failed to retrieve booking");
  }
};
