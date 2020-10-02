<template>
  <component v-bind:is="dynamicComponent"></component>
</template>
<script>
export default {
  props: ["id", "type"],
  components: {
    World: () => import("@/components/Icons/World"),
    Rocket: () => import("@/components/Icons/Rocket"),
  },

  computed: {
    dynamicComponent() {
      return this.$props.type;
    },
  },
};
</script>