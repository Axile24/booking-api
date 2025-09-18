// Skapa bokning - enkel kod
const { v4: uuidv4 } = require("uuid");
const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

module.exports.handler = async (event) => {
  try {
    // Hämta data från request
    const body = JSON.parse(event.body);
    const { guests, roomTypes, guestName, email } = body;

    // Kontrollera att obligatoriska fält finns
    if (!guests || !roomTypes || !guestName || !email) {
      return sendError(400, "Saknar obligatoriska fält");
    }

    // Skapa bokning
    const bookingId = uuidv4();
    const totalRooms = Object.values(roomTypes).reduce((sum, value) => sum + value, 0);
    const totalCost = totalRooms * 1000; // Enkel prissättning

    const booking = {
      bookingId,
      guests,
      roomTypes,
      totalRooms,
      guestName,
      email,
      totalCost,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    // Spara i databas
    await db.put({
      TableName: process.env.BOOKINGS_TABLE || "hotel-bookings-axile",
      Item: booking,
    }).promise();

    // Skicka tillbaka bokning
    return sendResponse({
      message: "Bokning skapad",
      booking: booking
    });
    
  } catch (error) {
    return sendError(500, "Fel");
  }
};