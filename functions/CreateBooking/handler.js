const { createBooking } = require('../../services/bookingService');
const { validationError, success, error } = require('../../responses');
const {
  validateBookingWithRoomTypes,
  calculateCostByNights
} = require('../../services/roomService'); // ✅ NYTT: Importerar den nya servicen

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    // Validering av obligatoriska fält
    if (!body.guests || !body.roomTypes || !body.guestName || !body.email || !body.checkInDate || !body.checkOutDate) {
      return validationError('Missing required fields: guests, roomTypes, guestName, email, checkInDate, checkOutDate');
    }

    // 1. Validera att antalet gäster ryms i rumskapaciteten
    const totalGuests = body.guests.length;
    const isValidCapacity = validateBookingWithRoomTypes(totalGuests, body.roomTypes);

    if (!isValidCapacity) {
      return validationError('The number of guests does not fit in the room capacity. Please adjust your room selection.');
    }

    // 2. Beräkna totalpris med den nya servicen
    const totalPrice = calculateCostByNights(body.roomTypes, body.checkInDate, body.checkOutDate);

    // 3. Skapa det slutliga bokningsdataobjektet
    const finalBookingData = {
      ...body,
      totalPrice: totalPrice,
    };

    const booking = await createBooking(finalBookingData);
    return success(booking);
  } catch (e) {
    return error(e.message);
  }
};
