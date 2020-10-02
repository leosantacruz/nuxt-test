<template>
  <component v-bind:is="dynamicComponent" :x="$props.x" :y="y"></component>
</template>
<script>
export default {
  props: ["id", "type", "x", "y"],
  components: {
    World: () => import("@/components/Icons/World"),
    Rocket: () => import("@/components/Icons/Rocket"),
    Banana: () => import("@/components/Icons/Banana"),
  },

  computed: {
    dynamicComponent() {
      return this.$props.type;
    },
  },
};
</script>