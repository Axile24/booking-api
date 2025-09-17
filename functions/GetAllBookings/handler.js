/**
 * Get All Bookings Handler
 * This function retrieves all bookings from the database
 * It's useful for admin panels or booking management
 */

const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

/**
 * Main handler function that retrieves all bookings
 * @param {Object} event - The incoming request event from API Gateway
 * @returns {Object} - Response object with all bookings or error
 */
module.exports.handler = async (event) => {
  console.log("Retrieving all bookings...");
  
  try {
    // Get all bookings from DynamoDB
    const result = await db.scan({
      TableName: process.env.BOOKINGS_TABLE || "hotel-bookings-axile"
    }).promise();
    
    const bookings = result.Items || [];
    console.log(`Found ${bookings.length} bookings`);
    
    // Send successful response with all bookings
    return sendResponse({
      message: "Bookings retrieved successfully",
      count: bookings.length,
      bookings: bookings
    });
    
  } catch (error) {
    // Log error and send error response
    console.error('Error getting bookings:', error);
    return sendError(500, "Failed to retrieve bookings. Please try again.");
  }
};