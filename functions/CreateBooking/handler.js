const { v4: uuidv4 } = require("uuid");
const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");
const { 
  validateDates, 
  validateBookingWithRoomTypes, 
  calculateCostByNights,
  TOTAL_ROOMS 
} = require("../../services/roomService");

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { guests, roomTypes, checkIn, checkOut, guestName, email } = body;

  try {
    if (!validateDates(checkIn, checkOut)) {
      return sendError(400, "Invalid check-in or check-out dates.");
    }

    const totalRoomsRequested = Object.values(roomTypes).reduce(
      (sum, value) => sum + value,
      0
    );

    if (checkIn && checkOut) {
      const totalAvailableRooms = await checkRoomAvailability(checkIn, checkOut);
      
      if (totalAvailableRooms < totalRoomsRequested) {
        return sendError(
          400,
          "Not enough rooms available for the selected dates."
        );
      }
    }

    if (!validateBookingWithRoomTypes(guests, roomTypes)) {
      return sendError(400, "Invalid number of guests or room types.");
    }

    const bookingId = uuidv4();

    let totalCost;
    if (checkIn && checkOut) {
      totalCost = calculateCostByNights(roomTypes, checkIn, checkOut);
    } else {
      totalCost = Object.entries(roomTypes).reduce((sum, [type, quantity]) => {
        const roomCost = type === 'single' ? 500 : type === 'double' ? 1000 : 1500;
        return sum + (roomCost * quantity);
      }, 0);
    }

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

    await db.put({
      TableName: "bookings",
      Item: booking,
    }).promise();

    return sendResponse({
      message: "Booking created successfully!",
      bookingId,
      guests,
      totalRooms: totalRoomsRequested,
      roomTypes,
      checkIn,
      checkOut,
      guestName,
      totalCost,
    });
    
  } catch (error) {
    console.error("Error creating booking:", error);
    return sendError(500, "Error processing the booking.");
  }
};

async function checkRoomAvailability(checkIn, checkOut) {
  const checkInDate = new Date(checkIn).toISOString();
  const checkOutDate = new Date(checkOut).toISOString();

  const result = await db.scan({
    TableName: "bookings",
    FilterExpression: "(checkIn <= :checkOut AND checkOut >= :checkIn)",
    ExpressionAttributeValues: {
      ":checkIn": checkInDate,
      ":checkOut": checkOutDate,
    },
  }).promise();

  let totalRoomsBooked = 0;
  result.Items.forEach((booking) => {
    const roomCount = Object.values(booking.roomTypes).reduce(
      (sum, value) => sum + value,
      0
    );
    totalRoomsBooked += roomCount;
  });

  const totalAvailableRooms = TOTAL_ROOMS - totalRoomsBooked;
  return totalAvailableRooms;
}