// Importera nödvändiga moduler
const { sendResponse, sendError } = require("../../responses");
const { getAllBookings } = require("../../services/bookingService");

// Huvudfunktion som hämtar alla bokningar
module.exports.handler = async (event) => {
  try {
    const bookings = await getAllBookings();
    return sendResponse(200, {
        message: "Bookings retrieved successfully",
        count: bookings.length,
        bookings,
    });
  } catch (error) {
    // Logga fel och skicka felmeddelande
    console.error('Error getting bookings:', error);
    return sendError(500, "Failed to retrieve bookings");
  }
};
