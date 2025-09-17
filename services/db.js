/**
 * Database Service
 * This file sets up the connection to AWS DynamoDB
 * Perfect for beginners to understand how database connections work
 */

const AWS = require('aws-sdk');

// Configure AWS region
AWS.config.update({
  region: process.env.AWS_REGION || 'eu-north-1'
});

// Create DynamoDB client
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Export the client so other files can use it
module.exports = {
  db: dynamodb
};
