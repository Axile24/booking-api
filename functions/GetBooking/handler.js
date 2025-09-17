// Importera nödvändiga moduler
const { sendResponse, sendError } = require("../../responses");
const { getBookingById } = require("../../services/bookingService");

// Huvudfunktion som hämtar en specifik bokning
module.exports.handler = async (event) => {
  try {
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
  } catch (error) {
    // Logga fel och skicka felmeddelande
    console.error('Error getting booking:', error);
    return sendError(500, "Failed to retrieve booking");
  }
};