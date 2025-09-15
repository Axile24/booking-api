// ========================================
// CREATE BOOKING HANDLER
// ========================================
// This file handles creating new hotel bookings
// It's a Lambda function that runs when someone makes a POST request to /bookings

// Import required libraries
const { v4: uuidv4 } = require("uuid");  // For generating unique booking IDs
const { sendResponse, sendError } = require("../../responses");  // For sending responses
const { db } = require("../../services/db");  // For database operations
const { 
  validateDates, 
  validateBookingWithRoomTypes, 
  calculateCostByNights,
  TOTAL_ROOMS 
} = require("../../services/roomService");  // For room validation and pricing

// Main function that handles booking creation
module.exports.handler = async (event) => {
  console.log("=== CREATING NEW BOOKING ===");
  
  // Step 1: Get the booking data from the request
  const body = JSON.parse(event.body);
  const { guests, roomTypes, checkIn, checkOut, guestName, email } = body;
  
  console.log("Booking data received:", { guests, roomTypes, checkIn, checkOut, guestName, email });

  try {
    // Step 2: Validate the dates (check-in can't be in the past, check-out must be after check-in)
    // Note: Dates are optional according to requirements
    console.log("Validating dates...");
    if (!validateDates(checkIn, checkOut)) {
      console.log("Date validation failed");
      return sendError(400, "Invalid check-in or check-out dates.");
    }
    console.log("Dates are valid");

    // Step 3: Count how many rooms the guest wants
    const totalRoomsRequested = Object.values(roomTypes).reduce(
      (sum, value) => sum + value,  // Add up all room quantities
      0
    );
    console.log(`Guest wants ${totalRoomsRequested} rooms`);

    // Step 4: Check if we have enough rooms available for these dates
    // Note: If no dates provided, we skip availability check (dates are optional)
    if (checkIn && checkOut) {
      console.log("Checking room availability...");
      const totalAvailableRooms = await checkRoomAvailability(checkIn, checkOut);
      console.log(`Available rooms: ${totalAvailableRooms}, Requested: ${totalRoomsRequested}`);
      
      if (totalAvailableRooms < totalRoomsRequested) {
        console.log("Not enough rooms available");
        return sendError(
          400,
          "Not enough rooms available for the selected dates."
        );
      }
      console.log("Rooms are available");
    } else {
      console.log("No dates provided - skipping room availability check");
    }

    // Step 5: Check if the number of guests matches the room capacity
    console.log("Validating guest capacity...");
    if (!validateBookingWithRoomTypes(guests, roomTypes)) {
      console.log("Guest capacity validation failed");
      return sendError(400, "Invalid number of guests or room types.");
    }
    console.log("Guest capacity is valid");

    // Step 6: Generate a unique booking ID
    const bookingId = uuidv4();
    console.log(`Generated booking ID: ${bookingId}`);

    // Step 7: Calculate the total cost based on room types and number of nights
    console.log("Calculating total cost...");
    let totalCost;
    if (checkIn && checkOut) {
      // Calculate cost based on number of nights
      totalCost = calculateCostByNights(roomTypes, checkIn, checkOut);
    } else {
      // If no dates provided, calculate cost for 1 night (as per requirements)
      totalCost = Object.entries(roomTypes).reduce((sum, [type, quantity]) => {
        const roomCost = type === 'single' ? 500 : type === 'double' ? 1000 : 1500;
        return sum + (roomCost * quantity);
      }, 0);
    }
    console.log(`Total cost: ${totalCost} SEK`);

    // Step 8: Create the booking object with all the information
    const booking = {
      bookingId,        // Unique ID for this booking
      guests,           // Number of guests
      roomTypes,        // What types of rooms (single, double, suite)
      totalRooms: totalRoomsRequested,  // Total number of rooms
      checkIn,          // Check-in date
      checkOut,         // Check-out date
      guestName,        // Guest's name
      email,            // Guest's email
      totalCost,        // Total price
    };

    // Step 9: Save the booking to the database
    console.log("Saving booking to database...");
    await db.put({
      TableName: "bookings",
      Item: booking,
    }).promise();
    console.log("Booking saved successfully");

    // Step 10: Send success response back to the user
    console.log("Sending success response...");
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
    // If anything goes wrong, log the error and send an error response
    console.error("Error creating booking:", error);
    return sendError(500, "Error processing the booking.");
  }
};

// Function to check room availability for the requested dates
async function checkRoomAvailability(checkIn, checkOut) {
  const checkInDate = new Date(checkIn).toISOString();
  const checkOutDate = new Date(checkOut).toISOString();

  // It is recommended to use query on larger tables - lower costs, faster performance, scalability, filter efficiency, etc.
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
