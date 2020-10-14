function rect(canvas) {
  var canvas = canvas;

  var path = new fabric.Rect({
    width: 100,
    height: 100,
    top: 100,
    left: 100,
    fill: "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")
  });

  canvas.add(path);
}

export { rect };
