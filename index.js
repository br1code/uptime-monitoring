const http              = require("http"),
    url                 = require("url"),
    StringDecoder       = require("string_decoder").StringDecoder,
    config              = require("./config");


// The server should respond to all request with a string
var server = http.createServer((req, res) => {

    // Get the URL and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, "");

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the HTTP Method
    var method = req.method.toLowerCase();

    // Get the headers as an object
    var headers = req.headers;

    // Get the payload, if any
    var decoder = new StringDecoder("utf-8");
    var buffer = "";

    req.on("data", data => {
        buffer += decoder.write(data);
    });

    // Send the response when the stream has ended
    req.on("end", () => {
        buffer += decoder.end();

        // Choose the handler this request sould go
        var chosenHandler = typeof(router[trimmedPath]) !== "undefined" ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        var data = {
            "trimmedPath": trimmedPath,
            "queryStringObject": queryStringObject,
            "method": method,
            "payload": buffer
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {

            // Use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == "number" ? statusCode : 200;

            // Use the payload callec back by the handler, or default to an empty object
            payload = typeof(payload) == "object" ? payload : {};
           
            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader("Content-Type", "application/json");
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request path
            console.log("Returning this response: ", statusCode, payloadString);

        });
    });
});


// Start the server, and have it listen on port 3000
server.listen(config.port, () => {
    console.log(`The server is listening on port ${config.port} in ${config.envName} mode`);
});

// Define the handlers
const handlers = {};

// Sample handler
handlers.sample = (data, callback) => {
    // Callback a http status code, and a payload object
    callback(406, {"name" : "sample handler"});
};

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};

// Define a request router
const router = {
    "sample": handlers.sample
};