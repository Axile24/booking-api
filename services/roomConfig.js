// Rumskonfiguration - definierar rumtyper, kapacitet och priser
const ROOM_TYPES = {
  single: {
    name: "Enkelrum",
    maxGuests: 1,
    pricePerNight: 500
  },
  double: {
    name: "Dubbelrum",
    maxGuests: 2,
    pricePerNight: 1000
  },
  suite: {
    name: "Svit",
    maxGuests: 3,
    pricePerNight: 1500
  }
};

// Beräkna total kostnad baserat på rumtyper
function calculateTotalCost(roomTypes) {
  let totalCost = 0;
  
  for (const [roomType, quantity] of Object.entries(roomTypes)) {
    if (ROOM_TYPES[roomType]) {
      totalCost += ROOM_TYPES[roomType].pricePerNight * quantity;
    }
  }
  
  return totalCost;
}

// Beräkna total kapacitet baserat på rumtyper
function calculateTotalCapacity(roomTypes) {
  let totalCapacity = 0;
  
  for (const [roomType, quantity] of Object.entries(roomTypes)) {
    if (ROOM_TYPES[roomType]) {
      totalCapacity += ROOM_TYPES[roomType].maxGuests * quantity;
    }
  }
  
  return totalCapacity;
}

// Validera att rumtyper är giltiga
function validateRoomTypes(roomTypes) {
  if (!roomTypes || typeof roomTypes !== 'object') {
    return { valid: false, message: "roomTypes måste vara ett objekt" };
  }
  
  for (const [roomType, quantity] of Object.entries(roomTypes)) {
    if (!ROOM_TYPES[roomType]) {
      return { 
        valid: false, 
        message: `Ogiltigt rumtyp: ${roomType}. Tillgängliga typer: ${Object.keys(ROOM_TYPES).join(', ')}` 
      };
    }
    
    if (typeof quantity !== 'number' || quantity < 0) {
      return { 
        valid: false, 
        message: `Antal rum måste vara ett positivt nummer för ${roomType}` 
      };
    }
  }
  
  return { valid: true };
}

// Validera att gäster passar i rummen
function validateGuestCapacity(guests, roomTypes) {
  const totalCapacity = calculateTotalCapacity(roomTypes);
  
  if (guests > totalCapacity) {
    return {
      valid: false,
      message: `För många gäster! ${guests} gäster men endast plats för ${totalCapacity} gäster i de valda rummen`
    };
  }
  
  return { valid: true };
}

module.exports = {
  ROOM_TYPES,
  calculateTotalCost,
  calculateTotalCapacity,
  validateRoomTypes,
  validateGuestCapacity
};

