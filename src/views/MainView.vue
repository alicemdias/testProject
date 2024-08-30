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
    submitUserId() {
      if (this.userId.trim()) {
        this.$store.commit("clearUserError");
        // Navigate to the FormView route corresponding to the entered userId
        this.$router.replace({ path: `${this.userId}` });
      } else {
        // To handle cases where userId is empty
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
      <template v-slot:subtitle>
        <TextComponent
          text="Provide User ID to continue:"
          type="h5"
          classes="text-secondary"
        />
      </template>
      <template v-slot:question>
        <InputComponent
          type="text"
          v-model="userId"
          label="User ID"
          name="userId"
          :required="true"
        />
      </template>
      <template v-slot:submit>
        <p v-if="userError" class="text-danger">
          {{ userError }}
        </p>
        <SubmitComponent
          buttonText="Submit User ID"
          :isButtonDisabled="!userId"
          @click="submitUserId"
        />
      </template>
    </FormComponent>
  </div>
</template>
