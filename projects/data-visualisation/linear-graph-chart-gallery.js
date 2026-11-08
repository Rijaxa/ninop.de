function LineGraphChartGallery(name, id, title, dataSource, columnName) {
//Coded by Nino Purtseladze - begin
  // Name for the visualisation to appear in the menu bar.
  this.name = name;

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = id;

  // Title to display above the plot.
  this.title = title;
  
  // To load the data source
  this.dataSource = dataSource;

  // To load the name of the column
  this.columnName = columnName;

  //Coded by Nino Purtseladze - end

    // Names for each axis.
  this.xAxisLabel = 'year';
  this.yAxisLabel = '%';

  var marginSize = 35;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,

    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function() {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      dataSource, 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });

  };

  this.setup = function() {
    // Font defaults.
    textSize(16);
    
    this.startYear = this.data.getNum(0, 'year');
    this.endYear = this.data.getNum(this.data.getRowCount() - 1, 'year');
    this.minValue = 0;      
    this.maxValue = max(this.data.getColumn(this.columnName));
  };

  this.destroy = function() {
  };

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Draw the title above the plot.
    this.drawTitle();

    // Draw all y-axis labels.
    drawYAxisTickLabels(this.minValue,
                        this.maxValue,
                        this.layout,
                        this.mapValueToHeight.bind(this),
                        0);
//Coded by Nino Purtseladze - A part of it, such as the Value name changes - begin
    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel,
                   this.yAxisLabel,
                   this.layout);

    // Plot all pay gaps between startYear and endYear using the width
    // of the canvas minus margins.
    var previous;
    var numYears = this.endYear - this.startYear;

    // Loop over all rows and draw a line from the previous value to
    // the current.
    for (var i = 0; i < this.data.getRowCount(); i++) {
      // Create an object to store data for the current year.
      var current = {
        // Convert strings to numbers.
        'year': this.data.getNum(i, 'year'),
        'columnValue': this.data.getNum(i, this.columnName)
      };

      if (previous != null) {
        // Draw line segment connecting previous year to current
        // year pay gap.
        stroke(0);
        line(this.mapYearToWidth(previous.year),
             this.mapValueToHeight(previous.columnValue),
             this.mapYearToWidth(current.year),
             this.mapValueToHeight(current.columnValue));

        // The number of x-axis labels to skip so that only
        // numXTickLabels are drawn.
        var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

        // Draw the tick label marking the start of the previous year.
        if (i % xLabelSkip == 0) {
          drawXAxisTickLabel(previous.year, this.layout,
                             this.mapYearToWidth.bind(this));
        }
      }

      // Assign current year to previous year so that it is available
      // during the next iteration of this loop to give us the start
      // position of the next line segment.
      previous = current;
    }

    // Mouse hover begin
    // Looking for the row, which is the closest to the mouse position
    
    var closestRow;
    var closestRowDistance = 99999;
    for (var i = 0; i < this.data.getRowCount(); i++) {
      let year = this.data.getNum(i, 'year');
      let columnValue = this.data.getNum(i, columnName);
    
      let x = this.mapYearToWidth(year);
      let y = this.mapValueToHeight(columnValue);
    
      let d = dist(mouseX, mouseY, x, y);

      if (d < closestRowDistance) {
        closestRow = i;
        closestRowDistance = d;
      }
    }

    // Found the row, which is the closest to the mouse position
    if (closestRow !== null) {
      let year = this.data.getNum(closestRow, 'year');
      let columnValue = this.data.getNum(closestRow, columnName);
  
      let x = this.mapYearToWidth(year);
      let y = this.mapValueToHeight(columnValue);
  
      let d = dist(mouseX, mouseY, x, y);
      
      if (d < 40) {
        // Highlight the point
        fill(255, 0, 0);
        noStroke();
        ellipse(x, y, 10, 10);
  
        // Show data tooltip
        fill(255);
        stroke(0);
        strokeWeight(1);
        let boxWidth = 120;
        let boxHeight = 40;
        let boxX = constrain(x + 10, 0, width - boxWidth -1); //-1 so the box is displayed fully
        let boxY = constrain(y - 20, 0, height - boxHeight);
        rect(boxX, boxY, boxWidth, boxHeight);
  
        noStroke();
        fill(0);
        textAlign(LEFT, TOP);

        text("Year: " + year, boxX + 5, boxY + 5);
        text(columnName + ": " + round(columnValue*100)/100, boxX + 5, boxY + 20); //round with (, 2) in the end didn't work, so I used a regular math as a workaround
      }
      //Mouse hover end    
    }

  };
//Coded by Nino Purtseladze - A part of it, such as the Value name changes - end
  this.drawTitle = function() {
    fill(0);
    noStroke();
    textAlign('center', 'center');

    text(this.title,
         (this.layout.plotWidth() / 2) + this.layout.leftMargin,
         this.layout.topMargin - (this.layout.marginSize / 2));
  };

  this.mapYearToWidth = function(value) {
    return map(value,
               this.startYear,
               this.endYear,
               this.layout.leftMargin,   // Draw left-to-right from margin.
               this.layout.rightMargin);
  };

  this.mapValueToHeight = function(value) {
    return map(value,
               this.minValue,
               this.maxValue,
               this.layout.bottomMargin, // Smaller pay gap at bottom.
               this.layout.topMargin);   // Bigger pay gap at top.
  };
}
  