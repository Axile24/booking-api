// Definition av rumtyper med kapacitet och priser
const ROOM_TYPES = {
  single: {
    maxGuests: 1,      // Hur många personer som kan bo i detta rum
    price: 500,        // Pris per natt i svenska kronor (SEK)
    name: 'Single Room',
    description: 'Perfekt för ensamresenärer'
  },
  double: {
    maxGuests: 2,      // 2 personer kan bo här
    price: 1000,       // 1000 SEK per natt
    name: 'Double Room',
    description: 'Idealt för par'
  },
  suite: {
    maxGuests: 3,      // 3 personer kan bo här
    price: 1500,       // 1500 SEK per natt
    name: 'Suite',
    description: 'Lyxig boende för familjer'
  }
};

// Totalt antal rum på hotellet
const TOTAL_ROOMS = 20;

// Enkel mappning för rumskapacitet (hur många gäster varje rumtyp kan rymma)
const ROOM_TYPE_CAPACITY = {
  single: 1,      // Enkelrum = 1 gäst
  double: 2,      // Dubbelrum = 2 gäster
  suite: 3        // Svit = 3 gäster
};

// Enkel mappning för rumprissättning (kostnad per natt)
const ROOM_TYPE_COST = {
  single: 500,  // 500 SEK per natt
  double: 1000, // 1000 SEK per natt
  suite: 1500   // 1500 SEK per natt
};

// ========================================
// ROOM VALIDATION FUNCTIONS
// ========================================

// Check if a room booking is valid (for the old rooms array format)
function validateRoomBooking(rooms, totalGuests) {
  console.log("Validating room booking...");

  // Check if rooms array exists and is not empty
  if (!Array.isArray(rooms) || rooms.length === 0) {
    throw new Error('Rooms array is required and cannot be empty');
  }

  let totalCapacity = 0;  // Total number of guests the rooms can hold
  let totalPrice = 0;     // Total price for all rooms
  let roomCount = 0;      // Total number of rooms

  // Go through each room in the booking
  for (const room of rooms) {
    // Check if the room type exists (single, double, or suite)
    if (!ROOM_TYPES[room.type]) {
      throw new Error(`Invalid room type: ${room.type}. Available types: ${Object.keys(ROOM_TYPES).join(', ')}`);
    }

    // Get the quantity (how many of this room type)
    const quantity = room.quantity || 1;
    if (quantity < 1) {
      throw new Error('Room quantity must be at least 1');
    }

    // Add to totals
    totalCapacity += ROOM_TYPES[room.type].maxGuests * quantity;  // How many guests can fit
    totalPrice += ROOM_TYPES[room.type].price * quantity;         // Total cost
    roomCount += quantity;                                        // Total rooms
  }

  // Check if they're trying to book more rooms than we have
  if (roomCount > TOTAL_ROOMS) {
    throw new Error(`Cannot book more than ${TOTAL_ROOMS} rooms`);
  }

  // Check if the rooms can fit all the guests
  if (totalCapacity < totalGuests) {
    throw new Error(`Not enough room capacity. Total capacity: ${totalCapacity}, Guests: ${totalGuests}`);
  }

  console.log(`Room validation passed: ${roomCount} rooms, ${totalCapacity} guest capacity, ${totalPrice} SEK`);

  return {
    totalCapacity,
    totalPrice,
    roomCount,
    isValid: true
  };
}

// ========================================
// DATE VALIDATION
// ========================================

// Check if the check-in and check-out dates are valid
function validateDates(checkIn, checkOut) {
  console.log("Validating dates...");

  // If no dates provided, that's okay (dates are optional according to requirements)
  if (!checkIn || !checkOut) {
    console.log("No dates provided - this is allowed");
    return true;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Set to start of today

  const checkInDate = new Date(checkIn);
  checkInDate.setHours(0, 0, 0, 0);  // Set to start of day

  const checkOutDate = new Date(checkOut);
  checkOutDate.setHours(0, 0, 0, 0);  // Set to start of day

  // Rule 1: Check-in cannot be in the past (allow same day)
  if (checkInDate < today) {
    console.log("Check-in date is in the past");
    return false;
  }

  // Rule 2: Check-out must be after check-in
  if (checkOutDate <= checkInDate) {
    console.log("Check-out date must be after check-in date");
    return false;
  }

  console.log("Dates are valid");
  return true;
}

// ========================================
// COST CALCULATION
// ========================================

// Calculate how many nights the guest is staying
function calculateNights(checkIn, checkOut) {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // Calculate difference in milliseconds, then convert to days
  const numberOfNights = (checkOutDate - checkInDate) / (1000 * 3600 * 24);

  if (numberOfNights <= 0) {
    throw new Error("Invalid dates. Check-out date must be after check-in date.");
  }

  console.log(`Number of nights: ${numberOfNights}`);
  return numberOfNights;
}

// Calculate total cost based on room types and number of nights
function calculateCostByNights(roomTypes, checkIn, checkOut) {
  console.log("Calculating total cost...");

  const numberOfNights = calculateNights(checkIn, checkOut);
  let totalCost = 0;

  // Go through each room type in the booking
  for (const roomType in roomTypes) {
    if (ROOM_TYPE_COST[roomType]) {
      const roomPrice = ROOM_TYPE_COST[roomType];      // Price per night for this room type
      const roomQuantity = roomTypes[roomType];        // How many of this room type
      const roomTotal = roomPrice * roomQuantity * numberOfNights;  // Total for this room type

      totalCost += roomTotal;
      console.log(`${roomType}: ${roomQuantity} rooms × ${roomPrice} SEK × ${numberOfNights} nights = ${roomTotal} SEK`);
    }
  }

  console.log(`Total cost: ${totalCost} SEK`);
  return totalCost;
}

// ========================================
// ROOM CAPACITY VALIDATION
// ========================================

// Check if the number of guests matches the room capacity (for roomTypes format)
function validateBookingWithRoomTypes(guests, roomTypes) {
  console.log("Validating guest capacity...");

  let totalCapacity = 0;  // Total number of guests the rooms can hold

  // Go through each room type in the booking
  for (const roomType in roomTypes) {
    // Check if it's a valid room type
    if (ROOM_TYPE_CAPACITY[roomType] === undefined) {
      console.log(`Invalid room type: ${roomType}`);
      return false;
    }

    // Add to total capacity: room capacity × quantity
    const roomCapacity = ROOM_TYPE_CAPACITY[roomType];  // How many guests this room type holds
    const roomQuantity = roomTypes[roomType];          // How many of this room type
    totalCapacity += roomCapacity * roomQuantity;

    console.log(`${roomType}: ${roomQuantity} rooms × ${roomCapacity} guests = ${roomCapacity * roomQuantity} total capacity`);
  }

  // Check if we have enough capacity for all guests
  const isValid = totalCapacity >= guests;
  console.log(`Total capacity: ${totalCapacity}, Guests: ${guests}, Valid: ${isValid}`);

  return isValid;
}


module.exports = {
  validateRoomBooking,
  validateDates,
  calculateNights,
  calculateCostByNights,
  validateBookingWithRoomTypes,
  ROOM_TYPE_CAPACITY,
  ROOM_TYPE_COST,
  TOTAL_ROOMS
};
