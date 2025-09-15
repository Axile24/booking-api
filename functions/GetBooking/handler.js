const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

module.exports.handler = async (event) => {
  try {
    console.log('GetBooking event:', JSON.stringify(event, null, 2));
    
    // Get booking ID from path parameters
    const bookingId = event.pathParameters?.id;
    
    if (!bookingId) {
      return sendError(400, "Booking ID is required");
    }
    
    // Get booking from DynamoDB
    const result = await db.get({
      TableName: "bookings",
      Key: {
        bookingId: bookingId
      }
    }).promise();
    
    if (!result.Item) {
      return sendError(404, "Booking not found");
    }
    
    return sendResponse({
      message: "Booking retrieved successfully",
      booking: result.Item
    });
    
  } catch (error) {
    console.error('Error getting booking:', error);
    return sendError(500, "Failed to retrieve booking");
  }
};
