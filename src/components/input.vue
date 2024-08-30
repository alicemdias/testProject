<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "InputComponent",
  props: {
    // The name attribute for the input field, used for form submission.
    name: {
      type: String,
      required: true,
    },
    // The type of input field. Validates to ensure it's either 'text' or 'date'.
    type: {
      type: String,
      required: true,
      validator(value: string) {
        // Ensures that the type is one of the allowed input types
        return ["text", "date"].includes(value);
      },
    },
    // The current value of the input field. It is a required prop.
    value: {
      type: String,
      required: true,
    },
    // The label to be displayed next to the input field.
    label: {
      type: String,
      required: true,
    },
    classes: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
    showOptions: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      suggestions: [] as string[],
    };
  },
});
</script>
<template>
  <!-- Create a container so the background can be dark-->
  <b-container>
    <div class="border p-3 rounded bg-dark text-white shadow-lg mb-4">
      <!-- Form group label that displays the text that will be shown as the label.-->
      <b-form-group :for="name">{{ label }}</b-form-group>
      <b-form-input
        :type="type"
        :class="[classes]"
        :value="value"
        @input="$emit('input', $event)"
        :list="showOptions ? 'postcode-options' : null"
        :required="required"
        autocomplete="off"
      />
      <datalist id="postcode-options" v-if="showOptions">
        <option v-for="option in options" :key="option" :value="option">
          {{ option }}
        </option>
      </datalist>
    </div>
  </b-container>
</template>
