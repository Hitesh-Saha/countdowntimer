const express = require("express");
const cors = require("cors");
const https = require("https");
var fs = require("fs");
var path=require("path")
var privateKey = fs.readFileSync("key.pem", "utf8");
var certificate = fs.readFileSync("cert.pem", "utf8");

var credentials = { key: privateKey, cert: certificate };

const app = express();
app.use(express.static(__dirname + "/dist"));
app.get("/com-window.html", (req, res)=>{
    res.sendFile(path.join(__dirname, "dist", "com-window.html"))
})
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(3000);
