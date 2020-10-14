function circle(canvas) {
  var canvas = canvas;

  var path = new fabric.Circle({
    radius: 100,
    top: 100,
    left: 100,
    fill: "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")
  });

  canvas.add(path);
}

export { circle };
