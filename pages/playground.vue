<template>
  <div>
    <button @click="addItem()">Add new object</button>
    <div id="container">
      <World v-for="item in items" :key="item" />
    </div>
  </div>
</template>


<script>
import Vue from "vue";
import VueDraggableResizable from "vue-draggable-resizable";

// optionally import default styles
import "vue-draggable-resizable/dist/VueDraggableResizable.css";

Vue.component("vue-draggable-resizable", VueDraggableResizable);

export default {
  data: function () {
    return {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      items: [],
    };
  },
  methods: {
    addItem() {
      let id = new Date().getUTCMilliseconds();

      this.items.push(id);
    },
    onResize: function (x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    },
    onDrag: function (x, y) {
      this.x = x;
      this.y = y;
    },
  },
};
</script>

<style>
#container {
  height: 500px;
  width: 500px;
  border: 1px solid red;
  position: relative;
}
</style>