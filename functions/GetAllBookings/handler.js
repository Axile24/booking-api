// Importera nödvändiga moduler
const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

// Huvudfunktion som hämtar alla bokningar
module.exports.handler = async (event) => {
  try {
    console.log('GetAllBookings event:', JSON.stringify(event, null, 2));
    
    // Hämta alla bokningar från DynamoDB
    const result = await db.scan({
      TableName: "bookings"
    }).promise();
    
    // Skicka framgångsrikt svar med alla bokningar
    return sendResponse({
      message: "Bookings retrieved successfully",
      count: result.Items ? result.Items.length : 0,
      bookings: result.Items || []
    });
    
  } catch (error) {
    // Logga fel och skicka felmeddelande
    console.error('Error getting bookings:', error);
    return sendError(500, "Failed to retrieve bookings");
  }
};
