<script lang="ts">
import { createClaim } from "@/core/createClaim";
import { getUserIpAddress } from "@/core/getUserIpAddress";
import { Address } from "@/types";
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
export default Vue.extend({
  name: "SubmitComponent",
  props: {
    // Determines if the submit button should be disabled
    isButtonDisabled: {
      type: Boolean,
      default: false,
    },
    // Indicates if the form is currently being submitted
    isFormSubmission: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // Strings to store error, success and ipError messages
      errorMsg: "",
      successMsg: "",
      ipErrorMsg: ",",
    };
  },
  computed: {
    // Maps Vuex getters to computed properties in this component
    // Gets the current user, addresses objects and check if the address history is valid
    ...mapGetters(["user", "addresses", "isAddressHistoryValid"]),
  },
  methods: {
    // Maps Vuex actions to methods in this component
    ...mapActions(["createClaimAction"]),
    // Resets the address form by committing the 'resetAddress' mutation
    clearForm() {
      this.$store.commit("resetAddress");
    },
    // Validates that all addresses have line1, postcode, and dateMovedIn
    isValid(): boolean {
      return this.addresses.every(
        (address: Address) =>
          address.line1 && address.postcode && address.dateMovedIn
      );
    },
    // Handles button click; either submits the form or emits a click event
    handleClick() {
      if (this.isFormSubmission) {
        // Calls submitForm method if it's a form submission
        this.submitForm();
      } else {
        // Emits a click event if not a form submission
        this.$emit("click");
      }
    },
    async submitForm() {
      // Clear any existing messages
      this.errorMsg = "";
      this.successMsg = "";
      this.ipErrorMsg = "";
      // Validate the form fields before submitting
      if (!this.isValid()) {
        this.errorMsg =
          "All fields marked with an asterisk (*) are required. Please complete them before submitting.";
        return; // Stop the submission if validation fails
      }
      try {
        // Retrieve the user ID from the Vuex store
        const userId = this.user.id;
        // Prepare the claim data to be submitted
        const claimData = { addresses: this.addresses };
        // Attempt to retrieve the user's IP address
        const [creationIpAddress, ipErrorMsg] = await getUserIpAddress();
        // Handle any errors in retrieving the IP address
        if (ipErrorMsg) {
          this.ipErrorMsg =
            "IP address could not be retrieved. Your claim will be submitted without this information.";
        }
        // Attempt to create a new claim with the provided data
        const [newClaim, error] = await createClaim(
          userId,
          creationIpAddress || "IP not available",
          claimData
        );
        // Handle any errors that occurred during claim creation
        if (error) {
          this.errorMsg =
            "We encountered an issue while submitting your address history. Please try again.";
        } else {
          // Clear the form upon successful submission
          this.clearForm();
          this.successMsg = "Submission successfull!";
          return newClaim; // Return the newly created claim
        }
      } catch (error) {
        // Catch any unexpected errors during the submission process
        this.errorMsg = "Something went wrong. Please try submitting again.";
      }
    },
  },
});
</script>

<style scoped>
.text-danger {
  color: red;
}

.text-success {
  color: green;
}
</style>

<template>
  <div>
    <p v-if="errorMsg" class="text-danger" role="alert">{{ errorMsg }}</p>
    <b-button
      @click="handleClick"
      variant="primary"
      :disabled="isButtonDisabled"
      aria-disabled="isButtonDisabled"
    >
      Submit
    </b-button>
    <p v-if="successMsg" class="text-success" role="status">{{ successMsg }}</p>
  </div>
</template>
