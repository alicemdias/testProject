<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "FormComponent",
});
</script>
<template>
  <!-- TODO Use bootstrap classes to ensure the form reders appropriately on mobile, and each element has appropriate vertical spacing -->
    <div class="container mt-4 mb-4">
    <div class="row mb-4">
      <div class="col">
        <slot name="title"></slot>
      </div>
    </div>
    <div class="row mb-4">
      <div class="col">
        <slot name="subtitle"></slot>
      </div>
    </div>
    <div class="row mb-4">
      <div class="col">
        <slot name="question"></slot>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-auto text-center">
        <slot name="submit"></slot>
      </div>
    </div>
  </div>
</template>
