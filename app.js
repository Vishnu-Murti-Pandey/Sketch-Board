const express = require("express");  // Access
const socket = require("socket.io");

const app = express();   // Initalized and server ready

app.use(express.static("public"));   // to connect index.html to render page

let port = process.env.PORT || 5000;
let server = app.listen(port, () => {   // establish a port
    console.log("Listining to port " + port);
});

let io = socket(server); // Connection

io.on("connection", (socket) => {   // on()-> it is same as addEventListner -> when connecttion established it triggers
    console.log("Made socket connection");

    socket.on("beginPath", (data) => {  // recieve the data from FE
        // Transfer data to all connected computers
        io.sockets.emit("beginPath", data);
    });

    socket.on("drawStroke", (data) => {  // recieve the data from FE
        // Transfer data to all connected computers
        io.sockets.emit("drawStroke", data);
    });

    socket.on("redoUndo", (data) => {  // recieve the data from FE
        // Transfer data to all connected computers
        io.sockets.emit("redoUndo", data);
    });
});


