// functions to modify selection
var board = null; // will hold the grid, initialized in setup

function changeToStart(){
    currentSelection = "start";
}

function changeToEnd(){
    currentSelection = "end";
}

function changeToObstacle(){
    currentSelection = "obstacle";
}

function changeToLow(){
    currentSelection = "low";
}
function changeToMid(){
    currentSelection = "mid";
}
function changeToHigh(){
    currentSelection = "high";
}

function changeGridSize(){
    let userInput = prompt("Enter number of nodes to create in the canvas:\n Ex. '10' entered\n" +
        "will create 100(10*10) nodes");

    if (userInput){
        board.gridarray = null; // point old grid to no null;
        board.gridarray = [];
        board.size = userInput;
        board.creategrid();
        for(var x=0;x<board.size;x++){
            for(var y=0;y<board.size;y++){
                board.gridarray[x][y](new Node(x, y, 0));
            }
        }
        windowResized();
    }
}

// reset every node and variables besides board dimensions
function resetBoard(){
    blockedDict = {};
    opensetDict = {};
    opensetSize = 0;
    closedsetDict = {};
    openset = [];
    path = [];
    goal = null;
    start = null;
    end = null;
    currentSelection = null;
    generation = null;

    for(let x=0;x<board.size;x++){
        for(let y=0;y<board.size;y++){
            let tempNode = board.gridarray[x][y];
            tempNode.weight = 0; // reset weight
            tempNode.blocked = false; // reset blocked status
            tempNode.parentNode = null; // remove parents
            tempNode.relatives = []; // remove relatives
            tempNode.drawRect(tempNode.nodeWeightColor(), color(0), board.nodeWidth, board.nodeHeight); // draws color of blocked node, otherwise based on weight
        }
    }
    loop();
}

function generateDirt() {
    for(let x=0;x<board.size;x++){
        for(let y=0;y<board.size;y++){
            let tempNode = board.gridarray[x][y];
            tempNode.weight = 2;
            tempNode.drawRect(tempNode.nodeWeightColor(), color(0), board.nodeWidth, board.nodeHeight);
        }
    }
    generation = true;
}

function generateBlocked(){
    for(let x=0;x<board.size;x++){
        for(let y=0;y<board.size;y++){
            let tempNode = board.gridarray[x][y];
            if(random(1) < 0.05) {
                tempNode.blocked = true;
                tempNode.drawRect(tempNode.nodeWeightColor(), color(0), board.nodeWidth, board.nodeHeight);
            }
        }
    }
    generation = true;
}

// User button selection held as a string with command
var currentSelection = null;
var generation = null;

// declarations
var blockedDict = {}; // record of blocked node locations dict['x' + ',' + 'y'] = [x: int(x), y: int(y)];
var opensetDict = {}; // record of openset nodes locations
var opensetSize = 0; // record of amount of items in opensetDict
var closedsetDict = {}; // record of closedset nodes locations
var openset = [];
var goal = null; // whether end node was reached
var path = []; // path taken from start to end, array of nodes
var start = null; // user selected starting node
var end = null; // user selected ending node
var bounceColors = 0; // will bounce back and forth between frames
var colorDir = 1;
var canvasT; // holds the canvas and attached to an html div id

// removes wanted node from the list
function removeNode(removeNode, fromArray) {
    for(var i=fromArray.length;i>=0;i--){
        if(removeNode == fromArray[i]){
            fromArray.splice(i, 1);
        }
    }
}

// Disables scrolling on the canvas but still passes input so drawing can occur
function touchMoved(){

    if(0 <= mouseX && mouseX < board.width && 0 <= mouseY && mouseY < board.height) {
        mouseDragged();
        return false;
    }
}

function mouseDragged() {
    mousePressed();
}

function mousePressed(){

    var selectedx = 0; // user selected x position
    var selectedy = 0; // user selected y position


    if(0 <= mouseX && mouseX < board.width && 0 <= mouseY && mouseY < board.height) {
        selectedx = floor(mouseX / board.nodeHeight);
        selectedy = floor(mouseY / board.nodeWidth);

        var loneNode = board.gridarray[selectedx][selectedy];

        // selection of start/end/obstacle tiles
        switch (currentSelection) {
            case "start":
                if (start !== null) { //remove previous start node from set
                    start.drawRect(start.nodeWeightColor(), color(0), board.nodeWidth, board.nodeHeight);
                }
                start = loneNode;
                start.blocked = false;
                start.drawRect(color(37, 229, 82), start.nodeWeightColor(), board.nodeWidth, board.nodeHeight); // green color rect
                noLoop();
                break;

            case "end":
                if (end !== null) {
                    end.drawRect(end.nodeWeightColor(), color(0), board.nodeWidth, board.nodeHeight);
                }
                end = loneNode;
                end.blocked = false;
                end.drawRect(color(255, 18, 55), end.nodeWeightColor(),board.nodeWidth, board.nodeHeight); // red color rect
                break;

            case "obstacle":
                loneNode.blocked = true;
                loneNode.drawRect(loneNode.nodeWeightColor(), loneNode.nodeWeightColor(), board.nodeWidth, board.nodeHeight);
                blockedDict[loneNode.xyStr] = {x: loneNode.x, y: loneNode.y};
                break;

            case "low":
                loneNode.weight = 0;
                loneNode.blocked = false;
                loneNode.drawRect(loneNode.nodeWeightColor(), loneNode.nodeWeightColor(), board.nodeWidth, board.nodeHeight);
                break;

            case "mid":
                loneNode.weight = 1;
                loneNode.blocked = false;
                loneNode.drawRect(loneNode.nodeWeightColor(), loneNode.nodeWeightColor(), board.nodeWidth, board.nodeHeight);
                break;

            case "high":
                loneNode.weight = 2;
                loneNode.blocked = false;
                loneNode.drawRect(loneNode.nodeWeightColor(), loneNode.nodeWeightColor(), board.nodeWidth, board.nodeHeight);
                break;
        }
    }
}

function setup() {

    // calculate canvas dimensions
    let canvasID = document.getElementById('canvasid');

    // default 400x400 canvas with 20x20 grid
    // initialize the board and insert nodes
    board = new Grid(400, 400, 20);
    board.creategrid();

    // draw canvas and attach to div
    canvasT = createCanvas(board.width, board.height);
    canvasT.parent(canvasID);

    // insert nodes into grid
    for(let i=0;i<board.size;i++){
        for(let k=0;k<board.size;k++){
            let tempnode = new Node(i, k, 0);
            tempnode.drawRect(tempnode.nodeWeightColor(), color(0), board.nodeWidth, board.nodeHeight);
            board.insertnode(i, k, tempnode);
        }
    }
    frameRate(60);
}

function draw() {

    if(opensetSize === 0 && start !== null && end !== null) {
        opensetDict[start.xyStr] = {x: start.x, y: start.y};
        opensetSize += 1;
    }
    else if(goal === null && opensetSize !== 0 && start !== null && end !== null) {
        var currentNode = null;
        // find lowest f node within openset dictionary
        for(const nodeXY in opensetDict){ // key saved as 'x,y'
            var openX = opensetDict[nodeXY].x;
            var openY = opensetDict[nodeXY].y;

            if(currentNode == null){
                currentNode = board.gridarray[openX][openY];
            }
            if(board.gridarray[openX][openY].f < currentNode.f){
                currentNode = board.gridarray[openX][openY];
            }
        }

        currentNode.drawRect(color(floor(frameCount/3%255),floor(frameCount/2%255), floor(frameCount/4%255)), color(0), currentNode.nodeWidth, currentNode.nodeHeight);
        delete opensetDict[currentNode.xyStr]; // delete from openset record
        opensetSize -= 1;
        closedsetDict[currentNode.xyStr] = {x: currentNode.x, y: currentNode.y}; // add to closedset record

        // generate relatives
        currentNode.generateRelatives(board.gridarray, board.size);

        for(let i=0;i<currentNode.relatives.length;i++){
            let relative = currentNode.relatives[i];
            let validNode = true;

            // need to mark relatives blocked by diagols
            distEq = dist(currentNode.x, currentNode.y, relative.x, relative.y);
            if(distEq > 1.0){ // distance of corner relatives is sqrt(2)
                let diffx = currentNode.x - relative.x; // -/+ 1 which indicates direction of x from original x
                let diffy = currentNode.y - relative.y; // -/+ 1 which indicates direction of y from original y
                let checkX = relative.x + diffx; // should move x left/right one spot based on direction
                let checkY = relative.y + diffy; // should move y up/down one spot based on direction
                let checkNodeOne = null;
                let checkNodeTwo = null;


                if(0 <= checkX && checkX < board.size){
                    checkNodeOne = board.gridarray[checkX][relative.y];
                }
                if(0 <= checkY && checkY < board.size){
                    checkNodeTwo = board.gridarray[relative.x][checkY];
                }

                if(checkNodeOne !== null && checkNodeTwo !== null){
                    if(checkNodeOne.blocked && checkNodeTwo.blocked){
                        validNode = false;
                    }
                }
            }

            // generate g/h/f
            if(!closedsetDict[relative.xyStr] && !relative.blocked && validNode) {
                var tempG = currentNode.g + dist(currentNode.x, currentNode.y, relative.x, relative.y) + relative.weight;
                var newPath = false;

                if (opensetDict[relative.xyStr]) {                } else {

                    if (tempG < relative.g) {
                        relative.g = tempG;
                        newPath = true;
                    }
                    newPath = true;
                    relative.g = tempG;
                    relative.drawRect(color(54,176,189), color(0), board.nodeWidth, board.nodeHeight); // draw itself since part of open set
                    opensetDict[relative.xyStr] = {x: relative.x, y: relative.y};
                    opensetSize += 1;
                }
                if (newPath) {
                    relative.h = dist(relative.x, relative.y, end.x, end.y);
                    relative.f = relative.g + relative.h;
                    relative.parentNode = currentNode;
                    console.log(relative.f);
                }
            }
        }

        if (currentNode == end) {
            console.log("Goal");
            goal = end; // reached the end
            path = []; // record path taken
            var tempNode = currentNode;
            path.push(tempNode);
            while(tempNode.parentNode){
                tempNode = tempNode.parentNode;
                path.push(tempNode);
            }
        }
    }
    else if(goal === null && start ){
        console.log("Not found");
        noLoop();
    }
    else{
        noLoop();
    }
}

// needs to recalculate overall canvas so that it stays within window size
function windowResized() {
    // recalculate canvas size
    let canvasID = document.getElementById('canvasid');
    board.resize(canvasID.offsetWidth, windowHeight, board.size);

    // redraw canvas/grid
    resizeCanvas(board.width, board.height);
    for(var x=0;x<board.size;x++){
        for(var y=0;y<board.size;y++){
            var tempNode = board.gridarray[x][y];
            tempNode.drawRect(tempNode.nodeWeightColor(), color(0), board.nodeWidth, board.nodeHeight); // draws color of blocked node, otherwise based on weight
        }
    }
    noLoop();
}
