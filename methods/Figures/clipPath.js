function clipPath(canvas) {
  var canvas = canvas;

  var path = new fabric.Circle({
    radius: 100,
    top: 50,
    left: 50,
    fill: "#f5f0b8"
  });

  var path2 = new fabric.Circle({
    radius: 100,
    top: 0,
    left: 0,
    fill: "#aca2a0"
  });
  var grupo = new fabric.Group([path2, path]);
  canvas.add(grupo);

  var group = new fabric.Group([
    new fabric.Rect({
      width: 300,
      height: 300,
      fill: "#f5f0b8",
      left: 100,
      top: 100
    }),
    new fabric.Rect({
      width: 50,
      angle: 45,
      height: 100,
      fill: "#e1e0cc",
      left: 0,
      top: 0
    }),
    new fabric.Rect({ width: 100, height: 100, fill: "#aca2a0", left: 100 }),
    new fabric.Rect({ width: 100, height: 100, fill: "#ddd1e6", top: 100 })
  ]);
  group.clipPath = grupo;
  canvas.add(group);
}

export { clipPath };
