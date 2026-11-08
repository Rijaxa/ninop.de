function DonutChart(x, y, diameter) {

  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 30;

  this.get_radians = function(data) {
    var total = sum(data);
    var radians = [];

    for (let i = 0; i < data.length; i++) {
      radians.push((data[i] / total) * TWO_PI);
    }
    console.log("Data: " + data);
    console.log("Total: " + total);

    return radians;
  };

  this.draw = function(data, labels, colours, title) {
    console.log("###########Draw Start");
    // Test that data is not empty and that each input array is the
    // same length.
    if (data.length == 0) {
      alert('Data has length zero!');
    } else if (![labels, colours].every((array) => {
      return array.length == data.length;
    })) {
      alert(`Data (length: ${data.length})
Labels (length: ${labels.length})
Colours (length: ${colours.length})
Arrays must be the same length!`);
    }

    // https://p5js.org/examples/form-pie-chart.html

    var angles = this.get_radians(data);
    var lastAngle = 0;
    var colour;


    // Coded by Nino Purtseladze begin
    // Hover begin
    // Calculate the angle
    var localMouseX = mouseX - x;
    var localMouseY = mouseY - y;
    var a = atan2(localMouseX, localMouseY);
    var d = dist(localMouseX, localMouseY, 0, 0);

    var a2 = -a + Math.PI/2;
    var a3 = (a2 + 2*Math.PI) % (2*Math.PI);
    var slice = a3 / (2*Math.PI);
    var lastSlice = 0;
    var foundIndex = -1

    for (var i = 0; i < data.length; i++) {
      var angle = angles[i];
      var sliceSize = angle / (2*Math.PI);
      print("i: " + i);
      print("Slice size: " + sliceSize);
      print("Last Slice: " + lastSlice);
      print("Angle: " + angle);

      if (slice < (lastSlice + sliceSize)) {
         foundIndex = i;
         break;
      }
      else {
        lastSlice += sliceSize;
      }
    }

   
    for (var i = 0; i < data.length; i++) {

      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, data.length, 0, 255);
      }

      fill(colour);
      stroke(0);
      strokeWeight(1);

      var usedDiameter = this.diameter;

      if (foundIndex == i) {
          usedDiameter += 20;
      }
      arc(this.x, this.y,
          usedDiameter, usedDiameter,
          lastAngle, lastAngle + angles[i] + 0.001); // Hack for 0!

      if (labels) {
        this.makeLegendItem(labels[i], i, colour);
      }

      lastAngle += angles[i];
    }

    fill(255);
    noStroke();
    ellipse(x,y, this.diameter/2, this.diameter/2);


    if (foundIndex != -1) { 
      fill(0);
      textAlign(CENTER);
      text(labels[foundIndex],  width / 2, y-20);
      text(data[foundIndex],  width / 2, y+20);
    }

    // Hover end

    if (title) {
      noStroke();
      textAlign('center', 'center');
      textSize(24);
      text(title, this.x, this.y - this.diameter * 0.6);
    }
  };

  this.makeLegendItem = function(label, i, colour) {
    var x = this.x + 50 + this.diameter / 2;
    var y = this.y + (this.labelSpace * i) - this.diameter / 3;
    var boxWidth = this.labelSpace / 2;
    var boxHeight = this.labelSpace / 2;

    fill(colour);
    rect(x, y, boxWidth, boxHeight);

    fill('black');
    noStroke();
    textAlign('left', 'center');
    textSize(12);
    text(label, x + boxWidth + 10, y + boxWidth / 2);

    fill('black');
    noStroke();
    textAlign('left', 'center');
    textSize(12);
    text(label, x + boxWidth + 10, y + boxWidth / 2);
    textSize(18);
    text('You can drag & drop your own CSV-Data!', 300, 520);
  };
}
