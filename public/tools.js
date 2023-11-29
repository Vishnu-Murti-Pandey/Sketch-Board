let hamBtn = document.querySelector(".fa-solid");
let toolsCont = document.querySelector(".tools-cont");

let pencilToolCont = document.querySelector(".pencil-tool-cont");
let earserToolCont = document.querySelector(".earser-tool-cont");

let pencil = document.querySelector(".pencil");
let earser = document.querySelector(".earser");
let pencilFlag = false;
let earserFlag = false;

let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");

hamBtn.addEventListener("click", (e) => {
    if (hamBtn.getAttribute("class") === "fa-solid fa-bars") {
        opendTools();
    } else {
        closeTools();
    }
});

function opendTools() {
    hamBtn.setAttribute("class", "fa-solid fa-xmark");

    toolsCont.style.display = "flex";
}

function closeTools() {
    hamBtn.setAttribute("class", "fa-solid fa-bars");

    toolsCont.style.display = "none";
    pencilToolCont.style.display = "none";
    earserToolCont.style.display = "none";

    pencilFlag = !pencilFlag;
    earserFlag = !earserFlag;
}

pencil.addEventListener("click", (e) => {
    //true -> show pencil tool
    // false -> hide pencil tool
    pencilFlag = !pencilFlag;
    if (pencilFlag) {
        pencilToolCont.style.display = "block"
    }
    else {
        pencilToolCont.style.display = "none"
    }

});

earser.addEventListener("click", (e) => {
    //true -> show earser tool
    // false -> hide earser tool
    earserFlag = !earserFlag;

    if (earserFlag) {
        earserToolCont.style.display = "flex"
    }
    else {
        earserToolCont.style.display = "none"
    }

});

upload.addEventListener("click", (e) => {
    // Open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyCont = document.createElement("div");
        stickyCont.setAttribute("class", "sticky-cont");

        stickyCont.innerHTML = `
            <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
            </div>
            <div class="note-cont">
                <img src="${url}"></img>
            </div>
    `
        document.body.appendChild(stickyCont);

        let minimize = stickyCont.querySelector(".minimize");
        let remove = stickyCont.querySelector(".remove");
        noteActions(minimize, remove, stickyCont);

        stickyCont.onmousedown = function (event) {
            dragAndDrop(stickyCont, event)
        }
        stickyCont.ondragstart = function () {
            return false;
        }

    });

});

sticky.addEventListener("click", (e) => {
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");

    stickyCont.innerHTML = `
            <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
            </div>
            <div class="note-cont">
                <textarea spellcheck="false"></textarea>
            </div>
    `
    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    noteActions(minimize, remove, stickyCont);

    stickyCont.onmousedown = function (event) {
        dragAndDrop(stickyCont, event)
    }
    stickyCont.ondragstart = function () {
        return false;
    }

});

function noteActions(minimize, remove, stickyCont) {

    remove.addEventListener("click", (e) => {
        stickyCont.remove();
    });

    minimize.addEventListener("click", (e) => {
        let noteCont = stickyCont.querySelector(".note-cont");
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        if (display === "none") {
            noteCont.style.display = "block";
        }
        else {
            noteCont.style.display = "none";
        }
    });

}

function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the element at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the element on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the element, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };

}
