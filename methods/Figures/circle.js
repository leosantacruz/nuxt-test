function circle(canvas) {
  var canvas = canvas;

  var path = new fabric.Circle({
    radius: 100,
    top: 100,
    left: 100,
    fill: "#f5f0b8"
  });

  canvas.add(path);
}

export { circle };
