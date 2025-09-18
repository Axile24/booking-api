const { v4: uuid } = require('uuid');
const db = require('./db');

const createBooking = async (booking) => {
  try {
    const params = {
      TableName: process.env.BOOKINGS_TABLE,
      Item: {
        bookingId: uuid(),
        ...booking,
      },
    };
    await db.put(params);
    return params.Item;
  } catch (error) {
    console.error(error);
    throw new Error('Could not create booking');
  }
};

const getAllBookings = async () => {
  try {
    const params = {
      TableName: process.env.BOOKINGS_TABLE,
    };
    const result = await db.scan(params);
    return result.Items;
  } catch (error) {
    console.error(error);
    throw new Error('Could not get bookings');
  }
};

const getBookingById = async (bookingId) => {
  try {
    const params = {
      TableName: process.env.BOOKINGS_TABLE,
      Key: {
        bookingId: bookingId,
      },
    };
    const result = await db.get(params);
    return result.Item;
  } catch (error) {
    console.error(error);
    throw new Error('Could not get booking');
  }
};

const updateBooking = async (bookingId, booking) => {
  try {
    const params = {
      TableName: process.env.BOOKINGS_TABLE,
      Key: {
        bookingId: bookingId,
      },
      UpdateExpression: 'set roomId = :roomId, startDate = :startDate, endDate = :endDate',
      ExpressionAttributeValues: {
        ':roomId': booking.roomId,
        ':startDate': booking.startDate,
        ':endDate': booking.endDate,
      },
      ReturnValues: 'ALL_NEW',
    };
    const result = await db.update(params);
    return result.Attributes;
  } catch (error) {
    console.error(error);
    throw new Error('Could not update booking');
  }
};

const deleteBooking = async (bookingId) => {
  try {
    const params = {
      TableName: process.env.BOOKINGS_TABLE,
      Key: {
        bookingId: bookingId,
      },
    };
    await db.delete(params);
    return { message: 'Booking deleted successfully' };
  } catch (error) {
    console.error(error);
    throw new Error('Could not delete booking');
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};
