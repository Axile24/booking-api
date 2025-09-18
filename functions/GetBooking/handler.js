/**
 * Get Single Booking Handler
 * This function retrieves a specific booking by its ID
 * Useful for viewing booking details or checking booking status
 */

const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

/**
 * Handler handler function that retrieves a specific booking
 * @param {Object} event - The incoming request event from API Gateway
 * @returns {Object} - Response object with booking details or error
 */
module.exports.handler = async (event) => {
  console.log("Retrieving booking...");
  
  try {
    // Get booking ID from the URL path (e.g., /bookings/123)
    const bookingId = event.pathParameters?.id;
    
    // Check if booking ID was provided
    if (!bookingId) {
      return sendError(400, "Booking ID is required");
    }
    
    console.log(`Looking for booking: ${bookingId}`);
    
    // Get booking from DynamoDB
    const result = await db.get({
      TableName: process.env.BOOKINGS_TABLE || "hotel-bookings-axile",
      Key: {
        bookingId: bookingId
      }
    }).promise();
    
    // Check if booking was found
    if (!result.Item) {
      return sendError(404, "Booking not found");
    }
    
    console.log("Booking found successfully");
    
    // Send successful response with booking details
    return sendResponse({
      message: "Booking retrieved successfully",
      booking: result.Item
    });
    
  } catch (error) {
    // Log error and send error response
    console.error('Error getting booking:', error);
    return sendError(500, "Failed to retrieve booking. Please try again.");
  }
};