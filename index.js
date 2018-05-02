const http              = require("http"),
    url                 = require("url"),
    StringDecoder       = require("string_decoder").StringDecoder;

const port = process.env.PORT || 3000;

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

        // Send the response
        res.end("Hello friend\n");

        // Log the request path
        console.log(`Requested received on path : ${trimmedPath}`);
        console.log(`Method used : ${method}`);
        console.log(`Query string`, queryStringObject);
        console.log("Headers", headers);
        console.log("Request received with this payload: ", buffer);
    });

});


// Start the server, and have it listen on port 3000
server.listen(port, () => {
    console.log(`The server is listening on port ${port}`);
});