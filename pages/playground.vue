<template>
  <div id="playground">
    <button @click="addElements()">Add</button>
    <canvas ref="can" width="800" height="500"></canvas>
  </div>
</template>


<script>
import { fabric } from "fabric";

export default {
  data: function () {
    return {
      canvas: {},
    };
  },
  mounted() {
    const ref = this.$refs.can;

    var canvas = new fabric.Canvas(ref);
    var path = new fabric.Circle({
      radius: 100,
      top: -100,
      left: -100,
      fill: "red",
    });

    var path2 = new fabric.Circle({
      radius: 100,
      top: -200,
      left: -180,
      fill: "blue",
    });
    var grupo = new fabric.Group([path2, path]);
    // canvas.add(grupo);

    var group = new fabric.Group([
      new fabric.Rect({
        width: 200,
        height: 200,
        fill: "red",
        left: -100,
        top: -100,
      }),
      new fabric.Rect({ width: 100, height: 100, fill: "yellow", left: 100 }),
      new fabric.Rect({ width: 100, height: 100, fill: "blue", top: 100 }),
      new fabric.Rect({
        width: 100,
        height: 100,
        fill: "green",
        left: 100,
        top: 100,
      }),
    ]);
    group.clipPath = grupo;
    canvas.add(group);
  },
  methods: {
    addElements() {
      const rect = new fabric.Rect({
        fill: "red",
        width: 100,
        height: 100,
        top: 100,
        left: 100,
      });

      const triangle = new fabric.Triangle({
        fill: "red",
        width: 100,
        height: 100,
        top: 300,
        left: 300,
      });

      var group = new fabric.Group([rect, triangle]);
      this.canvas.add(group);

      const triangle2 = new fabric.Triangle({
        fill: "blue",
        width: 100,
        height: 100,
        top: 400,
        left: 430,
      });

      group.add(triangle2);
    },
  },
};
</script>

<style>
canvas {
  border: 1px solid red;
}
</style>