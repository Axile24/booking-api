// Skapa bokning - med affärslogik för rumkapacitet och priser
const { v4: uuidv4 } = require("uuid");
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
    // Hämta data från request
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (parseError) {
      return sendError(400, "Ogiltig JSON i request body");
    }
    
    const { guests, roomTypes, guestName, email } = body;

    // Kontrollera att obligatoriska fält finns
    if (!guests || !roomTypes || !guestName || !email) {
      return sendError(400, "Saknar obligatoriska fält: guests, roomTypes, guestName, email");
    }

    // Validera att antal gäster är ett positivt nummer
    if (typeof guests !== 'number' || guests <= 0) {
      return sendError(400, "Antal gäster måste vara ett positivt nummer");
    }

    // Validera rumtyper
    const roomValidation = validateRoomTypes(roomTypes);
    if (!roomValidation.valid) {
      return sendError(400, roomValidation.message);
    }

    // Validera att gäster passar i rummen
    const capacityValidation = validateGuestCapacity(guests, roomTypes);
    if (!capacityValidation.valid) {
      return sendError(400, capacityValidation.message);
    }

    // Beräkna totalvärden
    const totalRooms = Object.values(roomTypes).reduce((sum, value) => sum + value, 0);
    const totalCost = calculateTotalCost(roomTypes);
    const totalCapacity = calculateTotalCapacity(roomTypes);

    // Skapa bokning
    const bookingId = uuidv4();
    const booking = {
      bookingId,
      guests,
      roomTypes,
      totalRooms,
      totalCapacity,
      guestName,
      email,
      totalCost,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    // Spara i databas
    try {
      await db.put({
        TableName: process.env.BOOKINGS_TABLE || "hotel-bookings-axile",
        Item: booking,
      }).promise();
    } catch (dbError) {
      console.error("DynamoDB fel:", dbError);
      return sendError(500, "Databasfel: Kunde inte spara bokning");
    }

    // Skicka tillbaka bokning
    return sendResponse({
      message: "Bokning skapad",
      booking: booking
    });
    
  } catch (error) {
    console.error("Fel vid skapande av bokning:", error);
    return sendError(500, "Serverfel vid skapande av bokning");
  }
};