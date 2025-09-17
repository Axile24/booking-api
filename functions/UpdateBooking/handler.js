const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

module.exports.handler = async (event) => {
  try {
    console.log('UpdateBooking event:', JSON.stringify(event, null, 2));
    
    // Get booking ID from path parameters
    const bookingId = event.pathParameters?.id;
    
    if (!bookingId) {
      return sendError(400, "Booking ID is required");
    }
    
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    
    // Check if booking exists
    const existingBooking = await db.get({
      TableName: "bookings",
      Key: {
        bookingId: bookingId
      }
    }).promise();
    
    if (!existingBooking.Item) {
      return sendError(404, "Booking not found");
    }
    
    // Prepare update expression
    let updateExpression = 'SET updatedAt = :updatedAt';
    let expressionAttributeValues = {
      ':updatedAt': new Date().toISOString()
    };
    
    // Add fields to update if provided
    if (body.guestName) {
      updateExpression += ', guestName = :guestName';
      expressionAttributeValues[':guestName'] = body.guestName;
    }
    
    if (body.email) {
      updateExpression += ', email = :email';
      expressionAttributeValues[':email'] = body.email;
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
      updateExpression += ', status = :status';
      expressionAttributeValues[':status'] = body.status;
    }
    
    // Update booking in DynamoDB
    const result = await db.update({
      TableName: "bookings",
      Key: {
        bookingId: bookingId
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    }).promise();
    
    return sendResponse({
      message: "Booking updated successfully",
      booking: result.Attributes
    });
    
  } catch (error) {
    console.error('Error updating booking:', error);
    return sendError(500, "Failed to update booking");
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> 3bca9fc249bd724be58b61d76f8464d7f8ea7459
