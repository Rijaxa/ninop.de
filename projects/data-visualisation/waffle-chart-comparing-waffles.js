function WaffleChartComparingWaffles() {
//Coded by Nino Purtseladze - A part of it, such as the Value name changes - begin
/*Data Sources:
https://www.nutritionvalue.org/Waffle%2C_plain_55201000_nutritional_value.html?size=100+g
Waffle Plain

https://www.nutritionvalue.org/Belgian_waffles_561536_nutritional_value.html?size=100+g
Belgian Waffle

https://www.nutritionvalue.org/Waffle%2C_whole_grain_55205000_nutritional_value.html?size=100+g
Whole Grain Waffle

https://www.nutritionvalue.org/Waffle%2C_gluten_free_55208000_nutritional_value.html?size=100+g
Waffle Gluten Free

https://www.nutritionvalue.org/Waffle%2C_plain%2C_reduced_fat_55200030_nutritional_value.html?size=100+g
Waffle plain reduced fat
*/
  
  // Name for the visualisation to appear in the menu bar.
  this.name = 'Waffle Chart Comparing Waffles';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'waffle-chart-comparing-waffles';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/waffle-chart/waffles.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };

  this.setup = function() {
    var wafflesAvailable = this.data.rows.length;
    this.waffles = [];
    for (let i=0; i<wafflesAvailable; i++) {
      this.waffles.push(this.getWaffleData(i));
    }
  };

  this.getWaffleData = function(index) {
    var waffle = [
      {fieldName: this.data.columns[1], value: this.data.getNum(index,1), colour: "#ffde21"},
      {fieldName: this.data.columns[2], value: this.data.getNum(index,2), colour: "#efebdc"},
      {fieldName: this.data.columns[3], value: this.data.getNum(index,3), colour: "#77bbb4"}
    ];
    return {
      name: this.data.getString(index,0),
      waffleData: waffle
    }
  }

  // Create a new donut chart object.

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    for (let i=0; i<this.waffles.length; i++) {
      var waffle = this.waffles[i];
      console.log("Waffle: " + JSON.stringify(waffle));
      var x = i % 3;
      var y = (i-x) / 3;
      var chart = new WaffleChart(width / 3 * x + 80, 230 * y + 100, width * 0.4);
      chart.draw(waffle);
    }

    if (this.name) {
      noStroke();
      fill("#000000");
      textAlign('center', 'center');
      textSize(24);
      text(this.name, 50, 50, width * 0.4);
    }

    textSize(20);
    textAlign(LEFT);
    fill("#ffde21");
    noStroke();
    rect(860, 390, 16, 16);
    text ("Fat", 765, 400);

    fill("#efebdc");
    noStroke();
    rect(860, 442, 16, 16);
    text ("Carbs", 765, 450);

    fill("#77bbb4");
    noStroke();
    rect(860, 492, 16, 16);
    text ("Protein", 765, 500);

  };
}
//Coded by Nino Purtseladze - end