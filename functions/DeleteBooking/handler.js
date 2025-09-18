// Ta bort en bokning - enkel kod
const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

module.exports.handler = async (event) => {
  try {
    // Hämta ID från URL
    const id = event.pathParameters?.id;
    
    // Kontrollera att ID finns
    if (!id) {
      return sendError(400, "ID saknas");
    }
    
    // Ta bort från databas
    const tableName = process.env.BOOKINGS_TABLE || "hotel-bookings-axile";
    const result = await db.delete({
      TableName: tableName,
      Key: { bookingId: id },
      ReturnValues: 'ALL_OLD'
    }).promise();
    
    // Kontrollera om bokning fanns
    if (!result.Attributes) {
      return sendError(404, "Bokning hittades inte");
    }
    
    // Skicka tillbaka bekräftelse
    return sendResponse({
      message: "Bokning borttagen",
      booking: result.Attributes
    });
    
  } catch (error) {
    return sendError(500, "Fel");
  }
};
