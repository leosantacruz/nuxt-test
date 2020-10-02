<template>
  <div id="playground">
    <button @click="addItem('World')">Add new world</button>
    <button @click="addItem('Rocket')">Add new rocket</button>
    <button @click="addItem('Banana')">Add new banana animation</button>
    <div id="container">
      <Icon
        v-for="item in items"
        :type="item.type"
        :id="item.id"
        :key="item.id"
        :x="item.x"
        :y="item.y"
      />
    </div>
    <div class="text-left">
      <pre>{{ items }}</pre>
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
      items: [
        // {
        //   id: 1,
        //   type: "Banana",
        //   x: 250,
        //   y: 250,
        // },
        // {
        //   id: 2,
        //   type: "World",
        //   x: 150,
        //   y: 150,
        // },
      ],
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
#playground {
  margin: 10px auto;
  text-align: center;
}
#container {
  height: 500px;
  width: 500px;

  border: 1px solid rgb(0, 132, 255);
  position: relative;
  margin: 10px auto;

  background-color: transparent;
  background-image: linear-gradient(
      0deg,
      transparent 9%,
      rgba(255, 255, 255, 0.2) 10%,
      rgba(255, 255, 255, 0.2) 12%,
      transparent 13%,
      transparent 29%,
      rgba(255, 255, 255, 0.1) 30%,
      rgba(255, 255, 255, 0.1) 31%,
      transparent 32%,
      transparent 49%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.1) 51%,
      transparent 52%,
      transparent 69%,
      rgba(255, 255, 255, 0.1) 70%,
      rgba(255, 255, 255, 0.1) 71%,
      transparent 72%,
      transparent 89%,
      rgba(255, 255, 255, 0.1) 90%,
      rgba(255, 255, 255, 0.1) 91%,
      transparent 92%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 9%,
      rgba(255, 255, 255, 0.2) 10%,
      rgba(255, 255, 255, 0.2) 12%,
      transparent 13%,
      transparent 29%,
      rgba(255, 255, 255, 0.1) 30%,
      rgba(255, 255, 255, 0.1) 31%,
      transparent 32%,
      transparent 49%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.1) 51%,
      transparent 52%,
      transparent 69%,
      rgba(255, 255, 255, 0.1) 70%,
      rgba(255, 255, 255, 0.1) 71%,
      transparent 72%,
      transparent 89%,
      rgba(255, 255, 255, 0.1) 90%,
      rgba(255, 255, 255, 0.1) 91%,
      transparent 92%,
      transparent
    );

  background-size: 50px 50px;
}
</style>