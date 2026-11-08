function EulerVenn() {

  // Name for the visualisation to appear in the menu bar.
  //Coded by Nino Purtseladze - A part of it, such as the Value name changes - begin
  this.name = 'Euler Venn RGB';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'euler-venn';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  var hexInput;
  var r;
  var g;
  var b;

  this.setup = function() {
    // p5.js input field
    hexInput = createInput("#66ccff");
    hexInput.position(400, 100);
    hexInput.attribute('maxlength', '7'); 
    hexInput.size(200);
    hexInput.input(() => {
      this.hexToRGB();
    });
    this.hexToRGB();
  }

  this.draw = function() {

    fill('#000000');
    rect(0, 0, 1024, 576);

    blendMode(ADD);
    stroke('#ffffff');
    strokeWeight(1);
    fill(255, 0, 0);
    fill("#" + this.r + "0000");
    ellipse(500,200,200);
    fill("#" + "00" + this.g + "00");
    ellipse(450,300,200);
    fill("#" + "0000" + this.b);
    ellipse(550,300,200);
    blendMode(BLEND);

    fill('#ffffff');
    noStroke();
    textAlign(LEFT, LEFT);

    text('Tip: try #ff0000, #00ff00, #0000ff, #ffffff, #ffaa33…', 90, 80);

  }

  this.hexToRGB = function() {
    var hexColour = hexInput.value();
    console.log("hexColour " + hexColour);
    this.r = hexColour.slice(1,3);
    this.g = hexColour.slice(3,5);
    this.b = hexColour.slice(5,7);
    console.log("r " + this.r + " " + "g " + this.g + " " + "b " + this.b);
  }

  this.destroy = function() {
    hexInput.remove();
  }
}