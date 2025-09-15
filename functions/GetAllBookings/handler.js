const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

module.exports.handler = async (event) => {
  try {
    console.log('GetAllBookings event:', JSON.stringify(event, null, 2));
    
    // Get all bookings from DynamoDB
    const result = await db.scan({
      TableName: "bookings"
    }).promise();
    
    return sendResponse({
      message: "Bookings retrieved successfully",
      count: result.Items ? result.Items.length : 0,
      bookings: result.Items || []
    });
    
  } catch (error) {
    console.error('Error getting bookings:', error);
    return sendError(500, "Failed to retrieve bookings");
  }
};
