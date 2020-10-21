<template>
  <div id="playground">
    <h1>Actarea - Playground</h1>
    <br />
    <hr />
    <br />

    <button @click="addElements()">Add bezier curve</button>
    <button @click="addCircle()">Add circle</button>
    <button @click="addRect()">Add rect</button>
    <button v-if="isGroup" @click="groupSelection()">Group selection</button>
    <button @click="cloneObject()">Clone selection</button>
    <button @click="deleteSelection()">Delete selection</button>
    <button @click="convertToMask()">Convert to mask</button>
    <button @click="clippingMask()">Clipping mask</button>
    <button @click="drawLines = true">Draw lines</button>

    <div id="container">
      <canvas width="800" height="500" ref="can"></canvas>
    </div>

    Drawing: <input id="mode" type="checkbox" checked /><br />
    Color: <input id="color" type="color" value="#ff0000" /><br />
    Brush size:
    <input id="size" type="range" min="1" max="100" step="1" value="20" /><br />
    Brush opacity:
    <input
      id="opacity"
      type="number"
      min="0"
      max="1"
      step="0.1"
      value="0.5"
    /><br />
  </div>
</template>


<script>
import { fabric } from "fabric";
import { bazierCurve } from "../methods/Figures/bazier.js";
import { clipPath } from "../methods/Figures/clipPath.js";
import { circle } from "../methods/Figures/circle.js";
import { rect } from "../methods/Figures/rect.js";
import { brush } from "../methods/Figures/brush.js";
import { polygons } from "../methods/Figures/polygons.js";

export default {
  data: function () {
    return {
      canvas: {},
      top: 0,
      isGroup: false,
      drawLines: false,
    };
  },
  mounted() {
    const ref = this.$refs.can;

    this.canvas = new fabric.Canvas(ref);
    fabric.Object.prototype.originX = fabric.Object.prototype.originY =
      "center";

    brush(this.canvas);
    polygons(this.canvas);

    //BACKGROUND COLOR
    /*this.canvas.backgroundImage =
      "https://edsurge.imgix.net/uploads/post/image/12528/blueprint-1566350497.jpg?auto=compress%2Cformat&w=640&h=260&fit=crop";
    this.canvas.renderAll();
*/

    this.canvas.on({
      "object:moved": this.mouseDown,
      "selection:created": this.selectObject,
      "selection:cleared": this.unSelectObject,
    });

    var line, isDown;

    this.canvas.on("mouse:down", (o) => {
      isDown = true;
      var pointer = this.canvas.getPointer(o.e);
      var points = [pointer.x, pointer.y, pointer.x, pointer.y];

      if (this.drawLines) {
        console.log("drawing...");
        line = new fabric.Line(points, {
          strokeWidth: 5,
          fill: "blue",
          stroke: "red",
          originX: "center",
          originY: "center",
          selectable: true,
          targetFindTolerance: true,
        });
        this.canvas.add(line);
      }
    });

    this.canvas.on("mouse:move", (o) => {
      if (!isDown) return;
      var pointer = this.canvas.getPointer(o.e);

      if (this.drawLines) {
        line.set({ x2: pointer.x, y2: pointer.y });
        this.canvas.renderAll();
      }
    });

    this.canvas.on("mouse:up", (o) => {
      isDown = false;
      this.drawLines = false;
    });
  },
  methods: {
    addElements() {
      bazierCurve(this.canvas);
    },
    addCircle() {
      circle(this.canvas);
    },
    addRect() {
      rect(this.canvas);
    },
    mouseDown(e) {
      this.top = e.target.top;
    },
    groupSelection() {
      this.canvas.add(this.groupObjects());
    },
    groupObjects() {
      var copiedObjects = [];
      let selection = this.getSelection();

      //console.log(selection._objects);

      //If multiple items are selected the activeGroups will be true
      if (selection._objects) {
        let itemGroup = [];
        //Push all items from the activeGroup into our array
        selection._objects.forEach((object) => {
          let l = object.left;
          let t = object.top;

          object.clone((c) => {
            c.set({
              left: selection.left + l,
              top: selection.top + t,
              //objectId: Date.now(),
            });
            c.setCoords();
            itemGroup.push(c);
          });
          this.canvas.remove(object);
          this.isGroup = true;
        });
        console.log(itemGroup);
        let newGroup = new fabric.Group(itemGroup);
        return newGroup;

        //ONE ITEM
      } else {
        selection.clone((c) => {
          c.set("canvas", this.canvas);
          c.setCoords();
          this.isGroup = false;
          return c;
        });
      }
    },
    selectObject(e) {
      this.isGroup = false;

      let selection = this.getSelection();

      if (selection._objects) {
        this.isGroup = true;
      }
    },
    unSelectObject(e) {
      this.isGroup = false;
    },
    cloneObject() {
      let selection = this.getSelection();

      //If multiple items are selected the activeGroups will be true
      if (selection._objects) {
        //Push all items from the activeGroup into our array
        selection._objects.forEach((object) => {
          let l = object.left;
          let t = object.top;
          object.clone((c) => {
            c.set({
              left: selection.left + l,
              top: selection.top + t,
              //objectId: Date.now(),
            });
            c.setCoords();
            this.canvas.add(c);
          });
        });
        //ONE ITEM
      } else {
        selection.clone((c) => {
          c.set("canvas", this.canvas);
          c.setCoords();
          this.canvas.add(c);
        });
      }
    },
    getSelection() {
      return this.canvas.getActiveObject() == null
        ? this.canvas.getActiveGroup()
        : this.canvas.getActiveObject();
    },
    deleteSelection() {
      let selection = this.getSelection();

      if (selection._objects && selection.dirty) {
        selection._objects.forEach((o) => {
          this.canvas.remove(o);
        });
      } else {
        this.canvas.remove(selection);
      }
    },
    convertToMask() {
      let selection = this.getSelection();
      if (selection._objects) {
        selection._objects.forEach((o) => {
          o.set({
            fill: "rgba(255,0,0,0.3)",
            stroke: "red",
            strokeWidth: 1,
          });
        });
      } else {
        selection.set({
          fill: "rgba(255,0,0,0.3)",
          stroke: "red",
          strokeWidth: 1,
        });
      }
      this.canvas.requestRenderAll();
    },
    clippingMask() {
      let selection = this.getSelection();

      selection.clone((c) => {
        c.set({
          clipPath: new fabric.Circle({
            radius: 100,
            left: 100,
            top: 100,
            originX: "center",
            originY: "center",
          }),
        });

        c.set("canvas", this.canvas);
        c.setCoords();

        this.canvas.add(c);
      });

      // let circle = new fabric.Circle({
      //   radius: 100,
      //   left: 0,
      //   top: 0,
      // });

      // let newgroup = this.groupObjects();
      // circle = newgroup._objects[0];
      //newgroup.clipPath = circle;
      //this.canvas.add(newgroup);
      //selection._objects[0].clipPath = selection._objects[1];
      //this.canvas.add(selection);
      // this.canvas.requestRenderAll();
    },
    randomColor() {
      return (
        "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")
      );
    },
  },
};
</script>

<style>
body {
  background-color: #fff;
}
canvas {
  border: 1px solid red;
  width: 800px;
  height: 500px;
}
#container {
  width: 800px;
  height: 500px;
}
</style>