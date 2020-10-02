<template>
  <div>
    <button @click="addItem('World')">Add new world</button>
    <button @click="addItem('Rocket')">Add new rocket</button>
    <div id="container">
      <Icon
        v-for="item in items"
        :type="item.type"
        :id="item.id"
        :key="item.id"
      />
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
    addItem(type) {
      let id = new Date().getUTCMilliseconds();

      this.items.push({
        id: id,
        type: type,
      });
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