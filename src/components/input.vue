<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "InputComponent",
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator(value: string) {
        return ["text", "date"].includes(value);
      },
    },
    classes: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    //Props for options - utilized for postcode autocompletion
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
  <div>
    <b-form-group :for="name">{{ label }}</b-form-group>
    <b-form-input
      :type="type"
      :value="value"
      @input="$emit('input', $event)"
      :list="showOptions ? 'postcode-options' : null"
      :class="[classes]"
      :required="required"
      autocomplete="off"
    />
    <!-- Autocomplete for postcode suggestions - optional -->
    <datalist id="postcode-options" v-if="showOptions">
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </datalist>
  </div>
</template>
