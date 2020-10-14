<template>
  <div id="playground">
    <h1>Actarea - Playground</h1>

    <button @click="addElements()">Add bezier curve</button>
    <button @click="addCircle()">Add circle</button>
    <button @click="addRect()">Add rect</button>
    <button @click="groupSelection()">Group selection</button>
    <button @click="cloneObject()">Clone selection</button>
    <button @click="deleteSelection()">Delete selection</button>
    <button @click="convertToMask()">Convert to mask</button>
    <button @click="clippingMask()">Clipping mask</button>

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
        });
        console.log(itemGroup);
        let newGroup = new fabric.Group(itemGroup);
        return newGroup;

        //ONE ITEM
      } else {
        selection.clone((c) => {
          c.set("canvas", this.canvas);
          c.setCoords();
          return c;
        });
      }
    },
    selectObject(e) {
      //console.log(this.canvas.getObjects());
      //this.canvas.getObjects()[0].set({ top: 0 });
      //this.canvas.add(this.canvas.getObjects()[0]);
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

      /*   selection.clone((c) => {
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
      */

      let circle = new fabric.Circle({
        radius: 100,
        left: 0,
        top: 0,
      });

      let newgroup = this.groupObjects();
      circle = newgroup._objects[0];
      newgroup.clipPath = circle;
      this.canvas.add(newgroup);
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
}
</style>