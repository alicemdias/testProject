<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "App",
});
</script>
<template>
  <div id="app" class="container">
    <router-view :key="$route.path" />
  </div>
</template>
