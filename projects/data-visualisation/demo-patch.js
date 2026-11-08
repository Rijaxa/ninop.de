// Demo wrapper: the original code positions controls in page coordinates for a fixed layout
// (canvas starting at about x 310, y 8). Here they are placed relative to the canvas and scale with it.
(function(){
  var orig = p5.Element.prototype.position;
  p5.Element.prototype.position = function(x, y){
    if (arguments.length === 0) return orig.call(this);
    var stage = document.getElementById('stage');
    if (!stage) return orig.call(this, x, y);
    if (this.elt.parentNode !== stage) stage.appendChild(this.elt);
    var cx = Math.max(0, x - 310), cy = Math.max(0, y - 8);
    this.elt.style.position = 'absolute';
    this.elt.style.left = (cx / 1024 * 100) + '%';
    this.elt.style.top = (cy / 576 * 100) + '%';
    return this;
  };
})();
