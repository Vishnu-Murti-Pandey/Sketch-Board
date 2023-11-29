let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let earserWidthElem = document.querySelector(".earser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penColor = "red";
let earserColor = "white";
let penWidth = pencilWidthElem.value;
let earserWidth = earserWidthElem.value;

let undoRedoTracker = [];     // Data
let track = 0;                // Represent which action from tracker array 

let mouseDown = false;

// API
let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

// mousedown -> start new path, mousemove -> path fill (graphics)
canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    // beginPath({ x: e.clientX, y: e.clientY });

    let data = {
        x: e.clientX, y: e.clientY
    }
    socket.emit("beginPath", data);  // to send data to server(BE)
});

canvas.addEventListener("mousemove", (e) => {
    if (mouseDown) {
        // drawStroke({
        //     x: e.clientX, y: e.clientY,
        //     color: earserFlag ? earserColor : penColor,
        //     width: earserFlag ? earserWidth : penWidth
        // });

        let data = {
            x: e.clientX, y: e.clientY,
            color: earserFlag ? earserColor : penColor,
            width: earserFlag ? earserWidth : penWidth
        }
        socket.emit("drawStroke", data);
    }
});

canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
});

undo.addEventListener("click", (e) => {
    if (track > 0) {
        track--;
    }
    //action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo", data);
    // undoRedoCanvas(trackObj);
});

redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length - 1) {
        track++;
    }
    //action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo", data);
    // undoRedoCanvas(trackObj);
});

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image();  // New image reference element;
    img.src = url;

    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    });
});

pencilWidthElem.addEventListener("change", (e) => {
    let width = pencilWidthElem.value;
    penWidth = width;
    tool.lineWidth = penWidth;
});

earserWidthElem.addEventListener("change", (e) => {
    let width = earserWidthElem.value;
    earserWidth = width;
    tool.lineWidth = earserWidth;
});

earser.addEventListener("click", (e) => {
    if (earserFlag) {
        tool.strokeStyle = earserColor;
        tool.lineWidth = earserWidth;
    }
    else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
});

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg"
    a.click();
});

// Listen the transfred data from server(BE) in FE & show the data
socket.on("beginPath", (data) => {
    beginPath(data);
});

socket.on("drawStroke", (data) => {
    drawStroke(data);
});

socket.on("redoUndo", (data) => {
    undoRedoCanvas(data);
});