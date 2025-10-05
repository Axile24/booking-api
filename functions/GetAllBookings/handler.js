// Hämta alla bokningar - enkel kod
const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

module.exports.handler = async (event) => {
  try {
    // Hämta alla bokningar från databas
    let result;
    try {
      result = await db.scan({
        TableName: process.env.BOOKINGS_TABLE || "hotel-bookings-axile"
      }).promise();
    } catch (dbError) {
      console.error("DynamoDB fel:", dbError);
      return sendError(500, "Databasfel: Kunde inte hämta bokningar");
    }
    
    const bookings = result.Items || [];
    
    // Skicka tillbaka alla bokningar
    return sendResponse({
      message: "Bokningar hämtade",
      count: bookings.length,
      bookings: bookings
    });
    
  } catch (error) {
    console.error("Serverfel:", error);
    return sendError(500, "Serverfel vid hämtning av bokningar");
  }
};