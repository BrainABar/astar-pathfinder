// node function/object
function Node(x, y, weight){
  this.x = x; // x and y position marks position on grid
  this.y = y;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.nodeColor = color(0); //default color of black
  this.weight = weight; // weight/cost of node
  this.parentNode = null;
  this.relatives = [];
  this.blocked = false;
  this.xyStr = x + ',' + y; // reference name 'x,y'

  this.drawRect = function (fillColor, strokeColor, width, height) {
      strokeColor = strokeColor || fillColor; // fill color used stroke is null
      stroke(strokeColor);
      fill(fillColor);
      rect(this.x* width, this.y * height, width, height);
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

  this.generateRelatives = function(grid, length){
      let x = this.x;
      let y = this.y;

      // grid goes from top left to bottom right
      if(x < length-1) { // right
          this.relatives.push(grid[x + 1][y]);
      }
      if(x > length -1  && y > 0){ //bottom-right
          this.relatives.push(grid[x + 1][y + 1]);
      }
      if(y < length-1) { // down
          this.relatives.push(grid[x][y + 1]);
      }
      if(x > 0 && y < length-1){ // bottom-left
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
      if(x < length-1 && y < length-1){ // top-right
          this.relatives.push(grid[x + 1][y + 1]);
      }
  };
}
