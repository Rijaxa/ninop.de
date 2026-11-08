function Nutrition() {

  // Name for the visualisation to appear in the menu bar.
//Coded by Nino Purtseladze - A part of it, such as the Value name changes - begin
  this.name = 'Nutrition Pie';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'nutrition';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/nutrition/nutrition.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };

  this.setup = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    this.dropDown();
  };

  this.dropDown = function() {
    // Create a select DOM element.
    if (this.select) {
      this.select.remove();
    }
    this.select = createSelect();
    this.select.position(350, 65);

    // Fill the options with all company names.
    var food = this.data.columns;
    // First entry is empty.
    for (let i = 1; i < food.length; i++) {
      this.select.option(food[i]);
    }
  }

  this.destroy = function() {
    this.select.remove();
  };
  
  this.dragAndDrop = async function(dropEvent) {
    console.log("Data received" + dropEvent);
    console.log("Files received" + dropEvent.dataTransfer.files.length);

    var dragAndDropFile = dropEvent.dataTransfer.files[0];
    console.log("Data received" + dragAndDropFile);
    console.log("Drag and Drop File Name" + dragAndDropFile.name);
    console.log("Drag and Drop File Size" + dragAndDropFile.length);
    console.log("Drag and Drop File Type" + dragAndDropFile.type);

    const csvText = await dragAndDropFile.text();

      var blob = new Blob([csvText], {type: 'text/csv'});
      console.log("csvText" + csvText);
      var url = URL.createObjectURL(blob);
      console.log("Outside function" + this);
      var nutrition = this;
      loadTable(
      url, 'csv', 'header',
      function(table) {
        console.log("Inside function" + this);
        nutrition.data = table;
        self.loaded = true;
        nutrition.dropDown();
      });

  };
  
  // Create a new pie chart object.
  this.pie = new PieChart(width / 2, height / 2, width * 0.4);

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Get the value of the company we're interested in from the
    // select item.
    var nutrition = this.select.value();

    // Get the column of raw data for companyName.
    var col = this.data.getColumn(nutrition);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);

    // Colour to use for each category.
    var colours = ['blue', 'red', 'green', 'purple', 'yellow'];

    // Make a title.
    var title = nutrition;

    // Draw the pie chart!
    this.pie.draw(col, labels, colours, title);
  };
}
//Coded by Nino Purtseladze - A part of it, such as the Value name changes - end
