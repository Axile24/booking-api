const { getBookingById } = require('../../services/bookingService');
const { success, error } = require('../../responses');

module.exports.handler = async (event) => {
  try {
    const bookingId = event.pathParameters.bookingId;
    
    if (!bookingId) {
      return error('Booking ID is missing');
    }

    const booking = await getBookingById(bookingId);

    if (!booking) {
      return success({ message: 'Booking not found' });
    }

    return success(booking);

  } catch (e) {
    console.error(e);
    return error(e.message);
  }
};