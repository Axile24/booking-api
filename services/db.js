// ========================================
// DATABASE SERVICE
// ========================================
// This file sets up the connection to AWS DynamoDB
// DynamoDB is Amazon's NoSQL database service

const AWS = require('aws-sdk');  // AWS SDK for JavaScript

// ========================================
// AWS CONFIGURATION
// ========================================
// Tell AWS which region to use (where our database is located)
AWS.config.update({ 
  region: process.env.AWS_REGION || 'eu-north-1'  // Use environment variable or default to eu-north-1
});

// ========================================
// DYNAMODB CLIENT
// ========================================
// Create a DynamoDB client that we can use to interact with the database
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Export the database client so other files can use it
module.exports = {
  db: dynamodb  // This is our database connection
};
