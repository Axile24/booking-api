const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION || 'eu-north-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports = {
  db: dynamodb // Exportera klienten för att kunna återanvändas
};
