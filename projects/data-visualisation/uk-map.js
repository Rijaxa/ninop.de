//Coded by Nino Purtseladze - begin
function UKMap() {
  
  // Name for the visualisation to appear in the menu bar.
  this.name = 'UK Population';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'uk-map';

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {

  };

  this.setup = function() {

  };

  // Create a new donut chart object.

  this.draw = function() {
    var regions = new UKRegions(100,100,100);
    regions.draw();

    if (this.name) {
      noStroke();
      fill("#000000");
      textAlign(LEFT);
      textSize(24);
      text(this.name, 50, 50, width * 0.4);
      textSize(16);
      fill("#555555");
      text("Tip: Hover over regions and list items", 50, 80, width * 0.5);
    }
  };
}
//Coded by Nino Purtseladze - end