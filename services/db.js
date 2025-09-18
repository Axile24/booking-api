/**
 * Database Service
 * This file sets up the connection to AWS DynamoDB
 */

const AWS = require('aws-sdk');

// Configure AWS region
AWS.config.update({
  region: process.env.AWS_REGION || 'eu-north-1'
});

// Create DynamoDB client
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports = {
  get: (params) => dynamodb.get(params).promise(),
  scan: (params) => dynamodb.scan(params).promise(),
  put: (params) => dynamodb.put(params).promise(),
  query: (params) => dynamodb.query(params).promise(),
  update: (params) => dynamodb.update(params).promise(),
  delete: (params) => dynamodb.delete(params).promise(),
};
