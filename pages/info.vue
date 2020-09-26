<template>
  <div>
    <h1>
      Hello {{ this.$store.state.store.superuser.name }} your IP is {{ ip }}
    </h1>
  </div>
</template>

<script>
export default {
  name: "info",
  data() {
    return {
      ip: "",
    };
  },
  mounted() {
    this.fetchSomething();
  },
  methods: {
    async fetchSomething() {
      const ip = await this.$axios.$get("http://icanhazip.com");
      this.ip = ip;
    },
  },
};
</script>

<style>
</style>