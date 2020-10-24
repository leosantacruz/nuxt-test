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
          <button class="btn btn-primary btn-block btn-sm" @click="addCurve()">
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
            :disabled="!isGroup"
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
        <div class="col-sm-6">
          <div
            id="canvasContainer"
            :style="{ backgroundImage: `url(${backgroundUrl})` }"
          >
            <canvas width="600" height="500" ref="can"></canvas>
          </div>
        </div>
        <div class="col-sm-3">
          Background
          <div class="row">
            <div class="col-sm-4">
              <button
                @click="changeBgColor('green')"
                class="btn btn-sm btn-success btn-block"
              >
                Green
              </button>
            </div>
            <div class="col-sm-4">
              <button
                @click="changeBgColor('red')"
                class="btn btn-sm btn-danger btn-block"
              >
                Red
              </button>
            </div>
            <div class="col-sm-4">
              <button
                @click="changeBgColor('blue')"
                class="btn btn-sm btn-primary btn-block"
              >
                Blue
              </button>
            </div>
          </div>
          <hr />
          Stroke
          <div class="row">
            <div class="col-sm-4">
              <button
                @click="changeStrokeColor('green')"
                class="btn btn-sm btn-success btn-block"
              >
                Green
              </button>
            </div>
            <div class="col-sm-4">
              <button
                @click="changeStrokeColor('red')"
                class="btn btn-sm btn-danger btn-block"
              >
                Red
              </button>
            </div>
            <div class="col-sm-4">
              <button
                @click="changeStrokeColor('blue')"
                class="btn btn-sm btn-primary btn-block"
              >
                Blue
              </button>
            </div>
          </div>
          <hr />
          <div class="form-group">
            <label for="">Stroke width</label>
            <select v-model="strokeWidth" @change="changeStrokeWidth()" id="">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
          </div>
          <pre>{{ selection }}</pre>
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
      selection: {},
      strokeWidth: 1,
      backgroundUrl: "",
      //"https://previews.123rf.com/images/kotoffei/kotoffei1410/kotoffei141000420/32121863-cuadr%C3%ADcula-sin-patr%C3%B3n-ilustraci%C3%B3n-del-vector-milim%C3%A9trico-fondo-de-papel-de-la-ingenier%C3%ADa-.jpg",
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
    addCurve() {
      let curve = new fabric.Path("M0.4,0.4c107.2,107.2,280.7,107.2,387.9,0", {
        stroke: "black",
        fill: "rgba(0,0,0,0)",
      });
      curve.set("strokeUniform", true);
      this.canvas.add(curve);
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
      this.selection = e;

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
      let mask;

      selection._objects[0].clone((c) => {
        mask = c;
        mask.set({
          canvas: this.canvas,
          selectable: false,
        });

        mask.setCoords();
      });

      selection.clone((c) => {
        c.set({
          clipPath: mask,
          originX: "center",
          originY: "center",
        });
        /*
        c.set({
          clipPath: new fabric.Circle({
            radius: 100,
            left: 100,
            top: 100,
            originX: "center",
            originY: "center",
          }),
        });
*/

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
    changeBgColor(color) {
      this.selection.target.fill = color;
      this.selection.target.dirty = true;
      this.canvas.renderAll();
    },
    changeStrokeColor(color) {
      this.selection.target.stroke = color;
      this.selection.target.dirty = true;
      this.canvas.renderAll();
    },
    changeStrokeWidth() {
      this.selection.target.strokeWidth = parseInt(this.strokeWidth);
      this.selection.target.dirty = true;
      this.canvas.renderAll();
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
  width: 600px;
  height: 500px;
}
#canvasContainer {
  width: 600px;
  height: 500px;

  background-size: cover;
}
</style>