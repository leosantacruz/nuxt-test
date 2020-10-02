<template>
  <vue-draggable-resizable
    :w="100"
    :h="100"
    :x="$props.x"
    :y="y"
    @dragging="onDrag"
    @resizing="onResize"
    :parent="true"
    :lock-aspect-ratio="true"
  >
    <img src="https://i.stack.imgur.com/e8nZC.gif" alt="" width="100%" />
  </vue-draggable-resizable>
</template>


<script>
export default {
  props: ["x", "y"],
};
</script>