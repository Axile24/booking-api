/**
 * Create Booking Handler
 * This function creates a new hotel booking
 * Perfect for beginners to understand how API endpoints work
 */

const { v4: uuidv4 } = require("uuid");
const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

module.exports.handler = async (event) => {
  try {
    // 1. Get data from the request
    const body = JSON.parse(event.body);
    const { guests, roomTypes, checkIn, checkOut, guestName, email } = body;

    // 2. Check that all required fields are provided
    if (!guests || !roomTypes || !guestName || !email) {
      return sendError(400, "Missing required fields: guests, roomTypes, guestName, email");
    }

    // 3. Validate dates (if provided)
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const today = new Date();
      
      if (checkInDate < today) {
        return sendError(400, "Check-in date cannot be in the past");
      }
      
      if (checkOutDate <= checkInDate) {
        return sendError(400, "Check-out date must be after check-in date");
      }
    }

    // 4. Calculate total number of rooms
    const totalRooms = Object.values(roomTypes).reduce((sum, value) => sum + value, 0);

    // 5. Check room capacity
    let totalCapacity = 0;
    for (const roomType in roomTypes) {
      const capacity = roomType === 'single' ? 1 : roomType === 'double' ? 2 : 3;
      totalCapacity += capacity * roomTypes[roomType];
    }
    
    if (totalCapacity < guests) {
      return sendError(400, "Not enough room capacity for all guests");
    }

    // 6. Generate unique booking ID
    const bookingId = uuidv4();

    // 7. Calculate total cost
    let totalCost = 0;
    if (checkIn && checkOut) {
      // Calculate based on number of nights
      const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
      for (const roomType in roomTypes) {
        const price = roomType === 'single' ? 500 : roomType === 'double' ? 1000 : 1500;
        totalCost += price * roomTypes[roomType] * nights;
      }
    } else {
      // If no dates, calculate for 1 night
      for (const roomType in roomTypes) {
        const price = roomType === 'single' ? 500 : roomType === 'double' ? 1000 : 1500;
        totalCost += price * roomTypes[roomType];
      }
    }

    // 8. Create booking object
    const booking = {
      bookingId,
      guests,
      roomTypes,
      totalRooms,
      checkIn,
      checkOut,
      guestName,
      email,
      totalCost,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    // 9. Save to database
    await db.put({
      TableName: process.env.BOOKINGS_TABLE || "hotel-bookings-axile",
      Item: booking,
    }).promise();

    // 10. Send response
    return sendResponse({
      message: "Booking created successfully!",
      bookingId,
      guests,
      totalRooms,
      roomTypes,
      checkIn,
      checkOut,
      guestName,
      totalCost,
    });
    
  } catch (error) {
    console.error("Error creating booking:", error);
    return sendError(500, "An error occurred while processing the booking.");
  }
};