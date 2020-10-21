function brush(canvas) {
  var bru = canvas.freeDrawingBrush;
  bru.width = 20;
  bru.color = "rgba(0, 0, 255, 0.5  )";
  bru.shadow = new fabric.Shadow({
    //blur: parseInt(30, 15) || 0,
    offsetX: 10,
    offsetY: 0,
    affectStroke: false,
    color: "red"
  });

  //switch drawing mode
  document.getElementById("mode").onchange = function() {
    canvas.isDrawingMode = this.checked;
  };
}

export { brush };
