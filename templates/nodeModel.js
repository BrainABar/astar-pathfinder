// node
function Node(x, y, weight){
  this.x = x;
  this.y = y;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.weight = weight; // weight/cost of node
  this.parentNode = null;
  this.relatives = [];
  this.blocked = false;
  this.xyStr = x + ',' + y; // reference name 'x,y'

  this.drawRect = function (fillCol, strokeCol) {
      tempCol = strokeCol || fillCol; // if strokeCol is left unused, defaults to fill color
      stroke(tempCol);
      fill(fillCol);
      rect(this.x* boxwidth, this.y * boxheight, boxwidth, boxheight);
  };

  // returns the color of the object based on weight/cost
  this.nodeWeightColor = function () {
      if(this.blocked){
          return color(183,182,179); //grey color
      }
      else if (this.weight === 0) { // fast road color
          return color(0); // color black
      }
      else if (this.weight === 1) { // regular road
          return color(195,178, 111); // yellow/brown color
      }
      else if (this.weight === 2){ // dirt road
          return color(151,108,23) // brown color
      }
      else {
          return color(230);
      }
  };

  this.generateRelatives = function(grid, start){
      var x = this.x;
      var y = this.y;

      // grid goes from top left to bottom right
      if(x < gridsize-1) { // right
          this.relatives.push(grid[x + 1][y]);
      }
      if(x > gridsize -1  && y > 0){ //bottom-right
          this.relatives.push(grid[x + 1][y + 1]);
      }
      if(y < gridsize-1) { // down
          this.relatives.push(grid[x][y + 1]);
      }
      if(x > 0 && y < gridsize -1){ // bottom-left
          this.relatives.push(grid[x - 1][y + 1]);
      }
      if(x > 0){ // left
          this.relatives.push(grid[x - 1][y]);
      }
      if(x > 0 && y > 0){ // top-left
          this.relatives.push(grid[x - 1][y - 1]);
      }
      if(y > 0){ // up
          this.relatives.push(grid[x][y - 1]);
      }
      if(x < gridsize-1 && y < gridsize-1){ // top-right
          this.relatives.push(grid[x + 1][y + 1]);
      }
  };
}
