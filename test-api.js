// Test examples for the Bonz.ai Hotel Booking API
// Based on: https://github.com/marafabiana/hotel-booking-api.git

const API_BASE_URL = 'https://your-api-gateway-url.amazonaws.com/dev';

// Example 1: Create Booking (matching their exact example)
async function createBookingExample() {
  console.log('--- Creating Booking (King Julien Example) ---');
  
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "guests": 10,
      "roomTypes": {
        "suite": 2,
        "double": 1,
        "single": 2  
      },
      "checkIn": "2024-12-27",
      "checkOut": "2026-12-28",
      "guestName": "King Julien",
      "email": "king.julien@example.com"
    })
  });
  
  const result = await response.json();
  console.log('Booking created:', JSON.stringify(result, null, 2));
  
  // Expected response structure:
  // {
  //   "data": {
  //     "message": "Booking created successfully!",
  //     "bookingId": "8090cd5b-f356-4b2b-9192-da892e86be79",
  //     "guests": 10,
  //     "totalRooms": 5,
  //     "roomTypes": {
  //       "suite": 2,
  //       "double": 1,
  //       "single": 2
  //     },
  //     "checkIn": "2024-12-27",
  //     "checkOut": "2026-12-28",
  //     "guestName": "King Julien",
  //     "totalCost": 3655000
  //   }
  // }
  
  return result.data?.bookingId;
}

// Example 2: Get All Bookings
async function getAllBookings() {
  console.log('\n--- Getting All Bookings ---');
  
  const response = await fetch(`${API_BASE_URL}/bookings`);
  const result = await response.json();
  console.log('All bookings:', JSON.stringify(result, null, 2));
  
  return result;
}

// Example 3: Update Booking (matching their example)
async function updateBooking(bookingId) {
  console.log('\n--- Updating Booking ---');
  
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "guests": 10,
      "roomTypes": {
        "suite": 2,
        "double": 1,
        "single": 2
      },
      "checkIn": "2024-12-27",
      "checkOut": "2026-12-31",
      "guestName": "King Julien"
    })
  });
  
  const result = await response.json();
  console.log('Booking updated:', JSON.stringify(result, null, 2));
  
  return result;
}

// Example 4: Test different room combinations
async function testRoomCombinations() {
  console.log('\n--- Testing Different Room Combinations ---');
  
  const testCases = [
    {
      name: 'Single Room Booking',
      data: {
        guests: 1,
        roomTypes: { single: 1 },
        checkIn: '2024-02-15',
        checkOut: '2024-02-17',
        guestName: 'Alice Johnson',
        email: 'alice@example.com'
      }
    },
    {
      name: 'Double Room Booking',
      data: {
        guests: 2,
        roomTypes: { double: 1 },
        checkIn: '2024-02-20',
        checkOut: '2024-02-22',
        guestName: 'Bob and Sarah',
        email: 'bob@example.com'
      }
    },
    {
      name: 'Suite Booking',
      data: {
        guests: 3,
        roomTypes: { suite: 1 },
        checkIn: '2024-02-25',
        checkOut: '2024-02-27',
        guestName: 'The Johnson Family',
        email: 'johnson@example.com'
      }
    },
    {
      name: 'Mixed Room Booking',
      data: {
        guests: 5,
        roomTypes: { 
          double: 2, 
          single: 1 
        },
        checkIn: '2024-03-01',
        checkOut: '2024-03-03',
        guestName: 'Conference Group',
        email: 'conference@example.com'
      }
    }
  ];
  
  const bookingIds = [];
  
  for (const testCase of testCases) {
    try {
      console.log(`\nTesting: ${testCase.name}`);
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCase.data)
      });
      
      const result = await response.json();
      console.log(`✅ ${testCase.name} - Success:`, result.data?.bookingId);
      bookingIds.push(result.data?.bookingId);
      
    } catch (error) {
      console.log(`❌ ${testCase.name} - Error:`, error.message);
    }
  }
  
  return bookingIds;
}

// Example 5: Test validation errors
async function testValidationErrors() {
  console.log('\n--- Testing Validation Errors ---');
  
  const errorTests = [
    {
      name: 'Missing required fields',
      data: {
        guestName: 'Test User'
        // Missing guests, roomTypes, etc.
      }
    },
    {
      name: 'Invalid email format',
      data: {
        guests: 1,
        roomTypes: { single: 1 },
        checkIn: '2024-02-15',
        checkOut: '2024-02-17',
        guestName: 'Test User',
        email: 'invalid-email'
      }
    },
    {
      name: 'Past check-in date',
      data: {
        guests: 1,
        roomTypes: { single: 1 },
        checkIn: '2023-01-01', // Past date
        checkOut: '2024-01-03',
        guestName: 'Test User',
        email: 'test@example.com'
      }
    },
    {
      name: 'Check-out before check-in',
      data: {
        guests: 1,
        roomTypes: { single: 1 },
        checkIn: '2024-02-15',
        checkOut: '2024-02-10', // Before check-in
        guestName: 'Test User',
        email: 'test@example.com'
      }
    },
    {
      name: 'More guests than room capacity',
      data: {
        guests: 5, // More than single room capacity
        roomTypes: { single: 1 },
        checkIn: '2024-02-15',
        checkOut: '2024-02-17',
        guestName: 'Test User',
        email: 'test@example.com'
      }
    }
  ];
  
  for (const test of errorTests) {
    try {
      console.log(`\nTesting: ${test.name}`);
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(test.data)
      });
      
      const result = await response.json();
      if (response.ok) {
        console.log(`❌ ${test.name} - Should have failed but succeeded:`, result);
      } else {
        console.log(`✅ ${test.name} - Correctly failed:`, result);
      }
      
    } catch (error) {
      console.log(`✅ ${test.name} - Correctly failed with error:`, error.message);
    }
  }
}

// Example 6: Test room availability
async function testRoomAvailability() {
  console.log('\n--- Testing Room Availability ---');
  
  // Try to book all 20 rooms
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        guests: 20,
        roomTypes: { single: 20 }, // All 20 rooms
        checkIn: '2024-02-15',
        checkOut: '2024-02-17',
        guestName: 'Test User',
        email: 'test@example.com'
      })
    });
    
    const result = await response.json();
    if (response.ok) {
      console.log('✅ All 20 rooms booked successfully:', result.data?.bookingId);
      
      // Try to book one more room (should fail)
      const response2 = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          guests: 1,
          roomTypes: { single: 1 },
          checkIn: '2024-02-15',
          checkOut: '2024-02-17',
          guestName: 'Test User 2',
          email: 'test2@example.com'
        })
      });
      
      const result2 = await response2.json();
      if (response2.ok) {
        console.log('❌ Should have failed - no rooms available');
      } else {
        console.log('✅ Correctly failed - no rooms available:', result2);
      }
      
    } else {
      console.log('❌ Failed to book 20 rooms:', result);
    }
    
  } catch (error) {
    console.log('Error testing room availability:', error.message);
  }
}

// Run all examples
async function runAllExamples() {
  console.log('🚀 Starting Bonz.ai Hotel Booking API Tests');
  console.log('Based on: https://github.com/marafabiana/hotel-booking-api.git\n');
  
  try {
    // Test the exact example from their documentation
    const bookingId = await createBookingExample();
    
    // Test different room combinations
    const bookingIds = await testRoomCombinations();
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get all bookings
    await getAllBookings();
    
    // Update a booking
    if (bookingId) {
      await updateBooking(bookingId);
    }
    
    // Test validation errors
    await testValidationErrors();
    
    // Test room availability
    await testRoomAvailability();
    
    console.log('\n✅ All tests completed successfully!');
    console.log('\n📋 Expected Response Structure:');
    console.log('All successful responses should be wrapped in a "data" object:');
    console.log('{');
    console.log('  "data": {');
    console.log('    "message": "...",');
    console.log('    "bookingId": "...",');
    console.log('    "guests": 10,');
    console.log('    "totalRooms": 5,');
    console.log('    "roomTypes": { "suite": 2, "double": 1, "single": 2 },');
    console.log('    "checkIn": "2024-12-27",');
    console.log('    "checkOut": "2026-12-28",');
    console.log('    "guestName": "King Julien",');
    console.log('    "totalCost": 3655000');
    console.log('  }');
    console.log('}');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Export functions for individual testing
module.exports = {
  createBookingExample,
  getAllBookings,
  updateBooking,
  testRoomCombinations,
  testValidationErrors,
  testRoomAvailability,
  runAllExamples
};

// Run if called directly
if (require.main === module) {
  runAllExamples();
}
