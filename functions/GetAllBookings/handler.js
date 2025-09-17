// Importera nödvändiga moduler
const { sendResponse, sendError } = require("../../responses");
<<<<<<< HEAD
const { getAllBookings } = require("../../services/bookingService");
=======
const { db } = require("../../services/db");
>>>>>>> 3bca9fc249bd724be58b61d76f8464d7f8ea7459

// Huvudfunktion som hämtar alla bokningar
module.exports.handler = async (event) => {
  try {
<<<<<<< HEAD
    const bookings = await getAllBookings();
    return sendResponse(200, {
        message: "Bookings retrieved successfully",
        count: bookings.length,
        bookings,
    });
=======
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
    
>>>>>>> 3bca9fc249bd724be58b61d76f8464d7f8ea7459
  } catch (error) {
    // Logga fel och skicka felmeddelande
    console.error('Error getting bookings:', error);
    return sendError(500, "Failed to retrieve bookings");
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> 3bca9fc249bd724be58b61d76f8464d7f8ea7459
