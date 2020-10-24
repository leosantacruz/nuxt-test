function line(canvas, drawLinesStatus) {
  var line, isDown;

  canvas.on("mouse:down", o => {
    isDown = true;
    var pointer = canvas.getPointer(o.e);
    var points = [pointer.x, pointer.y, pointer.x, pointer.y];

    if (drawLinesStatus) {
      line = new fabric.Line(points, {
        strokeWidth: 5,
        fill: "blue",
        stroke: "gray",
        originX: "center",
        originY: "center",
        selectable: true,
        targetFindTolerance: true
      });
      canvas.add(line);
    }
  });

  canvas.on("mouse:move", o => {
    if (!isDown) return;
    var pointer = canvas.getPointer(o.e);

    if (drawLinesStatus) {
      line.set({ x2: pointer.x, y2: pointer.y });
      canvas.renderAll();
    }
  });

  canvas.on("mouse:up", o => {
    isDown = false;
    drawLinesStatus = false;
  });
}
export { line };
