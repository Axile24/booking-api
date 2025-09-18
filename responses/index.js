/**
 * Response Helper Functions
 * These functions help format API responses consistently
 */

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

/**
 * Sends a successful response (HTTP 200)
 */
function success(data) {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(data),
  };
}

/**
 * Sends a validation error response (HTTP 400)
 */
function validationError(message) {
  return {
    statusCode: 400,
    headers,
    body: JSON.stringify({ message: message }),
  };
}

/**
 * Sends a server error response (HTTP 500)
 */
function error(message) {
  return {
    statusCode: 500,
    headers,
    body: JSON.stringify({ message: message }),
  };
}

module.exports = {
  success,
  validationError,
  error,
};
