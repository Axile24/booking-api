const { deleteBooking } = require('../../services/bookingService');
const { success, error } = require('../../responses');

module.exports.handler = async (event) => {
  try {
    const bookingId = event.pathParameters.bookingId;
    
    if (!bookingId) {
      return error('Booking ID is missing');
    }

    const result = await deleteBooking(bookingId);
    return success(result);

  } catch (e) {
    console.error(e);
    return error(e.message);
  }
};
