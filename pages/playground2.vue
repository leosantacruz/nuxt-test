<template>
  <div id="playground">
    <h1>Actarea - Playground</h1>

    <button @click="addElements()">Add bezier curve</button>
    <button @click="addCircle()">Add circle</button>
    <button @click="addRect()">Add rect</button>
    <button @click="groupSelection()">Group selection</button>
    <button @click="cloneObject()">Clone object</button>

    <canvas ref="can" width="800" height="500"></canvas>
  </div>
</template>


<script>
import { fabric } from "fabric";
import { bazierCurve } from "../methods/Figures/bazier.js";
import { clipPath } from "../methods/Figures/clipPath.js";
import { circle } from "../methods/Figures/circle.js";
import { rect } from "../methods/Figures/rect.js";

export default {
  data: function () {
    return {
      canvas: {},
      top: 0,
    };
  },
  mounted() {
    const ref = this.$refs.can;

    this.canvas = new fabric.Canvas(ref);
    fabric.Object.prototype.originX = fabric.Object.prototype.originY =
      "center";

    this.canvas.on({
      "object:moved": this.mouseDown,
      "selection:created": this.selectObject,
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
      var copiedObjects = [];
      var selection =
        this.canvas.getActiveObject() == null
          ? this.canvas.getActiveGroup()
          : this.canvas.getActiveObject();

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
        });
        console.log(itemGroup);
        let newGroup = new fabric.Group(itemGroup);
        this.canvas.add(newGroup);

        //ONE ITEM
      } else {
        selection.clone((c) => {
          c.set("canvas", this.canvas);
          c.setCoords();
          this.canvas.add(c);
        });
      }
    },
    selectObject(e) {
      //console.log(this.canvas.getObjects());
      //this.canvas.getObjects()[0].set({ top: 0 });
      //this.canvas.add(this.canvas.getObjects()[0]);
    },
    cloneObject() {
      var copiedObjects = [];
      var selection =
        this.canvas.getActiveObject() == null
          ? this.canvas.getActiveGroup()
          : this.canvas.getActiveObject();

      //console.log(selection._objects);

      //If multiple items are selected the activeGroups will be true
      if (selection._objects) {
        //Push all items from the activeGroup into our array
        selection._objects.forEach((object) => {
          let l = object.left;
          let t = object.top;
          console.log(selection);
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
    acloneObject() {
      var group =
        this.canvas.getActiveObject() == null
          ? this.canvas.getActiveGroup()
          : this.canvas.getActiveObject();

      group.clone((c) => {
        //console.log(c);
        var cloned = c._objects;

        var item1 = cloned[0].set({
          left: 0,
          top: 0,
          fill: "red",
          originX: "center",
          originaY: "center",
        });
        item1.setCoords();
        this.canvas.add(item1);
        this.canvas.requestRenderAll();
        //this.canvas.add(item);
        // cloned.forEach((item) => {
        //   item.set({
        //     left: item.left + 10,
        //     top: item.top + 10,
        //     // evented: true,
        //   });
        //   this.canvas.add(item);
        // });
        //this.canvas.requestRenderAll();
      });
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
}
</style>