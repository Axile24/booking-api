// Importera nödvändiga moduler
const { sendResponse, sendError } = require("../../responses");
<<<<<<< HEAD
const { getBookingById } = require("../../services/bookingService");
=======
const { db } = require("../../services/db");
>>>>>>> 3bca9fc249bd724be58b61d76f8464d7f8ea7459

// Huvudfunktion som hämtar en specifik bokning
module.exports.handler = async (event) => {
  try {
<<<<<<< HEAD
    const bookingId = event.pathParameters?.id;
    if (!bookingId) {
        return sendError(400, "Booking ID is required");
    }
    const booking = await getBookingById(bookingId);
    if (!booking) {
        return sendError(404, "Booking not found");
    }
    return sendResponse(200, {
        message: "Booking retrieved successfully",
        booking,
    });
=======
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
    
>>>>>>> 3bca9fc249bd724be58b61d76f8464d7f8ea7459
  } catch (error) {
    // Logga fel och skicka felmeddelande
    console.error('Error getting booking:', error);
    return sendError(500, "Failed to retrieve booking");
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> 3bca9fc249bd724be58b61d76f8464d7f8ea7459
