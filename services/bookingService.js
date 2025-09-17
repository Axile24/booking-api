const { v4: uuidv4 } = require("uuid");
const { db } = require("./db"); // Importera databasanslutningen
const {
  validateDates,
  validateBookingWithRoomTypes,
  calculateCostByNights,
  checkRoomAvailability,
} = require("./roomService");

const BOOKINGS_TABLE_NAME = process.env.BOOKINGS_TABLE;

async function createBooking(bookingData) {
 const { guests, roomTypes, checkIn, checkOut, guestName, email } = bookingData;

  // Enkel validering av obligatoriska fält
  if (!guestName || !email || !guests || !roomTypes) {
    throw new Error("Invalid input");
  }
  
  // Validera datum
  if (checkIn && checkOut && !validateDates(checkIn, checkOut)) {
    throw new Error("Invalid check-in or check-out dates.");
  }

  // Beräkna totalt antal rum som gästen vill ha
  const totalRoomsRequested = Object.values(roomTypes).reduce(
  (sum, value) => sum + value,
  0
  );

  // Kontrollera rumstillgänglighet
  const totalAvailableRooms = await checkRoomAvailability(checkIn, checkOut);
  if (totalAvailableRooms < totalRoomsRequested) {
  throw new Error("Not enough rooms available for the selected dates.");
  }

  // Validera att antal gäster matchar rumskapacitet
  if (!validateBookingWithRoomTypes(guests, roomTypes)) {
  throw new Error("Invalid number of guests or room types.");
  }

  // Generera unikt boknings-ID
  const bookingId = uuidv4();

  // Beräkna total kostnad baserat på nätter
  const totalCost = calculateCostByNights(roomTypes, checkIn, checkOut);

  // Skapa bokningsobjekt
  const booking = {
  bookingId,
  guests,
  roomTypes,
  totalRooms: totalRoomsRequested,
  checkIn,
  checkOut,
  guestName,
  email,
  totalCost,
  };

  // Spara bokningen i databasen
  await db.put({
    TableName: BOOKINGS_TABLE_NAME,
    Item: booking,
  }).promise();

  return booking;
}
async function getAllBookings() {
    const result = await db.scan({
        TableName: BOOKINGS_TABLE_NAME,
    }).promise();
    return result.Items || [];
}

async function getBookingById(bookingId) {
    const result = await db.get({
        TableName: BOOKINGS_TABLE_NAME,
        Key: {
            bookingId: bookingId
        }
    }).promise();
    return result.Item || null;
}

async function updateBooking(bookingId, updateData) {
    // Enkel logik för att förhindra att gästen uppdaterar ett icke-existerande ID
    const booking = await getBookingById(bookingId);

    if (!booking) {
        throw new Error('Booking not found');
    }

    // Här kan ni bygga ut logiken för att uppdatera fält
    const updatedBooking = { ...booking, ...updateData };

    await db.put({
        TableName: BOOKINGS_TABLE_NAME,
        Item: updatedBooking
    }).promise();

    return updatedBooking;
}

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking
    // lägg till andra funktioner här
};
