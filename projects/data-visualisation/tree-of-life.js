//Data from https://en.amazingtalker.com/blog/en/other/77393/

function TreeOfLife() {

  // Name for the visualisation to appear in the menu bar.
  //Coded by Nino Purtseladze - A part of it, such as the Value name changes - begin
  this.name = 'Tree of Life - Germanic Languages';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'tree-of-life';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  this.setup = function() {
    // nothing needed here
  }

  // Rectangle dimensions
  var rectWidth = 160;
  var rectHeight = 70;
  var childY = 400; // default vertical position for children

  // Root node
  var root = {name: "Proto Germanic ⬇", x: 450, y: 80};

  // Categories (all start collapsed)
  var categories = [
    {
      name: "North Germanic ⬇",
      children: ["West Scandinavian", "East Scandinavian"],
      x: 450, y: 220,
      expanded: false
    },
    {
      name: "East Germanic ⬇",
      children: ["Gothic"],
      x: 650, y: 220,
      expanded: false
    },
    {
      name: "West Germanic ⬇",
      children: ["Anglo-Frisian", "Netherlandic German"],
      x: 250, y: 220,
      expanded: false
    }
  ];

  // Root clicked toggle
  var rootExpanded = false;

  this.draw = function() {
    push(); // isolate styles and transformations

    // Title and instructions
    textAlign(LEFT);
    textSize(20);
    noStroke();
    fill("#000000");
    text("Family Tree of Germanic Languages", 30, 80);
    textSize(14);
    fill("#555555");
    text("Tip: Click on the nodes to reveal", 30, 100);
    text("their subcategories", 30, 115);

    // Nodes
    textAlign(CENTER, CENTER);
    textSize(16);
    rectMode(CENTER);

    // Draw root node
    fill(0);
    rect(root.x, root.y, rectWidth, rectHeight, 10);
    fill(255);
    text(root.name, root.x, root.y);

    // Draw categories only if rootExpanded is true
    if (rootExpanded) {
      for (var cat of categories) {
        // Line root → category
        stroke(0);
        line(root.x, root.y + rectHeight/2, cat.x, cat.y - rectHeight/2);

        // Category node
        fill(0);
        rect(cat.x, cat.y, rectWidth, rectHeight, 10);
        noStroke();
        fill(255);
        text(cat.name, cat.x, cat.y);

        // Children
        if (cat.expanded) {
          var langs = cat.children;
          var spacingX = Math.max(220, rectWidth + 40);
          var totalWidth = (langs.length - 1) * spacingX;
          var lyAdjusted = (cat.name === "North Germanic ⬇") ? childY + 100 : childY;

          for (var j = 0; j < langs.length; j++) {
            var lx = cat.x - totalWidth/2 + j * spacingX;
            var ly = lyAdjusted;

            // Connect category → child
            stroke(0);
            line(cat.x, cat.y + rectHeight/2, lx, ly - rectHeight/2);

            // Child node
            fill(200);
            noStroke();
            rect(lx, ly, rectWidth, rectHeight, 10);
            fill(0);
            text(langs[j], lx, ly);
          }
        }
      }
    }

    pop(); // restore previous styles
  }

  this.mousePressed = function() {
    // Check if root clicked
    if (mouseX > root.x - rectWidth/2 && mouseX < root.x + rectWidth/2 &&
        mouseY > root.y - rectHeight/2 && mouseY < root.y + rectHeight/2) {
      rootExpanded = !rootExpanded; // toggle categories visibility
      pop();
      return;
    }

    // Check if a category was clicked (only if rootExpanded)
    if (rootExpanded) {
      for (var cat of categories) {
        if (mouseX > cat.x - rectWidth/2 && mouseX < cat.x + rectWidth/2 &&
            mouseY > cat.y - rectHeight/2 && mouseY < cat.y + rectHeight/2) {
          cat.expanded = !cat.expanded; // toggle children
        }
      }
    }
  }
}
