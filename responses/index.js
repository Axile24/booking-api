// ========================================
// RESPONSE UTILITIES
// ========================================
// This file contains functions to send responses back to the user
// It handles both success and error responses

// ========================================
// SUCCESS RESPONSE
// ========================================
// When everything goes well, we send a success response

function sendResponse(data, statusCode = 200) {
  console.log("Sending success response:", data);
  
  return {
    statusCode,  // HTTP status code (200 = OK, 201 = Created, etc.)
    headers: {
      'Content-Type': 'application/json',  // Tell the browser this is JSON data
      'Access-Control-Allow-Origin': '*',  // Allow requests from any website (CORS)
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify({  // Convert the data to JSON string
      data: data  // Wrap the data in a "data" object
    })
  };
}

// ========================================
// ERROR RESPONSE
// ========================================
// When something goes wrong, we send an error response

function sendError(statusCode, message, error = null) {
  console.log("Sending error response:", { statusCode, message, error });
  
  return {
    statusCode,  // HTTP status code (400 = Bad Request, 500 = Server Error, etc.)
    headers: {
      'Content-Type': 'application/json',  // Tell the browser this is JSON data
      'Access-Control-Allow-Origin': '*',  // Allow requests from any website (CORS)
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify({  // Convert the error to JSON string
      error: message,  // The main error message
      ...(error && { details: error })  // Additional error details if provided
    })
  };
}

// Export the functions so other files can use them
module.exports = {
  sendResponse,  // Function to send success responses
  sendError      // Function to send error responses
};
