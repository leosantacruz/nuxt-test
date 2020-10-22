<template>
  <div id="playground">
    <div class="container-fluid">
      <h2>Actarea</h2>
      <h5>Playground</h5>
      <hr />
      <div class="row">
        <div class="col-sm-3">
          <h5>Creation</h5>
          <button class="btn btn-primary btn-block btn-sm" @click="addCircle()">
            Add circle
          </button>
          <button class="btn btn-primary btn-block btn-sm" @click="addRect()">
            Add rect
          </button>
          <button class="btn btn-primary btn-block btn-sm" @click="drawBrush()">
            Brush:
            <span v-if="brushStatus">On</span>
            <span v-else>Off</span>
          </button>
          <button
            class="btn btn-primary btn-block btn-sm"
            @click="drawPolygons()"
          >
            Polygons
          </button>
          <button class="btn btn-primary btn-block btn-sm" @click="drawLines()">
            Lines
          </button>
          <button
            class="btn btn-primary btn-block btn-sm"
            @click="addElements()"
          >
            Add bezier curve
          </button>
          <hr />
          <div class="form-group">
            <label for="">Background image</label>
            <input type="text" v-model="backgroundUrl" class="form-control" />
          </div>

          <h5>Manipulation</h5>
          <button
            class="btn btn-secondary btn-block btn-sm"
            v-if="isGroup"
            @click="groupSelection()"
          >
            Group selection
          </button>
          <button
            class="btn btn-secondary btn-block btn-sm"
            @click="cloneObject()"
          >
            Clone selection
          </button>
          <button
            class="btn btn-secondary btn-block btn-sm"
            @click="deleteSelection()"
          >
            Delete selection
          </button>
          <button
            class="btn btn-secondary btn-block btn-sm"
            @click="convertToMask()"
          >
            Convert to mask
          </button>
          <button
            class="btn btn-secondary btn-block btn-sm"
            @click="clippingMask()"
          >
            Clipping mask
          </button>
        </div>
        <div class="col-sm-8">
          <div
            id="canvasContainer"
            :style="{ backgroundImage: `url(${backgroundUrl})` }"
          >
            <canvas width="800" height="500" ref="can"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { fabric } from "fabric";
import { bazierCurve } from "../methods/Figures/bazier.js";
import { line } from "../methods/Figures/line.js";
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
      brushStatus: false,
      backgroundUrl:
        "https://img.freepik.com/vector-gratis/fondo-pintura-acuarela-rosa-vibrante_53876-58930.jpg?size=626&ext=jpg",
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
      "selection:cleared": this.unSelectObject,
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
    drawPolygons() {
      polygons(this.canvas);
    },
    drawBrush() {
      this.brushStatus = !this.brushStatus;
      brush(this.canvas, this.brushStatus);
    },
    drawLines() {
      line(this.canvas, true);
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
#canvasContainer canvas {
  border: 1px solid gray;
  width: 800px;
  height: 500px;
}
#canvasContainer {
  width: 800px;
  height: 500px;

  background-size: cover;
}
</style>