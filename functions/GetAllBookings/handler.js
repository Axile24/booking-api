const { getAllBookings } = require('../../services/bookingService');
const { success, error } = require('../../responses');

module.exports.handler = async (event) => {
  try {
    const bookings = await getAllBookings();
    return success({
      message: 'Bookings retrieved successfully',
      count: bookings.length,
      bookings: bookings,
    });
  } catch (e) {
    console.error(e);
    return error(e.message);
  }
};
