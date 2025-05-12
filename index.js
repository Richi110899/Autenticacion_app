require("dotenv").config();
const http = require("http");
const fs = require("fs");
const path = require("path");

function requestController(req, res) {
  const filePath = path.join(__dirname, "frontend", "index.html");
  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error interno del servidor");
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
}

const server = http.createServer(requestController);

const PORT = process.env.PORT || 3000;

server.listen(PORT, function () {
  console.log("Aplicación corriendo en: " + PORT);
});
