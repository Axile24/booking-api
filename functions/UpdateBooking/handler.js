/**
 * Update Booking Handler
 * This function updates an existing booking
 * It allows changing guest details, room types, dates, and status
 */

const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

/**
 * Main handler function that updates a booking
 * @param {Object} event - The incoming request event from API Gateway
 * @returns {Object} - Response object with updated booking or error
 */
module.exports.handler = async (event) => {
  console.log("Updating booking...");
  
  try {
    // Get booking ID from the URL path (e.g., /bookings/123)
    const bookingId = event.pathParameters?.id;
    
    // Check if booking ID was provided
    if (!bookingId) {
      return sendError(400, "Booking ID is required");
    }
    
    // Parse the request body to get update data
    const body = JSON.parse(event.body || '{}');
    
    console.log(`Updating booking: ${bookingId}`);
    
    // Check if booking exists before updating
    const existingBooking = await db.get({
      TableName: process.env.BOOKINGS_TABLE || "hotel-bookings-axile",
      Key: {
        bookingId: bookingId
      }
    }).promise();
    
    if (!existingBooking.Item) {
      return sendError(404, "Booking not found");
    }
    
    // Prepare the update expression (what fields to update)
    let updateExpression = 'SET updatedAt = :updatedAt';
    let expressionAttributeValues = {
      ':updatedAt': new Date().toISOString()
    };
    
    // Add fields to update if they are provided in the request
    if (body.guestName) {
      updateExpression += ', guestName = :guestName';
      expressionAttributeValues[':guestName'] = body.guestName.trim();
    }
    
    if (body.email) {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return sendError(400, "Invalid email format");
      }
      updateExpression += ', email = :email';
      expressionAttributeValues[':email'] = body.email.toLowerCase().trim();
    }
    
    if (body.guests) {
      updateExpression += ', guests = :guests';
      expressionAttributeValues[':guests'] = parseInt(body.guests);
    }
    
    if (body.roomTypes) {
      updateExpression += ', roomTypes = :roomTypes';
      expressionAttributeValues[':roomTypes'] = body.roomTypes;
    }
    
    if (body.checkIn) {
      updateExpression += ', checkIn = :checkIn';
      expressionAttributeValues[':checkIn'] = body.checkIn;
    }
    
    if (body.checkOut) {
      updateExpression += ', checkOut = :checkOut';
      expressionAttributeValues[':checkOut'] = body.checkOut;
    }
    
    if (body.status) {
      // Validate status values
      const validStatuses = ['confirmed', 'cancelled', 'completed'];
      if (!validStatuses.includes(body.status)) {
        return sendError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }
      updateExpression += ', status = :status';
      expressionAttributeValues[':status'] = body.status;
    }
    
    // Update the booking in DynamoDB
    const result = await db.update({
      TableName: process.env.BOOKINGS_TABLE || "hotel-bookings-axile",
      Key: {
        bookingId: bookingId
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'  // Return the updated booking
    }).promise();
    
    console.log("Booking updated successfully");
    
    // Send successful response with updated booking
    return sendResponse({
      message: "Booking updated successfully",
      booking: result.Attributes
    });
    
  } catch (error) {
    // Log error and send error response
    console.error('Error updating booking:', error);
    return sendError(500, "Failed to update booking. Please try again.");
  }
};