// Importera nödvändiga bibliotek
const { sendResponse, sendError } = require("../../responses");
const { createBooking } = require("../../services/bookingService");

// Huvudfunktion som hanterar skapande av bokningar
module.exports.handler = async (event) => {
  try {
    const bookingData = JSON.parse(event.body);

    // All logik flyttas till services-lagret
    const newBooking = await createBooking(bookingData);

    return sendResponse(201, {
      message: "Booking created successfully!",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);

    // Hantera specifika felmeddelanden
    if (error.message === "Invalid input" || error.message === "Not enough rooms available") {
      return sendError(400, error.message);
    }
    
    return sendError(500, "Failed to create booking.");
  }
};
