function Grid(width, height, amount){
    this.width = width;
    this.height = height;
    this.size = amount; // number of nodes per column and per row(x^2 nodes on the grid/square)
    this.nodeWidth = width/this.size; // how many pixels wide a node can be
    this.nodeHeight = height/this.size; // how many pixels high a node can be
    this.gridarray = []; // grid holds its own array objects

    this.creategrid = function () { // create an grid 2d array that holds a null value
        for(let i=0;i<this.size;i++){
            this.gridarray.push([]);
        }
        for(let i=0;i<this.size;i++){
            for(let k=0;k<this.size;k++){
                this.gridarray[i].push(null);
            }
        }
    };

    this.insertnode = function (x, y, nodeObject) { // assign a node object to a position on the grid
        this.gridarray[x][y] = nodeObject;
    };

    this.resize = function(width, height, amount){ // adjusts the width and height and recalculates the nodes
        this.width = width;
        this.height = height;
        this.size = amount;
        this.nodeWidth = width/this.size;
        this.nodeHeight = height/this.size;
    }
}
