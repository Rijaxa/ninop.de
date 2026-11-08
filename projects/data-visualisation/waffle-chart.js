// Coded by Nino Purtseladze - begin

function WaffleChart(x, y, size) {

  this.x = x;
  this.y = y;
  this.size = size;
  this.labelSpace = 30; 
  this.tileSize = 14;
  this.tileSpacing = 2;

  /*
  Data format for the draw function
  JsonFormat: [{fieldName, value}] 
  example:
  [{fieldName: "fat", value: 23, colour: "#ffde21"}, ´
  {fieldName: "carbs", value: 63, colour: "#efebdc"},
  {fieldName: "Protein", value: 14, colour: "#77bbb4"}
  ] 
  */
  this.draw = function(data) {
    console.log("Waffle Chart: " + JSON.stringify(data));
    var chartData = data.waffleData;
    noStroke();
    fill("#000000");
    textAlign('center', 'center');
    textSize(16);
    text(data.name, this.x, this.y, 150);

    for(let w=0; w<10; w++) {
      for(let h=0; h<10; h++) {
        var position = w+10*h;
        fill(this.getColour(chartData,position));
        rect(this.x + (this.tileSize + this.tileSpacing)*w,this.y + (this.tileSize + this.tileSpacing)*h + 30,this.tileSize,this.tileSize);
      }
    }
  };

  this.getColour = function(data, position) {
    var currentIndex = 0;
    var positionLeft = position;
    while (currentIndex < data.length) {
      positionLeft -= data[currentIndex].value;
      if (positionLeft < 0) {
        return data[currentIndex].colour;
      }
      else {
        currentIndex += 1;
      }
    }
  }
}

// Coded by Nino Purtseladze - end
