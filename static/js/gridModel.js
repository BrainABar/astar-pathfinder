function Grid(width, height, amount){
    this.width = width;
    this.height = height;
    this.size = amount; // number of nodes per column and per row(x^2 nodes on the grid/square)
    this.nodeWidth = width/this.size; // how many pixels wide a node can be
    this.nodeHeight = height/this.size; // how many pixels high a node can be
}
