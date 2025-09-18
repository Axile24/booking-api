// Hämta alla bokningar - enkel kod
const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

module.exports.handler = async (event) => {
  try {
    // Hämta alla bokningar från databas
    const result = await db.scan({
      TableName: process.env.BOOKINGS_TABLE || "hotel-bookings-axile"
    }).promise();
    
    const bookings = result.Items || [];
    
    // Skicka tillbaka alla bokningar
    return sendResponse({
      message: "Bokningar hämtade",
      count: bookings.length,
      bookings: bookings
    });
    
  } catch (error) {
    return sendError(500, "Fel");
  }
};