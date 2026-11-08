
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;

function setup() {
  // Create a canvas to fill the content div from index.html.
  canvasContainer = select('#app');
  var stage = createDiv('');
  stage.id('stage');
  stage.parent('app');
  var c = createCanvas(1024, 576);
  c.parent('stage');

  //Drag & Drop function

  // global listeners
  document.body.addEventListener("dragover", e => {
    e.preventDefault(); // stop browser’s default file-open
  });

  document.body.addEventListener("drop", e => {
    e.preventDefault();
    gallery.selectedVisual.dragAndDrop(e);
  });

  // Create a new gallery object.
  gallery = new Gallery();

  // Add the visualisation objects here.
  gallery.addVisual(new TechDiversityRace());
  gallery.addVisual(new TechDiversityGender());
  gallery.addVisual(new PayGapByJob2017());
  gallery.addVisual(new PayGapTimeSeries());
  gallery.addVisual(new ClimateChange());
  //Coded by Nino Purtseladze - begin
  gallery.addVisual(new UnemploymentByYear());
  gallery.addVisual(new Nutrition());
  gallery.addVisual(new NutritionDonut());
  gallery.addVisual(new WaffleChartComparingWaffles());
  gallery.addVisual(new UKMap());
  gallery.addVisual(new EulerVenn());
  gallery.addVisual(new TreeOfLife());

  //Coded by Nino Purtseladze - end

  // Demo wrapper: open with the UK map selected so the page never starts empty.
  var startId = 'uk-map';
  var startItem = select('#' + startId);
  if (startItem) startItem.addClass('selected');
  gallery.selectVisual(startId);
}

function draw() {
  background(255);
  noFill();
  stroke("#000000");
  rect(0,0,1023,575);
  if (gallery.selectedVisual != null) {
    gallery.selectedVisual.draw();
  }
}

function mousePressed() {
  if (gallery.selectedVisual != null && typeof gallery.selectedVisual.mousePressed === "function") {
    gallery.selectedVisual.mousePressed();
  }
}