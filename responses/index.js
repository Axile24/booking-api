/**
 * Response Helper Functions
 * These functions help format API responses consistently
 * Perfect for beginners to understand how API responses work
 */

// Function to send successful responses
function sendResponse(data, statusCode = 200) {
  return {
    statusCode,  // HTTP status code (200 = OK, 201 = Created, etc.)
    headers: {
      'Content-Type': 'application/json',  // Tell the browser this is JSON data
      'Access-Control-Allow-Origin': '*',  // Allow requests from any website (CORS)
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify({  // Convert data to JSON string
      data: data  // Wrap data in a "data" object
    })
  };
}

// Function to send error responses
function sendError(statusCode, message, error = null) {
  return {
    statusCode,  // HTTP status code (400 = Bad Request, 500 = Server Error, etc.)
    headers: {
      'Content-Type': 'application/json',  // Tell the browser this is JSON data
      'Access-Control-Allow-Origin': '*',  // Allow requests from any website (CORS)
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify({  // Convert error message to JSON string
      error: message,  // Main error message
      ...(error && { details: error })  // Additional error information if available
    })
  };
}

// Export functions so other files can use them
module.exports = {
  sendResponse,  // Function to send successful responses
  sendError      // Function to send error messages
};
