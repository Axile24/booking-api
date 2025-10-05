// Enkel funktion för att hämta en bokning
const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

module.exports.handler = async (event) => {
  try {
    // Hämta ID från URL
    const bookingId = event.pathParameters?.id;
    
    // Kontrollera att ID finns
    if (!bookingId) {
      return sendError(400, "Boknings-ID saknas");
    }
    
    // Hämta bokning från databas
    const tableName = process.env.BOOKINGS_TABLE || "hotel-bookings-axile";
    let result;
    try {
      result = await db.get({
        TableName: tableName,
        Key: { bookingId }
      }).promise();
    } catch (dbError) {
      console.error("DynamoDB fel:", dbError);
      return sendError(500, "Databasfel: Kunde inte hämta bokning");
    }
    
    // Kontrollera om bokning finns
    if (!result.Item) {
      return sendError(404, "Bokning hittades inte");
    }
    
    // Skicka tillbaka bokningen
    return sendResponse({
      message: "Bokning hämtad",
      booking: result.Item
    });
    
  } catch (error) {
    console.error("Serverfel:", error);
    return sendError(500, "Serverfel vid hämtning av bokning");
  }
};