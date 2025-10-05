// Uppdatera bokning - med affärslogik för rumkapacitet och priser
const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");
const { 
  validateRoomTypes, 
  validateGuestCapacity, 
  calculateTotalCost,
  calculateTotalCapacity 
} = require("../../services/roomConfig");

module.exports.handler = async (event) => {
  try {
    // Hämta ID från URL
    const id = event.pathParameters?.id;
    
    // Kontrollera att ID finns
    if (!id) {
      return sendError(400, "ID saknas");
    }
    
    // Hämta data från request
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (parseError) {
      return sendError(400, "Ogiltig JSON i request body");
    }
    
    const { guests, roomTypes, guestName, email, status } = body;
    
    const tableName = process.env.BOOKINGS_TABLE || "hotel-bookings-axile";
    
    // Om rumtyper eller gäster uppdateras, validera affärslogik
    if (roomTypes || guests) {
      // Hämta existerande bokning
      let existingBooking;
      try {
        existingBooking = await db.get({
          TableName: tableName,
          Key: { bookingId: id }
        }).promise();
      } catch (dbError) {
        console.error("DynamoDB fel vid hämtning:", dbError);
        return sendError(500, "Databasfel: Kunde inte hämta bokning");
      }
      
      if (!existingBooking.Item) {
        return sendError(404, "Bokning finns inte");
      }
      
      // Använd nya värden eller fall tillbaka på existerande
      const updatedGuests = guests || existingBooking.Item.guests;
      const updatedRoomTypes = roomTypes || existingBooking.Item.roomTypes;
      
      // Validera rumtyper om de uppdateras
      if (roomTypes) {
        const roomValidation = validateRoomTypes(roomTypes);
        if (!roomValidation.valid) {
          return sendError(400, roomValidation.message);
        }
      }
      
      // Validera att gäster passar i rummen
      const capacityValidation = validateGuestCapacity(updatedGuests, updatedRoomTypes);
      if (!capacityValidation.valid) {
        return sendError(400, capacityValidation.message);
      }
      
      // Beräkna nya totalvärden
      const totalRooms = Object.values(updatedRoomTypes).reduce((sum, value) => sum + value, 0);
      const totalCost = calculateTotalCost(updatedRoomTypes);
      const totalCapacity = calculateTotalCapacity(updatedRoomTypes);
      
      // Bygg UpdateExpression dynamiskt
      let updateExpression = 'SET updatedAt = :updatedAt';
      const expressionAttributeValues = {
        ':updatedAt': new Date().toISOString()
      };
      const expressionAttributeNames = {};
      
      if (roomTypes) {
        updateExpression += ', roomTypes = :roomTypes, totalRooms = :totalRooms, totalCost = :totalCost, totalCapacity = :totalCapacity';
        expressionAttributeValues[':roomTypes'] = updatedRoomTypes;
        expressionAttributeValues[':totalRooms'] = totalRooms;
        expressionAttributeValues[':totalCost'] = totalCost;
        expressionAttributeValues[':totalCapacity'] = totalCapacity;
      }
      
      if (guests) {
        updateExpression += ', guests = :guests';
        expressionAttributeValues[':guests'] = updatedGuests;
      }
      
      if (guestName) {
        updateExpression += ', guestName = :guestName';
        expressionAttributeValues[':guestName'] = guestName;
      }
      
      if (email) {
        updateExpression += ', email = :email';
        expressionAttributeValues[':email'] = email;
      }
      
      if (status) {
        updateExpression += ', #status = :status';
        expressionAttributeNames['#status'] = 'status';
        expressionAttributeValues[':status'] = status;
      }
      
      // Uppdatera bokning
      let result;
      try {
        result = await db.update({
          TableName: tableName,
          Key: { bookingId: id },
          UpdateExpression: updateExpression,
          ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: 'ALL_NEW'
        }).promise();
      } catch (dbError) {
        console.error("DynamoDB fel vid uppdatering:", dbError);
        return sendError(500, "Databasfel: Kunde inte uppdatera bokning");
      }
      
      return sendResponse({
        message: "Bokning uppdaterad",
        booking: result.Attributes
      });
      
    } else {
      // Endast statusuppdatering eller andra fält utan rumlogik
      let updateExpression = 'SET updatedAt = :updatedAt';
      const expressionAttributeValues = {
        ':updatedAt': new Date().toISOString()
      };
      const expressionAttributeNames = {};
      
      if (guestName) {
        updateExpression += ', guestName = :guestName';
        expressionAttributeValues[':guestName'] = guestName;
      }
      
      if (email) {
        updateExpression += ', email = :email';
        expressionAttributeValues[':email'] = email;
      }
      
      if (status) {
        updateExpression += ', #status = :status';
        expressionAttributeNames['#status'] = 'status';
        expressionAttributeValues[':status'] = status;
      }
      
      let result;
      try {
        result = await db.update({
          TableName: tableName,
          Key: { bookingId: id },
          UpdateExpression: updateExpression,
          ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: 'ALL_NEW'
        }).promise();
      } catch (dbError) {
        console.error("DynamoDB fel vid uppdatering:", dbError);
        return sendError(500, "Databasfel: Kunde inte uppdatera bokning");
      }
      
      return sendResponse({
        message: "Bokning uppdaterad",
        booking: result.Attributes
      });
    }
    
  } catch (error) {
    console.error("Fel vid uppdatering av bokning:", error);
    return sendError(500, "Serverfel vid uppdatering av bokning");
  }
};