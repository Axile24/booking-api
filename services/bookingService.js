
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

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { 
  validateRoomBooking, 
  validateDates, 
  calculateCostByNights, 
  validateBookingWithRoomTypes,
  convertRoomTypesToRooms,
  convertRoomsToRoomTypes,
  TOTAL_ROOMS 
} = require('./roomService');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.BOOKINGS_TABLE;

// Check room availability for the requested dates
async function checkRoomAvailability(checkIn, checkOut) {
  const checkInDate = new Date(checkIn).toISOString();
  const checkOutDate = new Date(checkOut).toISOString();

  // Scan existing bookings that overlap with the requested dates
  const result = await dynamodb.scan({
    TableName: TABLE_NAME,
    FilterExpression: "(checkIn <= :checkOut AND checkOut >= :checkIn)",
    ExpressionAttributeValues: {
      ":checkIn": checkInDate,
      ":checkOut": checkOutDate,
    },
  }).promise();

  let totalRoomsBooked = 0;
  result.Items.forEach((booking) => {
    // Handle both roomTypes object and rooms array formats
    if (booking.roomTypes) {
      const roomCount = Object.values(booking.roomTypes).reduce(
        (sum, value) => sum + value,
        0
      );
      totalRoomsBooked += roomCount;
    } else if (booking.rooms) {
      const roomCount = booking.rooms.reduce(
        (sum, room) => sum + (room.quantity || 1),
        0
      );
      totalRoomsBooked += roomCount;
    }
  });

  const totalAvailableRooms = TOTAL_ROOMS - totalRoomsBooked;
  return totalAvailableRooms;
}

// Create a new booking (supports both roomTypes and rooms formats)
async function createBooking(bookingData) {
  const {
    guestName,
    guestEmail,
    totalGuests,
    rooms,
    roomTypes,
    checkIn,
    checkOut,
    checkInDate,
    checkOutDate,
    specialRequests
  } = bookingData;
  
  // Validate required fields
  if (!guestName || !guestEmail || !totalGuests) {
    throw new Error('Missing required fields: guestName, guestEmail, totalGuests');
  }
  
  // Check if either rooms or roomTypes is provided
  if (!rooms && !roomTypes) {
    throw new Error('Either rooms or roomTypes must be provided');
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(guestEmail)) {
    throw new Error('Invalid email format');
  }
  
  // Use checkIn/checkOut if provided, otherwise use checkInDate/checkOutDate
  const finalCheckIn = checkIn || checkInDate;
  const finalCheckOut = checkOut || checkOutDate;
  
  // Validate dates if provided
  if (finalCheckIn && finalCheckOut) {
    if (!validateDates(finalCheckIn, finalCheckOut)) {
      throw new Error('Invalid check-in or check-out dates');
    }
    
    // Check room availability
    const availableRooms = await checkRoomAvailability(finalCheckIn, finalCheckOut);
    const requestedRooms = roomTypes ? 
      Object.values(roomTypes).reduce((sum, value) => sum + value, 0) :
      rooms.reduce((sum, room) => sum + (room.quantity || 1), 0);
    
    if (availableRooms < requestedRooms) {
      throw new Error(`Not enough rooms available. Available: ${availableRooms}, Requested: ${requestedRooms}`);
    }
  }
  
  // Handle roomTypes format (new format)
  if (roomTypes) {
    if (!validateBookingWithRoomTypes(totalGuests, roomTypes)) {
      throw new Error('Invalid number of guests or room types');
    }
    
    const totalCost = finalCheckIn && finalCheckOut ? 
      calculateCostByNights(roomTypes, finalCheckIn, finalCheckOut) :
      Object.entries(roomTypes).reduce((sum, [type, quantity]) => {
        const roomCost = type === 'single' ? 500 : type === 'double' ? 1000 : 1500;
        return sum + (roomCost * quantity);
      }, 0);
    
    const totalRooms = Object.values(roomTypes).reduce((sum, value) => sum + value, 0);
    
    const booking = {
      id: uuidv4(),
      bookingId: uuidv4(), // For compatibility
      guestName: guestName.trim(),
      guestEmail: guestEmail.toLowerCase().trim(),
      guests: parseInt(totalGuests),
      totalGuests: parseInt(totalGuests),
      roomTypes,
      totalRooms,
      checkIn: finalCheckIn,
      checkOut: finalCheckOut,
      checkInDate: finalCheckIn,
      checkOutDate: finalCheckOut,
      totalCost,
      totalPrice: totalCost,
      specialRequests: specialRequests || null,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await dynamodb.put({ TableName: TABLE_NAME, Item: booking }).promise();
    return booking;
  }
  
  // Handle rooms format (original format)
  if (rooms) {
    const roomValidation = validateRoomBooking(rooms, totalGuests);
    
    const booking = {
      id: uuidv4(),
      guestName: guestName.trim(),
      guestEmail: guestEmail.toLowerCase().trim(),
      totalGuests: parseInt(totalGuests),
      rooms,
      totalPrice: roomValidation.totalPrice,
      checkInDate: finalCheckIn || null,
      checkOutDate: finalCheckOut || null,
      specialRequests: specialRequests || null,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await dynamodb.put({ TableName: TABLE_NAME, Item: booking }).promise();
    return booking;
  }
}

// Get all bookings
async function getAllBookings() {
  const params = {
    TableName: TABLE_NAME
  };
  
  const result = await dynamodb.scan(params).promise();
  return result.Items || [];
}

// Get booking by ID
async function getBookingById(bookingId) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      bookingId: bookingId
    }
  };
  
  const result = await dynamodb.get(params).promise();
  return result.Item || null;
}

// Update booking
async function updateBooking(bookingId, updateData) {
  const {
    guestName,
    guestEmail,
    totalGuests,
    rooms,
    checkInDate,
    checkOutDate,
    specialRequests,
    status
  } = updateData;
  
  // Check if booking exists
  const existingBooking = await getBookingById(bookingId);
  if (!existingBooking) {
    throw new Error('Booking not found');
  }
  
  // Prepare update expression
  let updateExpression = 'SET updatedAt = :updatedAt';
  let expressionAttributeValues = {
    ':updatedAt': new Date().toISOString()
  };
  
  // Add fields to update if provided
  if (guestName) {
    updateExpression += ', guestName = :guestName';
    expressionAttributeValues[':guestName'] = guestName.trim();
  }
  
  if (guestEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      throw new Error('Invalid email format');
    }
    updateExpression += ', guestEmail = :guestEmail';
    expressionAttributeValues[':guestEmail'] = guestEmail.toLowerCase().trim();
  }
  
  if (totalGuests) {
    updateExpression += ', totalGuests = :totalGuests';
    expressionAttributeValues[':totalGuests'] = parseInt(totalGuests);
  }
  
  if (rooms && Array.isArray(rooms)) {
    // Validate room booking
    const roomValidation = validateRoomBooking(rooms, totalGuests || existingBooking.totalGuests);
    updateExpression += ', rooms = :rooms, totalPrice = :totalPrice';
    expressionAttributeValues[':rooms'] = rooms;
    expressionAttributeValues[':totalPrice'] = roomValidation.totalPrice;
  }
  
  if (checkInDate !== undefined) {
    updateExpression += ', checkInDate = :checkInDate';
    expressionAttributeValues[':checkInDate'] = checkInDate;
  }
  
  if (checkOutDate !== undefined) {
    updateExpression += ', checkOutDate = :checkOutDate';
    expressionAttributeValues[':checkOutDate'] = checkOutDate;
  }
  
  if (specialRequests !== undefined) {
    updateExpression += ', specialRequests = :specialRequests';
    expressionAttributeValues[':specialRequests'] = specialRequests;
  }
  
  if (status) {
    const validStatuses = ['confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    updateExpression += ', status = :status';
    expressionAttributeValues[':status'] = status;
  }
  
  // Update booking in DynamoDB
  const updateParams = {
    TableName: TABLE_NAME,
    Key: {
      bookingId: bookingId
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  };
  
  const result = await dynamodb.update(updateParams).promise();
  return result.Attributes;
}


module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
};
