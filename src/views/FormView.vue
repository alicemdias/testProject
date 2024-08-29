<script lang="ts">
import Vue from "vue";
import FormComponent from "@/components/form.vue";
export default Vue.extend({
  name: "FormView",
  components: {
    FormComponent,
  },
});
</script>
<template>
  <div>
    <!-- TODO placeholder, remove this text -->
    <p>Form View</p>
    <FormComponent>
      <!-- TODO add relevant components to render form here -->
    </FormComponent>
  </div>
</template>
