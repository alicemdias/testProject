<script lang="ts">
import Vue from "vue";
import FormComponent from "@/components/form.vue";
import TextComponent from "@/components/text.vue";
import InputComponent from "@/components/input.vue";
import SubmitComponent from "@/components/submit.vue";
import { mapGetters, mapState } from "vuex";
export default Vue.extend({
  name: "MainView",
  // Registering child components that will be used within this component.
  // Grouping related components for better maintainability and readability.
  components: {
    FormComponent,
    TextComponent,
    InputComponent,
    SubmitComponent,
  },
  data() {
    return {
      // Stores the user ID, initially an empty string.
      userId: "",
    };
  },
  computed: {
    // Using Vuex's mapState helper to map the userError state to a local computed property.
    ...mapState({
      // The state is typed as 'any' for flexibility, but ideally, a specific type should be used for better type safety.
      userError: (state: any) => state.userError, // Accessing Vuex state directly
    }),
  },
  methods: {
    async submitUserId() {
      // Trim whitespace from userId and check if it's not empty
      const trimmedUserId = this.userId.trim();
      if (trimmedUserId) {
        // Clear any previous error messages
        this.$store.commit("clearUserError");

        try {
          // Navigate to the FormView route with the provided User ID
          await this.$router.replace({ path: `/${trimmedUserId}` });
        } catch (navigationError) {
          // Handle any errors that occur during navigation
          this.$store.commit(
            "setUserError",
            "Failed to navigate to the requested page. Please try again."
          );
        }
      } else {
        // Handle cases where the User ID is empty
        this.$store.commit(
          "setUserError",
          "User ID cannot be empty. Please enter a valid User ID."
        );
      }
    },
  },
  watch: {
    "$route.query.userError": {
      handler(newError: string) {
        // Check if there is a new error in the query parameters
        if (newError) {
          // Commit the new error message to the Vuex store
          this.$store.commit("setUserError", newError);
        }
      },
      immediate: true, // Immediately invoke the handler with the current value of the watched expression
    },
  },
});
</script>
<template>
  <div>
    <FormComponent>
      <template v-slot:title>
        <TextComponent
          :text="`ClaimsGate`"
          type="h1"
          classes="text-black"
          style="color: black"
        />
      </template>
      <!-- Slot for the subtitle section of the form -->
      <template v-slot:subtitle>
        <TextComponent
          text="Provide User ID to continue:"
          type="h5"
          classes="text-secondary"
        />
      </template>
      <!-- Slot for the question/input field of the form -->
      <template v-slot:question>
        <InputComponent
          type="text"
          v-model="userId"
          label="User ID"
          name="userId"
          :required="true"
        />
      </template>
      <!-- Slot for the submit button and potential error message -->
      <template v-slot:submit>
        <p v-if="userError" class="text-danger">
          {{ userError }}
        </p>
        <!-- Submit button component -->
        <SubmitComponent
          buttonText="Submit User ID"
          :isButtonDisabled="!userId"
          @click="submitUserId"
        />
      </template>
    </FormComponent>
  </div>
</template>
