// Importera nödvändiga bibliotek
const { v4: uuidv4 } = require("uuid"); // För att generera unika ID:n
const { sendResponse, sendError } = require("../../responses"); // För att skicka svar
const { db } = require("../../services/db"); // För databasoperationer


const { 
  validateDates, 
  validateBookingWithRoomTypes, 
  calculateCostByNights,

  TOTAL_ROOMS 
} = require("../../services/roomService"); // För rum-validering och prissättning

// Huvudfunktion som hanterar skapande av bokningar
module.exports.handler = async (event) => {
  // Hämta bokningsdata från förfrågan
  const body = JSON.parse(event.body);
  const { guests, roomTypes, checkIn, checkOut, guestName, email } = body;

  try {
    // Validera datum (inkommande kan inte vara i det förflutna)
    if (!validateDates(checkIn, checkOut)) {
      return sendError(400, "Invalid check-in or check-out dates.");
    }

    // Räkna totalt antal rum som gästen vill ha
    const totalRoomsRequested = Object.values(roomTypes).reduce(
      (sum, value) => sum + value,
      0
    );

    // Kontrollera rumstillgänglighet om datum angivna
    if (checkIn && checkOut) {
      const totalAvailableRooms = await checkRoomAvailability(checkIn, checkOut);
      
      if (totalAvailableRooms < totalRoomsRequested) {
        return sendError(
          400,
          "Not enough rooms available for the selected dates."
        );
      }
    }

    // Validera att antal gäster matchar rumskapacitet
    if (!validateBookingWithRoomTypes(guests, roomTypes)) {
      return sendError(400, "Invalid number of guests or room types.");
    }

    // Generera unikt boknings-ID
    const bookingId = uuidv4();

    // Beräkna total kostnad
    let totalCost;
    if (checkIn && checkOut) {
      // Beräkna baserat på antal nätter
      totalCost = calculateCostByNights(roomTypes, checkIn, checkOut);
    } else {
      // Om inga datum angivna, beräkna för 1 natt
      totalCost = Object.entries(roomTypes).reduce((sum, [type, quantity]) => {
        const roomCost = type === 'single' ? 500 : type === 'double' ? 1000 : 1500;
        return sum + (roomCost * quantity);
      }, 0);
    }

    // Skapa bokningsobjekt
    const booking = {
      bookingId,        // Unikt ID för bokningen
      guests,           // Antal gäster
      roomTypes,        // Rumtyper (single, double, suite)
      totalRooms: totalRoomsRequested,  // Totalt antal rum
      checkIn,          // Incheckningsdatum
      checkOut,         // Utcheckningsdatum
      guestName,        // Gästens namn
      email,            // Gästens e-post
      totalCost,        // Total kostnad
    };

    // Spara bokningen i databasen
    await db.put({
      TableName: "bookings",
      Item: booking,
    }).promise();

    // Skicka framgångsrikt svar
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
    // Logga fel och skicka felmeddelande
    console.error("Error creating booking:", error);
    return sendError(500, "Error processing the booking.");
  }
};

// Funktion för att kontrollera rumstillgänglighet för angivna datum
async function checkRoomAvailability(checkIn, checkOut) {
  // Konvertera datum till ISO-format
  const checkInDate = new Date(checkIn).toISOString();
  const checkOutDate = new Date(checkOut).toISOString();

  // Sök i databasen efter befintliga bokningar som överlappar med angivna datum
  const result = await db.scan({
    TableName: "bookings",
    FilterExpression: "(checkIn <= :checkOut AND checkOut >= :checkIn)",
    ExpressionAttributeValues: {
      ":checkIn": checkInDate,
      ":checkOut": checkOutDate,
    },
  }).promise();

  // Räkna totalt antal bokade rum
  let totalRoomsBooked = 0;
  result.Items.forEach((booking) => {
    const roomCount = Object.values(booking.roomTypes).reduce(
      (sum, value) => sum + value,
      0
    );
    totalRoomsBooked += roomCount;
  });

  // Beräkna tillgängliga rum (totalt antal rum minus bokade rum)
  const totalAvailableRooms = TOTAL_ROOMS - totalRoomsBooked;
  return totalAvailableRooms;
}