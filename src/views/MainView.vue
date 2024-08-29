<script lang="ts">
import Vue from "vue";
import FormComponent from "@/components/form.vue";
import TextComponent from "@/components/text.vue";
import InputComponent from "@/components/input.vue";
import SubmitComponent from "@/components/submit.vue";
import { mapGetters, mapState } from "vuex";
export default Vue.extend({
  name: "HomeView",
  components: {
    FormComponent,
    TextComponent,
    InputComponent,
    SubmitComponent,
  },
  data() {
    return {
      userId: "",
    };
  },
  computed: {
    ...mapState({
      userError: (state: any) => state.userError, // Accessing Vuex state directly
    }),
  },
  methods: {
    submitUserId() {
      if (this.userId.trim()) {
        // Clear error before navigation
        this.$store.commit("clearUserError");
        //Navigate to the FormView via the /:userId route.
        this.$router.replace({ path: `${this.userId}` });
      }
    },
  },
  //Watches for the query parameter from the router to update error message
  watch: {
    "$route.query.userError": {
      handler(newError) {
        if (newError) {
          this.$store.commit("setUserError", newError);
        }
      },
    },
  },
});
</script>
<template>
  <div>
    <!-- Home View: utilizes formComponent for user to enter UserId details. User is redirected to :/usedId page where user validation functionality is held -->
    <FormComponent>
      <template v-slot:title>
        <TextComponent
          :text="`Welcome to ClaimsGate`"
          type="h1"
          classes="text-primary"
        />
      </template>
      <template v-slot:subtitle>
        <TextComponent
          text="To continue to your onboarding form, please provide your User ID:"
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
    <p class="text-center">
      If you do not have access to your User ID, please email
      support@claimsgate.co.uk
    </p>
  </div>
</template>