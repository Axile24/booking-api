<<<<<<< HEAD
const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION || 'eu-north-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports = {
  db: dynamodb // Exportera klienten för att kunna återanvändas
=======
// ========================================
// DATABASE SERVICE
// ========================================
// This file sets up the connection to AWS DynamoDB
// DynamoDB is Amazon's NoSQL database service

// Importera AWS SDK för JavaScript
const AWS = require('aws-sdk');

// ========================================
// AWS KONFIGURATION
// ========================================
// Berätta för AWS vilken region som ska användas (var vår databas finns)
AWS.config.update({ 
  region: process.env.AWS_REGION || 'eu-north-1'  // Använd miljövariabel eller standard till eu-north-1
});

// ========================================
// DYNAMODB KLIENT
// ========================================
// Skapa en DynamoDB-klient som vi kan använda för att interagera med databasen
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Exportera databas-klienten så andra filer kan använda den
module.exports = {
  db: dynamodb  // Detta är vår databasanslutning
>>>>>>> 3bca9fc249bd724be58b61d76f8464d7f8ea7459
};
