// Funktion för att skicka framgångsrikt svar
function sendResponse(data, statusCode = 200) {
  return {
    statusCode,  // HTTP-statuskod (200 = OK, 201 = Skapad, etc.)
    headers: {
      'Content-Type': 'application/json',  // Berätta för webbläsaren att detta är JSON-data
      'Access-Control-Allow-Origin': '*',  // Tillåt förfrågningar från alla webbplatser (CORS)
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify({  // Konvertera data till JSON-sträng
      data: data  // Paketera data i ett "data"-objekt
    })
  };
}

// Funktion för att skicka felmeddelande
function sendError(statusCode, message, error = null) {
  return {
    statusCode,  // HTTP-statuskod (400 = Felaktig begäran, 500 = Serverfel, etc.)
    headers: {
      'Content-Type': 'application/json',  // Berätta för webbläsaren att detta är JSON-data
      'Access-Control-Allow-Origin': '*',  // Tillåt förfrågningar från alla webbplatser (CORS)
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify({  // Konvertera felmeddelande till JSON-sträng
      error: message,  // Huvudfelmeddelandet
      ...(error && { details: error })  // Ytterligare felinformation om tillgänglig
    })
  };
}

// Exportera funktioner så andra filer kan använda dem
module.exports = {
  sendResponse,  // Funktion för att skicka framgångsrika svar
  sendError      // Funktion för att skicka felmeddelanden
};
